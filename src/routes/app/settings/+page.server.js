// @ts-nocheck

import { message, superValidate } from 'sveltekit-superforms/server';

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
    language: z.string().default('en'),
    freeInput: z.boolean().default(false),
    customPrompt: z.string().optional(),
});

/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}) {
    
    const form = await superValidate(schema);

    let { data: grades, error: gradesError } = await supabase.from('grades').select('*');
    let { data: languages, error: langError} = await supabase.from('languages').select('lang_code, name_native').neq('name_native',null);

    grades = toSelectOptions(grades, 'id', 'name');
    languages = toSelectOptions(languages, 'lang_code', 'name_native');

    if (gradesError || langError) {
        fail('Failed to load data');
    }

    return { form, grades, languages };
}

export const actions = {
    getPassage: async ({ request, locals: { supabase, getSession } }) => {
        
        return message(form,'SUCCESS!');     
    }
}