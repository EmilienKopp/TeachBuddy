// @ts-nocheck

import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';

import { AuthApiError } from '@supabase/supabase-js';
import { loginSchema } from '$lib/config/schemas';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const form = await superValidate(loginSchema);
    return { form };
}

export const actions = {
    signin: async({request, locals: { supabase } }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, loginSchema);
        const email = form.data.email;
        const password = form.data.password;

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if(error) {
            if(error instanceof AuthApiError && error.status == 400) {
                return setError(form, 'email', error.message);
            }
            return fail(500, {
                error: 'An unknown error occurred. Try again later',
                values: { email },
            })
        }


        throw redirect(303, '/app/dashboard');

        return { form };
    },   
}