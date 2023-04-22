// @ts-nocheck

import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';

import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const schema = z.object({
    prompt: z.string().refine( value => value.length > 0, { message: 'Prompt is required' }),
    type: z.number().int().default(1),
    grade: z.number().int().default(1),
    message: z.string().optional(),
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

const grades = [
    { id: 1, name: '1st' },
    { id: 2, name: '2nd' },
    { id: 3, name: '3rd' },
];

const types = [
    { id: 1, name: 'Short Story' },
    { id: 2, name: 'Essay' },
    { id: 3, name: 'Dialog' },
];

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    
    const form = await superValidate(schema);
    return { form, types, grades };
}

export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, schema);
        console.log('POST');
        console.log(form.data);

        // Validation
        if(!form.valid) {
            console.error('Validation failed', form.errors);
            return fail(401, {form});
        }

        const content = `Write a ${types[form.data.type]} understandable by a ${grades[form.data.grade]} grade elementary school student about the theme of: ${form.data.prompt}.`;

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

        console.log(data.choices[0].message);
        form.data.message = data.choices[0].message.content;

        //sleep for 3s
        // await new Promise(r => setTimeout(r, 3000));

        // form.data.message = `        Having friends is really important. Friends are people who are nice to us and make us feel happy. They like to play with us, share things with us, and help us when we need it. 

        // Having friends can be really helpful. Sometimes we feel sad or scared, and having a friend to talk to can make us feel better. And if we have trouble with something we’re doing, a friend can help us figure it out.
        
        // Friends also make life more fun. We can play games together, go on adventures, and laugh a lot. Even just hanging out and talking can be really enjoyable with a good friend.
        
        // It’s important to be a good friend too. We should be kind, reliable, and treat our friends how we would want to be treated. Respect their feelings and beliefs, and appreciate the things they do for us.
        
        // So remember, friends help us when we need it, make life more fun, and can make us feel a lot better when we’re feeling down. It’s important to be a good friend and to cherish the friendships we have.`;
        
        // console.log(form);

        return { form };
    }
}