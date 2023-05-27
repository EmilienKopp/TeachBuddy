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
import { storeUserVocabSchema } from '$lib/config/schemas';
import { toSelectOptions } from '$lib/helpers/Arrays';
import { z } from 'zod';

const schema = z.object({
    prompt: z.number().default(1),
    type: z.number().int().default(1),
    grade: z.number().int().optional(),
    testMode: z.boolean().default(false),
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

const types = [
    { value: 1, name: 'Fictional Story' },
    { value: 2, name: 'Essay' },
    { value: 3, name: 'Conversation between two people' },
];

let lengths = [
    { value: 100, name: 'S (~100 words)', allowedForTrial: true},
    { value: 300, name: 'M (~300 words)', allowedForTrial: true},
    { value: 500, name: 'L (~500 words)', allowedForTrial: false},
    { value: 1000, name: 'XL (~1000 words)', allowedForTrial: false},
];

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
export async function load({locals: { supabase, getSession}}) {

    const { user } = await getSession();
    
    const form = await superValidate(schema);

    let { data: grades, error: gradesError } = await supabase.from('grades').select('*');
    let { data: POS, error: PosError } = await supabase.from('parts_of_speech').select('*');
    let { data: passagesData, error: avgError} = await supabase.from('passages').select('*');
    let { data: languages, error: langError} = await supabase.from('languages').select('lang_code, name_native').neq('name_native',null);

    const averageDuration = passagesData.map( el => el.generation_duration).reduce((a,b) => a+b, 0) / passagesData.length;

    grades = toSelectOptions(grades, 'id', 'name');
    languages = toSelectOptions(languages, 'lang_code', 'name_native');

    const qualityMultiplier = qualityLevels.find( elem => elem.value == form.data.quality).multiplier;

    const allowed = await isAllowedToGenerate(supabase, user, form.data.length, qualityMultiplier, form.data.quality);

    return { form, types, grades, topics, POS, languages, averageDuration, ENV, lengths, qualityLevels, allowed };
}

export const actions = {
    getPassage: async ({ request, locals: { supabase, getSession } }) => {
        const form = await superValidate(request, schema);
        
        // Validation
        if(!form.valid) {
            return fail(401, {form});
        }

        let topic;
        if(form.data.freeInput) {
            topic = form.data.customPrompt;
        } else {
            topic = topics.find( elem => elem.value == form.data.prompt).name;
        }
        
        const contentType = types.find( elem => elem.value == form.data.type).name;

        const { user } = await getSession();
        const { data, error} = await supabase.from('languages').select('name_en').eq('lang_code',form.data.language).single();

        let language;

        if(data) {
            let split = data.name_en.split(';');
            language = split.length > 0 ? split[split.length - 1] : data.name_en;
        } else {
            language = 'en';
        }

        let content = `Write a ${contentType} understandable by a student who has no more than 600 words of vocabulary. Keep the grammar simple. 
                The theme is provided in a non ${language} language, but the passage has to be in ${language}. The theme is: "${topic}". Provide the passage in ${language}.
                The passage won't be longer than ${form.data.length} words.`;

        const qualityMultiplier = qualityLevels.find( elem => elem.value == form.data.quality).multiplier;

        console.log(`isAllowedToGenerate: ${await isAllowedToGenerate(supabase, user, form.data.length, qualityMultiplier, form.data.quality)}`);
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

            const {error} = await supabase.from('profiles').update({point_balance: userProfile.point_balance - cost}).eq('id', user.id);
        } 
        // The passage is generated by the OpenAI API and stored in the database by an AWS Microservice.
        // It is then retrieved from the database through Supabases's realtime API and displayed on the frontend.
        return message(form,'SUCCESS!');     
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