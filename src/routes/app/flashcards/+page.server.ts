import type { RequestEvent } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}: RequestEvent) {

    const { user } = await getSession();

    let { data: vocabData, error } = await supabase.from('user_vocabulary')
                                               .select('vocabulary_id, vocabulary(*), custom_translation')
                                               .eq('user_id', user.id)

    return { vocabData };
}
