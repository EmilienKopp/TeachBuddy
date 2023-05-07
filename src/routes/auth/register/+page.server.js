// @ts-nocheck

import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { registerSchema } from '$lib/config/schemas';
import { superValidate } from 'sveltekit-superforms/server';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const form = await superValidate(registerSchema);
    return { form };
}

export const actions = {
    default: async ({ request, locals: {supabase,getSession} }) => {
        const session = await getSession();
        const formData = await request.formData();
        const form = await superValidate(formData, registerSchema);

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
                },
                emailRedirectTo: '/app/dashboard'
            }
        });

        if(signUpError) {
            return fail(400, { form });
        } else {
            // Create Profile
            const { data: profileData, error: profileError } = await supabase.from('profiles')
                                                                             .insert({ id: signUpData.user.id, 
                                                                                username: form.data?.username, 
                                                                                user_number: form.data.user_number,
                                                                                native_language: form.data.lang_code,
                                                                                created_at: Date.now(),
                                                                             }).select();
            throw redirect(300,'/app/account');
        }
        

        return { form };
    },
}



