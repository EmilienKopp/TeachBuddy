// @ts-nocheck

import { languagesSettingsSchema, userBasicInfoSchema } from '/src/config/schemas';
import { message, superValidate } from 'sveltekit-superforms/server';

import { fail } from '@sveltejs/kit';
import { toSelectOptions } from '$lib/helpers/Arrays';
import { vertical } from '$lib/helpers/Arrays';
import { z } from 'zod';

/** @type {import('./$types').PageServerLoad} */
export async function load({request, locals: { supabase, getSession}}) {
    const { user } = await getSession();

    let infoForm, langForm;
    let userBasicInfo, userLanguages;

    const { data: studyingLanguages, error: studyingLanguagesError } = await supabase.from('studying_languages')
                                                                                     .select('lang_code').eq('user_id', user.id);
    const { data: nativeLanguage, error: nativeLanguageError } = await supabase.from('profiles')
                                                                               .select('native_language')
                                                                               .eq('id', user.id).single();

    if(!(studyingLanguagesError && nativeLanguageError)) {
        userLanguages = { native_language: nativeLanguage?.native_language, studying_languages: vertical(studyingLanguages,'lang_code') };
        langForm = await superValidate( userLanguages, languagesSettingsSchema, { id: 'langForm' } );
    } else {
        langForm = await superValidate( languagesSettingsSchema, { id: 'langForm' } );
    }

    const { data: profileData, error: profileError } = await supabase.from('profiles')
                                                                     .select('username, first_name, last_name, user_number')
                                                                     .eq('id', user.id).single(); 

    if(profileData) {
        const { username, first_name, last_name, user_number } = profileData;
        userBasicInfo = { username, first_name, last_name, user_number, email: user.email };
        infoForm = await superValidate( userBasicInfo,userBasicInfoSchema, { id: 'infoForm' });
    } else {
        infoForm = await superValidate( userBasicInfoSchema, { id: 'infoForm' });
    }

    const session = await getSession();

    let { data: grades, error: gradesError } = await supabase.from('grades').select('*');
    let { data: languages, error: langError} = await supabase.from('languages').select('lang_code, name_native').neq('name_native',null);

    grades = toSelectOptions(grades, 'id', 'name');
    languages = toSelectOptions(languages, 'lang_code', 'name_native');

    return { langForm, infoForm, grades, languages, session };
}

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

            const newSession = await refreshSession();
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
        console.log('Updated profile data:', updatedProfileData, error);
    },
}