// @ts-nocheck

import { XSVto2dArray, XSVtoObjectArray } from '$lib/helpers/Text';

import { createClient } from '@supabase/supabase-js';
import { fail } from '@sveltejs/kit';
import { mapHeaders } from '$lib/helpers/Arrays';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const supabase = createClient(import.meta.env.VITE_SUPABASE_ENDPOINT, import.meta.env.VITE_SUPABASE_KEY);

const fileSchema = z.custom(
    (value) => value instanceof File,
    { message: 'Please upload a file.' },
);

const rowSchema = z.object({
    index: z.number().int(),
    column: z.string(),
});

const mappingSchema = z.array(rowSchema);

const schema = z.object({
    gradeVocabList: fileSchema.optional(),
    frequencyVocabList: fileSchema.optional(),
    sentencesList: fileSchema.optional(),
    columnHeaders: z.string().array(),
    vocabData: z.string(),
});

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const form = await superValidate(schema);
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



