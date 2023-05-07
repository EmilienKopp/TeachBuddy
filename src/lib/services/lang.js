// @ts-nocheck

import {
    PUBLIC_SUPABASE_ANON_KEY,
    PUBLIC_SUPABASE_URL
} from '$env/static/public';

import { createClient } from '@supabase/auth-helpers-sveltekit';

export async function _(word) {

    // const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);


    throw new Error('Not implemented');

    // return word;
}