import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent }) => {

    const { supabase, session} = await parent();
    if(!session) throw redirect(303,'/');

    const { data } = await supabase.from('profiles').select('*').eq('id',session.user.id);

    return {
        user: session.user,
        profile: data[0],
    }
};