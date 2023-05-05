// @ts-nocheck

import { message, superValidate } from 'sveltekit-superforms/server';

/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}) {

    const { user } = await getSession();

    let { data: vocabData, error } = await supabase.from('user_vocabulary')
                                               .select('id,vocabulary_id, vocabulary(*), custom_translation')
                                               .eq('user_id', user.id)

    return { vocabData };
}
