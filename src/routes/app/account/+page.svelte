<script lang="ts">
    import BasicInfoForm from "$lib/components/organisms/Forms/BasicInfoForm.svelte";
    import LanguageInfoForm from "$lib/components/organisms/Forms/LanguageInfoForm.svelte";
    import { Button, Checkbox, Chevron, Dropdown, Label, Select, Tabs, TabItem } from 'flowbite-svelte';
    import type { SelectOptionType } from '$lib/helpers/Arrays';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client';

    export let data: PageData;

    
;

    let languages: SelectOptionType[] | any[] = data.languages as SelectOptionType[] | any[];
    let selectableLanguages: SelectOptionType[] | any[];
    let selectedLanguages: string[] = data.session?.user.profile?.studying_languages;
    let nativeLanguage: string = '';
    let grades = data.grades;

    async function saveNativeLanguage() {
        if(nativeLanguage) {
            console.log('Saving native language:', nativeLanguage, data.session?.user.id);
            const { data: profileData, error: profileError } = await data.supabase.from('profiles')
                                                    .upsert({ id: data.session?.user.id, native_language: nativeLanguage })
                                                    .eq('id', data.session?.user.id).select();
            if(profileError) console.log('Error updating profile:', profileError);
            else console.log('Profile updated:', profileData);
        }

    }

    async function saveStudyingLanguages() {
        if(selectedLanguages.length > 0) {
            const studyingLanguagesRows = selectedLanguages.map(lang => ({ user_id: data.session?.user.id, lang_code: lang }));
            const { data: studyingData, error: studyingError } = await data.supabase.from('studying_languages')
                                                        .upsert(studyingLanguagesRows)
                                                        .eq('user_id', data.session?.user.id);
            // Delete where not in selectedLanguages
            const { data: studyingDeleteData, error: studyingDeleteError } = await data.supabase.from('studying_languages')
                                                        .delete()
                                                        .eq('user_id', data.session?.user.id)
                                                        .not('lang_code', 'in', selectedLanguages);
            if(studyingError || studyingDeleteError) console.log('Error updating studying languages:', studyingError, studyingDeleteError);
            else console.log('Studying languages updated:', studyingData, studyingDeleteData);
        }
    }
    

    $: selectableLanguages = languages.filter(lang => lang.value !== nativeLanguage);

</script>

<div class="mt-10 md:mt-2 px-2 md:px-8">

    <Tabs>
        <TabItem title="基本・Basic" open>
            <BasicInfoForm {data} {grades} />
        </TabItem>
        <TabItem title="言語・Languages">
            <LanguageInfoForm {data} />
        </TabItem>
    </Tabs>
</div> 