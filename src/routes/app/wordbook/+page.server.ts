import { message, superValidate } from 'sveltekit-superforms/server';

/** @type {import('./$types').PageServerLoad} */
//@ts-nocheck
export async function load({locals: { supabase, getSession}}: any) {

    const { user } = await getSession();

    let { data: vocabData, error } = await supabase.from('user_vocabulary')
                                               .select('id,vocabulary_id, vocabulary(*), custom_translation')
                                               .eq('user_id', user.id)
    let { data: POS, error: PosError } = await supabase.from('parts_of_speech').select('*');
    

    return { vocabData, POS };
}
