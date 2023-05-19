// @ts-nocheck

import { message, superValidate } from 'sveltekit-superforms/server';

import { storeUserVocabSchema } from '$lib/config/schemas';
import { toSelectOptions } from '$lib/helpers/Arrays';
import { z } from 'zod';

/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}) {
    
    const { user } = await getSession();

    let { data: passagesData, error } = await supabase.from('passages')
                                                      .select('*, passage_ratings(rating)')
                                                      .eq('owner_id', user.id);
    
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    
    passagesData.map((passage) => { 
        const date = new Date(passage.created_at);
        const formattedDate = date.toLocaleDateString('en-US', dateOptions);
        passage.created_at = formattedDate;
        return passage;
    });

    return { passagesData };
}



