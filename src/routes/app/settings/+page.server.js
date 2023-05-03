// @ts-nocheck

import {
    PUBLIC_SUPABASE_ANON_KEY,
    PUBLIC_SUPABASE_URL
} from '$env/static/public';

import { createClient } from '@supabase/supabase-js';
import { fail } from '@sveltejs/kit';
import { mapHeaders } from '$lib/helpers/Arrays';
import { superValidate } from 'sveltekit-superforms/server';
import { vocabSettingsSchema } from '$lib/config/schemas';

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const form = await superValidate(vocabSettingsSchema);
    let { data: Vocabulary, error } = await supabase.from('Vocabulary').select('*');

    const vocabColumns = Vocabulary ? Object.keys(Vocabulary[0]) : [];

    return { form, vocabColumns, Vocabulary};
}

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, schema);
        let list, delimiter, fileData,  columnHeaders;
        if (!form.valid) return fail(400, { form });

        let listData = JSON.parse(form.data.vocabData);
        
        console.log(form);

        listData.splice(0, 1);
        listData = listData.filter((row) => row.every((cell) => /^[a-zA-Z0-9]*$/.test(cell) ));
        
        // transform listData into an array of objects that have the column headers as keys
        listData = mapHeaders(form.data.columnHeaders,listData);

        console.log(form.data.columnHeaders, listData);

        const {data, error} = await supabase.from('vocabulary').insert(listData);

        console.log(data, error);

        return { form };
    },
}



