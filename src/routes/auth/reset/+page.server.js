// @ts-nocheck

import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { resetSchema } from '/src/config/schemas';
import { superValidate } from 'sveltekit-superforms/server';
import { toSelectOptions } from '$lib/helpers/Arrays';

/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}) {
    const form = await superValidate(resetSchema);

    return { form };
}

export const actions = {
    default: async ({ request, locals: {supabase,getSession} }) => {
        
        const session = await getSession();
        const formData = await request.formData();
        const form = await superValidate(formData, resetSchema);

        if (!form.valid || formData.get('password') !== formData.get('password_confirm')) {
            return fail(400, { form });
        }

        const { data, error } = await supabase.auth.updateUser({
            password: form.data.password,
        })


        if(error) {
            return fail(400, { form });
        } else {                                                                             
            throw redirect(300,'/auth/login');
        }
    },
}



