// @ts-nocheck

import { XSVto2dArray, XSVtoObjectArray } from '$lib/helpers/Text';

import { createClient } from '@supabase/supabase-js';
import { fail } from '@sveltejs/kit';
import { mapHeaders } from '$lib/helpers/Arrays';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const schema = z.object({
    username: z.string().min(3).max(20),
    user_number: z.string().min(3).max(20).optional(),
    password: z.string().min(4).max(100),
    password_confirm: z.string().min(4).max(100),
    email: z.string().email(),
});

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const form = await superValidate(schema);
    return { form };
}

export const actions = {
    default: async ({ request, locals: {supabase,getSession} }) => {
        const session = await getSession();
        console.log(session);
        const formData = await request.formData();
        const form = await superValidate(formData, schema);

        if (!form.valid) {
            console.log(form);
            return fail(400, { form });
        }

        const { data, error } = await supabase.auth.signUp({
            email: form.data.email,
            password: form.data.password,
        });
        console.log(data, error);

        return { form };
    },
}



