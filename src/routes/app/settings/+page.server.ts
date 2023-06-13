import { message, superValidate } from 'sveltekit-superforms/server';

import { fail } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
    prompt: z.number().default(1),
    type: z.number().int().default(1),
    grade: z.number().int().default(1),
    testMode: z.boolean().default(false),
    vocabulary_id: z.number().int().optional(),
    custom_translation: z.string().optional(),
    POS: z.string().optional(),
    language: z.string().default('en'),
    freeInput: z.boolean().default(false),
    customPrompt: z.string().optional(),
});

/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}: any) {
    
    const form = await superValidate(schema);


    return { form };
}

export const actions = {
   
}