// @ts-nocheck

import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import {
    ENV,
    OPENAI_API_KEY
} from '$env/static/private';
import { getLastGeneratedDate, isAllowedToGenerate } from '$lib/logic/passages';
import { message, superValidate } from 'sveltekit-superforms/server';

import { costToGenerate } from '$lib/logic/points';
import { fail } from '@sveltejs/kit';
import { pointStore } from '$lib/stores';
import { storeUserVocabSchema } from '/src/config/schemas';
import { toSelectOptions } from '$lib/helpers/Arrays';
import { z } from 'zod';

const schema = z.object({
    prompt: z.number().default(1),
    type: z.number().int().default(1),
    grade: z.number().int().optional(),
    testMode: z.boolean().default(true),
    vocabulary_id: z.number().int().optional(),
    custom_translation: z.string().optional(),
    POS: z.string().optional(),
    language: z.string().optional().default('en'),
    freeInput: z.boolean().default(false),
    customPrompt: z.string().optional(),
    length: z.number().int().default(300),
    quality: z.string().default('3.5'),
});


const config = new Configuration({
    apiKey: OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY,
    baseOptions: {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    },
});

const openAI = new OpenAIApi(config);

let qualityLevels = [
    { value: '3', name: 'Trial・お試し', multiplier: 0 },
    { value: '3.5', name: 'Fast・速い', multiplier: 1 },
    { value: '4', name: 'High・高品質', multiplier: 1.5 },
];

const topics = [
    { value: 1, name: 'Friendship' },
    { value: 2, name: 'Family' },
    { value: 3, name: 'School' },
    { value: 4, name: 'Hobbies' },
    { value: 5, name: 'Sports' },
    { value: 6, name: 'Food' },
    { value: 7, name: 'Animals' },
    { value: 8, name: "Tom's summer vacation" },
    { value: 9, name: 'The best day of my life' },
    { value: 10, name: 'My favorite place' },
    { value: 11, name: 'My favorite food' },
    { value: 12, name: 'Why do we study English?' },
    { value: 13, name: 'Introducing Japan to my foreign friends' },
]

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals: { supabase, getSession}}) {
    console.time('generator+server_load')
    const user = (await getSession()).user;
    const form = await superValidate(schema);

    const types = async() => {
        console.log('types', Date.now());
        const { data, error} = await supabase.from('passage_types').select('id, name').neq('name',null);
        if(error) {
            console.error(error);
            return [];
        }
        return data;
    }

    const languages = async() => {
        console.log('languages', Date.now());
        const { data, error} = await supabase.from('languages').select('lang_code, name_native').in('lang_code',user.profile.studying_languages);
        if(error) {
            console.error(error);
            return [];
        }
        return data;
    }

    const lengths = async() => {
        console.log('lengths', Date.now());
        const { data, error} = await supabase.from('passage_lengths').select('label, word_count, available_for_trial');
        // For now, manually reformat the 'label' field to be more readable with the word count
        data.map( elem => elem.label = `${elem.label} (~${elem.word_count} words)`);
        if(error) {
            console.error(error);
            return [];
        }
        return data;
    }

    const topics = async() => {
        console.log('topics', Date.now());
        const { data, error} = await supabase.from('topics').select('id, prompt').in('target_language',user.profile.studying_languages);
        if(error) {
            console.error(error);
            return [];
        }
        return data;
    }

    const qualityMultiplier = qualityLevels.find( elem => elem.value == form.data.quality).multiplier;

    console.log('allowed', Date.now());
    const allowed = async() => await isAllowedToGenerate(supabase, user, form.data.length, qualityMultiplier, form.data.quality);

    console.timeEnd('generator+server_load')
    return { 
        form, qualityLevels, ENV, 
        types: types(), 
        topics: topics(), 
        languages: languages(),
        lengths: lengths(), 
        allowed: allowed(),
    };
}

export const actions = {
    getPassage: async ({ request, locals: { supabase, getSession } }) => {
        const form = await superValidate(request, schema);
        const { user } = await getSession();
        
        // Validation
        if(!form.valid) {
            return fail(401, {form});
        }

        // Content type
        let contentType;
        const { data: typesData, error: typesError} = await supabase.from('passage_types').select('name_en').eq('id',form.data.type).single();
        if(typesError) {
            console.error(typesError);
            return fail(500, {typesError});
        } 
        contentType = typesData.name;
    

        // Topic
        let topic;
        if(form.data.freeInput) {
            topic = form.data.customPrompt;
        } else {
            const { data: topicData, error: topicError} = await supabase.from('topics').select('prompt').eq('id',form.data.prompt).single();
            if(topicError) {
                console.error(topicError);
                return fail(500, {topicError});
            }
            topic = topicData.prompt;
        }
        
        
        // Language
        let language;
        const { data: langData, error: langError} = await supabase.from('languages').select('name_en').eq('lang_code',form.data.language).single();
        if(langError) {
            console.error(langError);
            return fail(500, {langError});
        }
        // Deal with the fact that some languages have composite names
        if(langData) {
            let split = langData.name_en.split(';');
            language = split.length > 0 ? split[split.length - 1] : langData.name_en;
        } else {
            language = 'en';
        }

        // Prompt
        let content = `Write a ${contentType} understandable by a student who has no more than 600 words of vocabulary. Keep the grammar simple. 
                The theme is provided in a non ${language} language, but the passage has to be in ${language}. The theme is: "${topic}". Provide the passage in ${language}.
                The passage won't be longer than ${form.data.length} words.
                After the passage, provide a list of the 10 most difficult words you used, followed by their translation in ${user.profile.native_language ?? 'Japanese'}.
                Finally, ask a COMPREHENSION QUESTION about the passage (not a yes/no question).`;

        const qualityMultiplier = qualityLevels.find( elem => elem.value == form.data.quality).multiplier;

        if(! await isAllowedToGenerate(supabase, user, form.data.length, qualityMultiplier, form.data.quality)) 
            return fail(401, {form, error: 'You have reached your limit of generations.'})

        if( form.data.testMode) {
            console.log("POSTING TO GENERATOR API");
            const response = fetch('https://3cqrx07xfh.execute-api.ap-northeast-1.amazonaws.com/dev/',{
                method: 'POST',
                header: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                    owner_id: user.id,
                    customPrompt: form.data.customPrompt,
                    quality: form.data.quality,
                    language: form.data.language,
                    topic: topic,
                }),
            });

            
            
            const { data: actionsData, error: actionsError } = await supabase.from('actions').select('*').eq('verb', 'generate').single();
            const { data: pointsData, error: pointsError} = await supabase.from('points_master').select('amount, multiplier').eq('action_id', actionsData.id).single();
            const { data: userProfile, error: profileError} = await supabase.from('profiles').select('*').eq('id', user.id).single();

            const cost = costToGenerate(form.data.length, pointsData.multiplier);

            const {data:updateData, error} = await supabase.from('profiles').update({point_balance: userProfile.point_balance - cost}).eq('id', user.id).select();
           
        } 
        // The passage is generated by the OpenAI API and stored in the database by an AWS Microservice.
        // It is then retrieved from the database through Supabases's realtime API and displayed on the frontend.
        return { form };     
    },
    storeUserVocab: async ({ request, locals: { supabase, getSession } }) => {
        //TODO: exclude passage from the form input before posting
        const formData = await request.formData();

        
            
        const form = await superValidate(formData, storeUserVocabSchema);

        if(!form.valid) {
            return fail(401, {form});
        }

        const { user } = await getSession();

        // Custom Translation
        if(form.data.custom_translation) {
            const { vocabulary_id, custom_translation } = form.data;
            const { data: insertedData, error } = await supabase.from('user_vocabulary').insert([
                { user_id: user.id, vocabulary_id, custom_translation }
            ]).select();
        } else {
            const vocabularyArray = form.data.vocabulary_id;
            vocabularyArray.map((vocab) => {
               return  { user_id: user.id, vocabulary_id: vocab.id }
            });
            const { data: insertedData, error } = await supabase.from('user_vocabulary').insert(vocabularyArray).select();
        }

        if(error) {
            return message(form,'保存できませんでした 😬')
        }
        
        return message(form, '保存しました 🎉');
    },
}