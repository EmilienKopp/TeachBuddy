// @ts-nocheck

import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import { message, superValidate } from 'sveltekit-superforms/server';

import {
    OPENAI_API_KEY
} from '$env/static/private';
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
    language: z.string().optional(),
    freeInput: z.boolean().default(false),
    customPrompt: z.string().optional(),
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
    { value: 1, name: 'Short Story' },
    { value: 2, name: 'Essay' },
    { value: 3, name: 'Conversation between two people' },
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
    
    const form = await superValidate(schema);

    let { data: grades, error: gradesError } = await supabase.from('grades').select('*');
    let { data: POS, error: PosError } = await supabase.from('parts_of_speech').select('*');
    let { data: passagesData, error: avgError} = await supabase.from('passages').select('*');
    let { data: languages, error: langError} = await supabase.from('languages').select('lang_code, name_native').neq('name_native',null);

    console.log(languages);

    const averageDuration = passagesData.map( el => el.generation_duration).reduce((a,b) => a+b, 0) / passagesData.length;

    grades = toSelectOptions(grades, 'id', 'name');
    languages = toSelectOptions(languages, 'lang_code', 'name_native');

    return { form, types, grades, topics, POS, languages, averageDuration };
}

export const actions = {
    getPassage: async ({ request, locals: { supabase, getSession } }) => {
        const form = await superValidate(request, schema);
        
        console.log(form)
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

        let content;
        if(form.data.language != 'fr') {
            content = form.data.freeInput ?
                `Write a ${contentType} understandable by an ESL student who has no more than 600 words of vocabulary. Keep the grammar simple. 
                The theme is provided in Japanese, but the passage has to be in English. The theme is: "${topic}". Provide the passage in English.`
                : `Write a ${contentType} understandable by an ESL student who has no more than 600 words of vocabulary about the theme of: "${topic}". Keep the grammar simple.`;
            content += ` The passage won't be longer than 500 words.`;
        } else {
            content = `Ecris une histoire EN FRANCAIS très courte à propos de deux amis qui visitent Paris. 
            L'histoire doit être compréhensible par un étudiant de niveau A1 inférieur. N'utilise que les 300 mots les plus courants de la langue française. Utilise uniquement le présent de l'indicatif.`;
        }
        console.log(content);
        if( form.data.testMode ) {
            console.log('POSTING TO OPENAI', content);
            const response = fetch('https://3cqrx07xfh.execute-api.ap-northeast-1.amazonaws.com/dev/',{
                method: 'POST',
                header: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                    owner_id: user.id,
                    customPrompt: form.data.customPrompt,
                }),
            });
        } 
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
            console.log(insertedData);
        }

        if(error) {
            return message(form,'保存できませんでした 😬')
        }
        
        return message(form, '保存しました 🎉');
    },
}