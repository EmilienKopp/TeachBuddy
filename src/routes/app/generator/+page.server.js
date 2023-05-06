// @ts-nocheck

import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import { message, superValidate } from 'sveltekit-superforms/server';

import {
    OPENAI_API_KEY
} from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { toSelectOptions } from '$lib/helpers/Arrays';
import { z } from 'zod';

const schema = z.object({
    prompt: z.number().default(1),
    type: z.number().int().default(1),
    grade: z.number().int().default(1),
    testMode: z.boolean().default(false),
    vocabulary_id: z.number().int().optional(),
    custom_translation: z.string().optional(),
    POS: z.string().optional(),
    language: z.string().optional(),
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

const languages = [
    { value: 'en', name: 'English' },
    { value: 'fr', name: 'French' },
    { value: 'ja', name: 'Japanese' },
];

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

    const averageDuration = passagesData.map( el => el.generation_duration).reduce((a,b) => a+b, 0) / passagesData.length;

    grades = toSelectOptions(grades, 'id', 'name');
    POS = toSelectOptions(POS, 'id', 'jp_name');

    return { form, types, grades, topics, POS, languages, averageDuration };
}

export const actions = {
    getPassage: async ({ request, locals: { supabase, getSession } }) => {
        const form = await superValidate(request, schema);

        // Validation
        if(!form.valid) {
            return fail(401, {form});
        }

        const topic = topics.find( elem => elem.value == form.data.prompt).name;
        const contentType = types.find( elem => elem.value == form.data.type).name;
        const { user } = await getSession();

        let content;
        if(form.data.language != 'fr') {
            content = `Write a ${contentType} understandable by an ESL student who has no more than 600 words of vocabulary about the theme of: "${topic}". Keep the grammar simple.`;
        } else {
            content = `Ecris une histoire EN FRANCAIS très courte à propos de deux amis qui visitent Paris. L'histoire doit être compréhensible par un étudiant de niveau A1 inférieur. Utilise uniquement le présent de l'indicatif.`;
        }

        if( form.data.testMode ) {
            // console.log('POSTING TO OPENAI', content);
            // const completion = await openAI.createChatCompletion({
            //     model: 'gpt-3.5-turbo',
            //     messages: [
            //         {
            //             role: "user", 
            //             content: content
            //         }
            //     ],
            // });
        
            // const data = completion.data;
            // form.data.message = data.choices[0].message.content;
            console.log('POSTING TO OPENAI', content);
            const response = fetch('https://3cqrx07xfh.execute-api.ap-northeast-1.amazonaws.com/dev/',{
                method: 'POST',
                header: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                    owner_id: user.id,
                }),
            });
        } else {
            // sleep for 3s
            await new Promise(r => setTimeout(r, 1000));

            // DUMMY for dev mode
            form.data.message = `        Having friends is really important. Friends are people who are nice to us and make us feel happy. They like to play with us, share things with us, and help us when we need it. 
    
            Having friends can be really helpful. Sometimes we feel sad or scared, and having a friend to talk to can make us feel better. And if we have trouble with something we’re doing, a friend can help us figure it out.
            
            Friends also make life more fun. We can play games together, go on adventures, and laugh a lot. Even just hanging out and talking can be really enjoyable with a good friend.
            
            It’s important to be a good friend too. We should be kind, reliable, and treat our friends how we would want to be treated. Respect their feelings and beliefs, and appreciate the things they do for us.
            
            So remember, friends help us when we need it, make life more fun, and can make us feel a lot better when we’re feeling down. It’s important to be a good friend and to cherish the friendships we have.`;
    
        }
        return message(form,'SUCCESS!');     
    },
    storeUserVocab: async ({ request, locals: { supabase, getSession } }) => {
        //TODO: exclude passage from the form input before posting
        const formData = await request.formData();

        const storeUserVocabSchema = z.object({
            prompt: z.number().default(1),
            type: z.number().int().default(1),
            grade: z.number().int().default(1),
            vocabulary_id: z.number().int(),
            custom_translation: z.string().optional(),
            POS: z.string().optional(),
        });
            
        const form = await superValidate(formData, storeUserVocabSchema);

        if(!form.valid) {
            return fail(401, {form});
        }

        const { user } = await getSession();

        const { vocabulary_id, custom_translation } = form.data;

        console.log('WILL INSERT:',user.id,vocabulary_id,custom_translation);

        const { data: insertedData, error } = await supabase.from('user_vocabulary').insert([
            { user_id: user.id, vocabulary_id, custom_translation }
        ]).select();

        console.log('Inserting:', insertedData, error);

        if(error) {
            return message(form,'保存できませんでした 😬')
        }
        
        return message(form, '保存しました 🎉');
    },
}