// @ts-nocheck

import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { registerSchema } from '$lib/config/schemas';
import { superValidate } from 'sveltekit-superforms/server';
import { toSelectOptions } from '$lib/helpers/Arrays';

/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}) {
    const form = await superValidate(registerSchema);
    let { data: languages, error: langError} = await supabase.from('languages').select('lang_code, name_native').neq('name_native',null);
    languages = toSelectOptions(languages, 'lang_code', 'name_native');
    return { form, languages };
}

export const actions = {
    default: async ({ request, locals: {supabase,getSession} }) => {
        
        const session = await getSession();
        const formData = await request.formData();
        const form = await superValidate(formData, registerSchema);
        console.log(form);
        if (!form.valid) {
            return fail(400, { form });
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: form.data.email,
            password: form.data.password,
            options: {
                data: {
                    username: form.data.username,
                    user_number: form.data.user_number,
                    native_language: form.data.native_language,
                },
                emailRedirectTo: '/app/dashboard'
            }
        });

        if(signUpError) {
            return fail(400, { form });
        } else {                                                                             
            throw redirect(300,'/auth/confirmation');
        }
        

        return { form };
    },
}



