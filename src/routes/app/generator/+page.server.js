// @ts-nocheck

import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import { message, superValidate } from 'sveltekit-superforms/server';

import { fail } from '@sveltejs/kit';
import { toSelectOptions } from '$lib/helpers/Arrays';
import { z } from 'zod';

const schema = z.object({
    prompt: z.number().default(1),
    type: z.number().int().default(1),
    grade: z.number().int().default(1),
    message: z.string().optional(),
    testMode: z.boolean().default(false),
    vocabulary_id: z.number().int().optional(),
    custom_translation: z.string().optional(),
});



const config = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    baseOptions: {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    },
});

const openAI = new OpenAIApi(config);

const types = [
    { value: 1, label: 'Short Story' },
    { value: 2, label: 'Essay' },
    { value: 3, label: 'Conversation between two people' },
];

const topics = [
    { value: 1, label: 'Friendship' },
    { value: 2, label: 'Family' },
    { value: 3, label: 'School' },
    { value: 4, label: 'Hobbies' },
    { value: 5, label: 'Sports' },
    { value: 6, label: 'Food' },
    { value: 7, label: 'Animals' },
    { value: 8, label: "Tom's summer vacation" },
    { value: 9, label: 'The best day of my life' },
    { value: 10, label: 'My favorite place' },
    { value: 11, label: 'My favorite food' },
    { value: 12, label: 'Why do we study English?' },
    { value: 13, label: 'Introducing Japan to my foreign friends' },
]

/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}) {
    
    const form = await superValidate(schema);

    let { data: grades, error } = await supabase.from('grades').select('*');
    grades = toSelectOptions(grades, 'id', 'name')
    console.log(grades);

    return { form, types, grades, topics };
}

export const actions = {
    getPassage: async ({ request }) => {
        const form = await superValidate(request, schema);

        // Validation
        if(!form.valid) {
            return fail(401, {form});
        }

        const topic = topics.find( elem => elem.id = form.data.prompt).option;
        const contentType = types.find( elem => elem.id = form.data.type).option;
        const content = `Write a ${contentType} understandable by an ESL student who has no more than 600 words of vocabulary about the theme of: "${topic}". Keep the grammar simple.`;
        
        if( form.data.testMode ) {
            const completion = await openAI.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: "user", 
                        content: content
                    }
                ],
            });
        
            const data = completion.data;
            form.data.message = data.choices[0].message.content;
        
        } else {
            // sleep for 3s
            await new Promise(r => setTimeout(r, 1000));

            form.data.message = `        Having friends is really important. Friends are people who are nice to us and make us feel happy. They like to play with us, share things with us, and help us when we need it. 
    
            Having friends can be really helpful. Sometimes we feel sad or scared, and having a friend to talk to can make us feel better. And if we have trouble with something we’re doing, a friend can help us figure it out.
            
            Friends also make life more fun. We can play games together, go on adventures, and laugh a lot. Even just hanging out and talking can be really enjoyable with a good friend.
            
            It’s important to be a good friend too. We should be kind, reliable, and treat our friends how we would want to be treated. Respect their feelings and beliefs, and appreciate the things they do for us.
            
            So remember, friends help us when we need it, make life more fun, and can make us feel a lot better when we’re feeling down. It’s important to be a good friend and to cherish the friendships we have.`;
        }

        return message(form,'SUCCESS!')
    },
    storeUserVocab: async ({ request, locals: { supabase, getSession } }) => {
        //TODO: exclude passage from the form input before posting
        const formData = await request.formData();

        const storeUserVocabSchema = z.object({
            vocabulary_id: z.number().int().optional(),
            custom_translation: z.string().optional(),
        });
            
        const form = await superValidate(formData, storeUserVocabSchema);

        if(!form.valid) {
            return fail(401, {form});
        }

        const { user } = await getSession();
        console.log(user);

        const { vocabulary_id, custom_translation } = form.data;

        console.log(user.id,vocabulary_id,custom_translation);

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