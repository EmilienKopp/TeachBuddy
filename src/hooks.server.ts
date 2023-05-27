// src/hooks.server.ts

import {
    PUBLIC_SUPABASE_ANON_KEY,
    PUBLIC_SUPABASE_URL
} from '$env/static/public';

import type { Handle } from '@sveltejs/kit';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.supabase = createSupabaseServerClient({
      supabaseUrl: PUBLIC_SUPABASE_URL,
      supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
      event
    });
  
    /**
     * a little helper that is written for convenience so that instead
     * of calling `const { data: { session } } = await supabase.auth.getSession()`
     * you just call this `await getSession()`
     */
    event.locals.getSession = async () => {
      const {
        data: { session }
      } = await event.locals.supabase.auth.getSession();
      if(session) {
        const { data: profileData, error } = await event.locals.supabase.from('profiles').select('*').eq('id', session.user.id).single();
        const { data: studyingLanguages, error: studyingLangError} = await event.locals.supabase.from('studying_languages').select('lang_code').eq('user_id', session.user.id);

        if(studyingLanguages && profileData) {
            profileData.studying_languages = studyingLanguages.map(el => el.lang_code);
            (session.user as any).profile = profileData;
        }
      }
      return session;
    };

    event.locals.refreshSession = async () => {
      const {
        data: { session }
      } = await event.locals.supabase.auth.refreshSession();
      if(session) {
        const { data: profileData, error } = await event.locals.supabase.from('profiles').select('*').eq('id', session.user.id).single();
        const { data: studyingLanguages, error: studyingLangError} = await event.locals.supabase.from('studying_languages').select('lang_code').eq('user_id', session.user.id);
        
        if(studyingLanguages && profileData) {
          profileData.studying_languages = studyingLanguages.map(el => el.lang_code);
          (session.user as any).profile = profileData;
        }
      }
      return session;
    }

    if(event.url.pathname == '/') {
      const session = await event.locals.getSession();
      if (!session) {
        // the user is not signed in
        throw redirect(303, '/auth/login');
      } else {
        throw redirect(303, '/app/dashboard');
      }
    }
    
    // protect requests to all routes that start with /protected-routes
    if (event.url.pathname.startsWith('/app') ) {
      const session = await event.locals.getSession();
      if (!session) {
        // the user is not signed in
        throw redirect(303, '/');
      }
    }

    return resolve(event, {
      /**
       * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
       *
       * https://github.com/sveltejs/kit/issues/8061
       */
      filterSerializedResponseHeaders(name) {
        return name === 'content-range';
      }
    });
  };