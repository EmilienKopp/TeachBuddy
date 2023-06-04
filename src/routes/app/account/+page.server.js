// @ts-nocheck

import { languagesSettingsSchema, userBasicInfoSchema } from '/src/config/schemas';
import { message, superValidate } from 'sveltekit-superforms/server';

import { fail } from '@sveltejs/kit';
import { toSelectOptions } from '$lib/helpers/Arrays';
import { vertical } from '$lib/helpers/Arrays';
import { z } from 'zod';

/** @type {import('./$types').PageServerLoad} */
export async function load({request, data, parent, locals: { supabase, getSession}}) {
    console.log('LOAD @ account+page.server.js');
    console.time('account+server_load');

    const user = (await getSession()).user;

    let infoForm, langForm;

    infoForm = await superValidate( user.profile,userBasicInfoSchema, { id: 'infoForm' });

    const userLanguages = { native_language: user.profile.native_language, studying_languages: user.profile.studying_languages };

    langForm = await superValidate( userLanguages, languagesSettingsSchema, { id: 'langForm' } );

    console.timeEnd('account+server_load');
    return { langForm, infoForm };
}

/** @type {import('./$types').Actions} */
export const actions = {
    saveLanguageInfo: async ({ request, locals: { supabase, getSession, refreshSession } }) => {
        const form = await superValidate(request, languagesSettingsSchema);
        const { user } = await getSession();

        // Validation
        if(!form.valid) {
            return fail(401, {form});
        }

        if(form.data.native_language) {
            const { data: profileData, error: profileError } = await supabase.from('profiles')
                                                    .upsert({ id: user.id, native_language: form.data.native_language })
                                                    .eq('id', user.id).select();
            if(profileError) console.log('Error updating profile:', profileError);
            else console.log('Profile updated:', profileData);
        }

        const selectedLanguages = form.data.studying_languages;
        
        const encodedLanguages = JSON.stringify(selectedLanguages).replace('[','(').replace(']',')');

        if(selectedLanguages.length > 0) {
            const studyingLanguagesRows = selectedLanguages.map(lang => ({ user_id: user.id, lang_code: lang }));
            const { data: studyingData, error: studyingError } = await supabase.from('studying_languages')
                                                        .upsert(studyingLanguagesRows)
                                                        .eq('user_id', user.id);
            // Delete where not in selectedLanguages
            const { data: studyingDeleteData, error: studyingDeleteError } = await supabase.from('studying_languages')
                                                        .delete()
                                                        .eq('user_id', user.id)
                                                        .not('lang_code', 'in', encodedLanguages);
            if(studyingError || studyingDeleteError) console.log('Error updating studying languages:', studyingError, studyingDeleteError);
            else console.log('Studying languages updated:', studyingData, studyingDeleteData);

            const languagesTabOpen = true;

            return { form };
        }
    },
    saveBasicInfo: async ({ request, locals: { supabase, getSession, refreshSession } }) => {
        const form = await superValidate(request, userBasicInfoSchema);
        const { user } = await getSession();
        // Validation
        if(!form.valid) {
            console.warn('INVALID FORM', form);
            return fail(401, {form});
        }

        const { data: updatedProfileData, error } = 
                                    await supabase.from('profiles')
                                    .update({
                                                username: form.data.username, 
                                                first_name: form.data.first_name,
                                                last_name: form.data.last_name, 
                                                user_number: form.data.user_number })
                                    .eq('id', user.id).select();

        return { form };
    },
}