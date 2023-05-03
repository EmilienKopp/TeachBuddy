// @ts-nocheck

import { createClient } from '@supabase/supabase-js';
import { fail } from '@sveltejs/kit';
import { mapHeaders } from '$lib/helpers/Arrays';
import { superValidate } from 'sveltekit-superforms/server';
import { vocabSettingsSchema } from '$lib/config/schemas';

const supabase = createClient(import.meta.env.VITE_SUPABASE_ENDPOINT, import.meta.env.VITE_SUPABASE_KEY);

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const form = await superValidate(vocabSettingsSchema);
 
    const {data: grades,error} = await supabase.from('grades').select('*');
    console.log(grades);
    return { form, grades };
}

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, schema);


        return { form };
    },
}


