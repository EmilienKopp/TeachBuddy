// @ts-nocheck

import { message, superValidate } from 'sveltekit-superforms/server';

import { storeUserVocabSchema } from '/src/config/schemas';
import { toSelectOptions } from '$lib/helpers/Arrays';
import { z } from 'zod';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent,params,locals: { supabase}}) {
    const parentData = await parent();
    const form = await superValidate(storeUserVocabSchema);

    const passage = parentData.passages.find((passage) => passage.id == params.id);
    
    return { passage, form };
}

export const actions = {
    storeUserVocab: async ({ request, locals: { supabase, getSession } }) => {
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
        }

        if(error) {
            return message(form,'保存できませんでした 😬')
        }
        
        return message(form, '保存しました 🎉');
    },
}