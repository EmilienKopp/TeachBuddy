import { message, superValidate } from 'sveltekit-superforms/server';
import { storeUserVocabSchema, titleEditSchema } from '/src/config/schemas';

import { Passage } from '$lib/models/Passage';
import type { RequestEvent } from '../$types';
import type { Word } from '$lib/types';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

// import { PEXELS_API_KEY } from '$env/static/private';



/** @type {import('./$types').PageServerLoad} */
export async function load({ request, params, locals: { supabase}}: RequestEvent) {

    const storeUserVocabForm = await superValidate(storeUserVocabSchema, {id: 'storeUserVocabForm'});

    const passageData = await supabase.from('passages').select().eq('id', (params as any).id).single();    

    const {id, title}: any = passageData.data;

    const titleEditForm = await superValidate({title}, titleEditSchema, {id: 'titleEditForm'});

    return { passageData, storeUserVocabForm, titleEditForm };
}

export const actions = {
    updatePassageTitle: async ({ request, params, locals: { supabase, getSession } }: RequestEvent) => {

        console.log('updatePassageTitle')

        const formData = await request.formData();
        
        const form = await superValidate(formData, titleEditSchema);

        if(!form.valid) {
            return fail(401, {form});
        }

        

        await Passage.edit((params as any).id, form.data, supabase);

        return { form };
    },
    storeUserVocab: async ({ request, locals: { supabase, getSession } }: any) => {
        const formData = await request.formData();
            
        const form = await superValidate(formData, storeUserVocabSchema);

        if(!form.valid) {
            return fail(401, {form});
        }

        const { user } = await getSession();

        let error;

        // Custom Translation
        if(form.data.custom_translation) {
            const { vocabulary_id, custom_translation } = form.data;
            const { data: insertedData, error: error } = await supabase.from('user_vocabulary').insert([
                { user_id: user.id, vocabulary_id, custom_translation }
            ]).select();
        } else {
            const vocabularyArray = form.data.vocabulary_id;
            vocabularyArray.map((vocab: Word) => {
               return  { user_id: user.id, vocabulary_id: vocab.id }
            });
            const { data: insertedData, error: error } = await supabase.from('user_vocabulary').insert(vocabularyArray).select();
        }

        if(error) {
            return message(form,'保存できませんでした 😬')
        }
        
        return message(form, '保存しました 🎉');
    },
}