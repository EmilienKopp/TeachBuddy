import '$lib/i18n' // Import to initialize. Important :)

import {
    PUBLIC_SUPABASE_ANON_KEY,
    PUBLIC_SUPABASE_URL
} from '$env/static/public';
import { locale, waitLocale } from 'svelte-i18n'

import type { CustomUser } from '$lib/types';
import type { Database } from '$lib/supabase';
import type { LayoutLoad } from './$types';
import { Model } from '$lib/models/Model';
import { Profile } from '$lib/models/Profile';
import type { RequestEvent } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutLoad = async ({ fetch, data, depends }: RequestEvent | any) => {
    console.time('layout.ts_load')
    depends('supabase:auth');

    const supabase = createSupabaseLoadClient<Database>({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event: { fetch },
        serverSession: data.session
    });

    Model.setConnection(supabase);

    const session = data.session;

    

    if(session) {
        const profile = await Profile.from(data.profile);
        if (browser && !profile?.native_language) {
            console.log('Setting locale to', window.navigator.language);
            locale.set(window.navigator.language)
        } else {
            console.log('Setting locale to', profile.native_language);
            locale.set(profile.native_language)
        }
    }

	await waitLocale()
    console.timeEnd('layout.ts_load')
    return { supabase, session,  };
};