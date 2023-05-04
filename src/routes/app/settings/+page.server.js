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
    let { data: vocabularyData, error } = await supabase.from('vocabulary').select('*');

    const vocabColumns = vocabularyData ? Object.keys(vocabularyData[0]) : [];

    return { form, vocabColumns, vocabularyData};
}

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, vocabSettingsSchema);
        let list, delimiter, fileData,  columnHeaders;
        if (!form.valid) return fail(400, { form });

        let listData = JSON.parse(form.data.vocabData);
        listData.splice(0, 1);
        
        // transform listData into an array of objects that have the column headers as keys
        listData = mapHeaders(form.data.columnHeaders,listData);
        listData = listData.filter((el) => /^[a-zA-Z0-9]*$/.test(el.en_word) );

        const {data, error} = await supabase.from('vocabulary').insert(listData);

        return { form };
    },
}



