// @ts-nocheck

import { message, superValidate } from 'sveltekit-superforms/server';

import { createClient } from 'pexels';
import { storeUserVocabSchema } from '/src/config/schemas';

// import { PEXELS_API_KEY } from '$env/static/private';



/** @type {import('./$types').PageServerLoad} */
export async function load({ parent,params,locals: { supabase}}) {

    
    const parentData = await parent();
    const form = await superValidate(storeUserVocabSchema);

    // const pxl = createClient(PEXELS_API_KEY);

    const passage = parentData.passages.find((passage) => passage.id == params.id);

    // const query = passage.topic_string;
    
    // const {photos} = await pxl.photos.search({ query, per_page: 30 });

    // console.log('PEXELS', photos);

    // const pic = random(photos);
    
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