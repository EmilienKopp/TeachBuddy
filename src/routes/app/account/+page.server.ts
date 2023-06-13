import { languagesSettingsSchema, userBasicInfoSchema } from '/src/config/schemas';
import { message, superValidate } from 'sveltekit-superforms/server';

import type { Language } from '$lib/types';
import { Profile } from '$lib/models/Profile';
import type { RequestEvent } from '../$types';
import { fail } from '@sveltejs/kit';
import { toSelectOptions } from '$lib/helpers/Arrays';
import { vertical } from '$lib/helpers/Arrays';
import { z } from 'zod';

/** @type {import('./$types').PageServerLoad} */
export async function load({request, locals: { supabase, getSession}}: RequestEvent) {
    console.log('LOAD @ account+page.server.js');
    console.time('account+server_load');

    const { user } = await getSession();
    const userProfile = new Profile(user.profile);

    let infoForm, langForm;

    infoForm = await superValidate( user.profile,userBasicInfoSchema, { id: 'infoForm' });

    const userLanguages = { native_language: user.profile.native_language, studying_languages: userProfile.studying_languages };

    langForm = await superValidate( userLanguages, languagesSettingsSchema, { id: 'langForm' } );

    console.timeEnd('account+server_load');
    return { langForm, infoForm };
}

/** @type {import('./$types').Actions} */
export const actions = {
    saveLanguageInfo: async ({ request, locals: { supabase, getSession, refreshSession } }: RequestEvent) => {
        const form = await superValidate(request, languagesSettingsSchema);
        const { user } = await getSession();
        const userProfile = new Profile(user.profile);

        // Validation
        if(!form.valid) {
            return fail(401, {form});
        }

        userProfile.updateTargetLanguages( form.data.studying_languages);
        userProfile.setNativeLanguage( form.data.native_language );
        
        return { form };
    },
    saveBasicInfo: async ({ request, locals: { supabase, getSession, refreshSession } }: RequestEvent) => {
        const form = await superValidate(request, userBasicInfoSchema);
        const userProfile = new Profile((await getSession()).user.profile);

        // Validation
        if(!form.valid) {
            console.warn('INVALID FORM', form);
            return fail(401, {form});
        }

        userProfile.update(form.data);

        return { form };
    },
}