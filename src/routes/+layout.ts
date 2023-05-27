import {
    PUBLIC_SUPABASE_ANON_KEY,
    PUBLIC_SUPABASE_URL
} from '$env/static/public';

import type { Database } from '../DatabaseDefinitions';
import type { LayoutLoad } from './$types';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

    const supabase = createSupabaseLoadClient<Database>({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event: { fetch },
        serverSession: data.session
    });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if(session) {
        const { data: profileData, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        const { data: studyingLanguages, error: studyingLangError} = await supabase.from('studying_languages').select('lang_code').eq('user_id', session.user.id);

        if(studyingLanguages && profileData) {
            profileData.studying_languages = studyingLanguages.map(el => el.lang_code);
            (session.user as any).profile = profileData;
        }
    }


    return { supabase, session };
};