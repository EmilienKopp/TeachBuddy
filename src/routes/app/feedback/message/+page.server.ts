import type { RequestEvent } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const messageSchema = z.object({
    user_id: z.string().optional(),
    content: z.string().min(2).max(2000),
    email: z.string().email().min(2).max(50).optional(),
    title: z.string().min(2).max(100),
});


/** @type {import('./$types').PageServerLoad} */
export async function load({locals: { supabase, getSession}}: RequestEvent) {

    const { user } = await getSession();

    const form = await superValidate(  messageSchema );

    return { user, form };
}

export const actions = {
    default: async ({ request, locals: { supabase, getSession, refreshSession } }: RequestEvent) => {
        const formData = await request.formData();

        const form = await superValidate(formData, messageSchema);
        
        if(!form.valid) {
            return fail(401, {form});
        }

        const { user } = await getSession();
        
        form.data.email ||= user.email;
        const {error} = await supabase.from('feedback').insert( [{...form.data, user_id: user.id}] );

        if(error) {
            console.error(error);
            return fail(401, {error});
        }
    }
}
