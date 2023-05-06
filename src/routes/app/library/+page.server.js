// @ts-nocheck

import { toSelectOptions } from '$lib/helpers/Arrays';

/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}) {

    const { user } = await getSession();

    let { data: passagesData, error } = await supabase.from('passages').select('*').eq('owner_id', user.id);
    let { data: POS, error: PosError } = await supabase.from('parts_of_speech').select('*');
    POS = toSelectOptions(POS, 'id', 'jp_name');
    
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    
    passagesData.map((passage) => { 
        const date = new Date(passage.created_at);
        const formattedDate = date.toLocaleDateString('en-US', dateOptions);

        passage.created_at = formattedDate;

        return passage;
    });

    return { passagesData, POS };
}
