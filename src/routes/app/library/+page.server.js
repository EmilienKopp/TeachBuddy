// @ts-nocheck

import { message, superValidate } from 'sveltekit-superforms/server';

import { storeUserVocabSchema } from '/src/config/schemas';
import { toSelectOptions } from '$lib/helpers/Arrays';
import { z } from 'zod';

/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}) {
    
    const { user } = await getSession();
    

    return { user };
}



