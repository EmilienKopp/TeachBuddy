import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL
} from '$env/static/public';

import type { Handle } from '@sveltejs/kit';
import { Model } from '$lib/models/Model';
import { Profile } from '$lib/models/Profile';
import type { Session } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { locale } from 'svelte-i18n'
import { redirect } from '@sveltejs/kit';

// src/hooks.server.ts

export const handle: Handle = async ({ event, resolve }) => {
  const start = performance.now();

  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
    event
  });

  Model.setConnection(event.locals.supabase);

  /**
   * a little helper that is written for convenience so that instead
   * of calling `const { data: { session } } = await supabase.auth.getSession()`
   * you just call this `await getSession()`
   */
  event.locals.getSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession();
    if (session && session.user) {
      (session.user as any).profile = (await Profile.find(session.user.id)).plain();
    }
    return session;
  };

  event.locals.getProfile = async (): Promise<Model | Profile | null> => {
      return  (await event.locals.getSession())?.user?.profile;
  };

  event.locals.refreshSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.refreshSession();
    if (session) {
      const { data: profileData, error } = await event.locals.supabase.from('profiles').select('*').eq('id', session.user.id).single();
      const { data: studyingLanguages, error: studyingLangError } = await event.locals.supabase.from('studying_languages').select('lang_code').eq('user_id', session.user.id);

      if (studyingLanguages && profileData) {
        profileData.studying_languages = studyingLanguages.map(el => el.lang_code);
        (session.user as any).profile = profileData;
      }
    }
    return session;
  }

  event.locals.profile = await event.locals.getProfile();

  if (event.url.pathname == '/') {
    console.log('Calling getSession from hooks.server.ts');
    const session = await event.locals.getSession();
    if (!session && !['/auth/reset', '/auth/forgot-password'].includes(event.url.pathname)) {
      // the user is not signed in
      throw redirect(303, '/auth/login');
    } else {
      throw redirect(303, '/app/dashboard');
    }
  }

  // protect requests to all routes that start with /app
  if (event.url.pathname.startsWith('/app')) {
    console.log('Calling getSession from hooks.server.ts /app');
    const session = await event.locals.getSession();
    if (!session) {
      // the user is not signed in
      throw redirect(303, '/');
    }
  }

  const lang = event.request.headers.get('accept-language')?.split(',')[0]
  if (lang) {
    locale.set(lang)
  }

  const response = await resolve(event, {
    /**
     * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
     *
     * https://github.com/sveltejs/kit/issues/8061
     */
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    }
  });

  const end = performance.now();
  console.log('TOTAL REQUEST TIME:', Math.round(end - start) + 'ms');
  return response;
};