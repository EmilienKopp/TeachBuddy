// @ts-nocheck

import type { PageLoad } from './$types';
import { createClient } from '@supabase/supabase-js'
import { fail } from '@sveltejs/kit';
import { mapHeaders } from '$lib/helpers/Arrays';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

// const supabase = createClient( import.meta.env.VITE_SUPABASE_ENDPOINT, import.meta.env.VITE_SUPABASE_KEY);

const schema = z.object({
    username: z.string().min(3).max(20),
    user_number: z.string().min(3).max(20),
    password: z.string().min(8).max(100),
    password_confirm: z.string().min(8).max(100),
    email: z.string().email(),
});

export async function load ({ parent }): PageLoad {
    const form = await superValidate(schema);
    return { form };
}

