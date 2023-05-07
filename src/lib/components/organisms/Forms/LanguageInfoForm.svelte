<script lang="ts">
    import { Button, Checkbox, Chevron, Dropdown, Label, Select } from 'flowbite-svelte';
    import type { SelectOptionType } from '$lib/helpers/Arrays';
    import { onMount } from 'svelte';
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
    import { superForm } from 'sveltekit-superforms/client';

    export let data: any;
    export let form: any;

    const { form: langForm, enhance: langFormEnhance } = superForm(data.langForm, {
        id: 'langForm',
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true
    });

    let languages: SelectOptionType[] | any[] = data.languages as SelectOptionType[] | any[];
    let selectableLanguages: SelectOptionType[] | any[];
    let selectedLanguages: string[] = [];
    let FORM: HTMLFormElement;

    // async function saveNativeLanguage() {
    //     if(data.session.user.profile.native_language) {
    //         const { data: profileData, error: profileError } = await data.supabase.from('profiles')
    //                                                 .upsert({ id: data.session?.user.id, native_language: data.session.user.profile.native_language })
    //                                                 .eq('id', data.session?.user.id).select();
    //         if(profileError) console.log('Error updating profile:', profileError);
    //         else console.log('Profile updated:', profileData);
            
    //     }
    // }

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
    
    $: selectableLanguages = languages.filter(lang => lang.value !== data.session.user.profile.native_language);

</script>

<section class="mt-1">
<form bind:this={FORM} class="flex flex-col gap-5" method="POST" use:langFormEnhance action="?/saveLanguageInfo">
    <Label>
        <span class="italic">母国語は...・My native language is ...</span>
        <Select class="mt-2" name="native_language" items={languages} bind:value={$langForm.native_language} change={() => FORM.submit()}/>
    </Label>
    <Label>
        <p class="font-semibold italic"></p>
        <Button><Chevron>勉強中・I'm studying...</Chevron></Button>
        <Dropdown class="overflow-y-auto px-3 pb-3 text-sm h-44">
            {#each selectableLanguages as lang, key}
            <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                <Checkbox name="studying_languages" class="p-3" bind:group={$langForm.studying_languages} value={lang.value}
                    change={() => FORM.submit()}
                    checked={$langForm.studying_languages.includes(lang.value)}>{lang.name}</Checkbox>
            </li>
            {/each}
        </Dropdown>
    </Label>
    {#if $langForm.native_language && $langForm.studying_languages.length > 0}
    <p class="text-sm md:text-md">
        🤖🗯️ Hello, I see you speak 
        <span class="text-cyan-500 font-semibold">{languages.find(el => el.value === $langForm.native_language).name}</span> and are studying 
        <span class="text-orange-400 font-semibold">{languages.filter(el => $langForm.studying_languages.includes(el.value)).map(el => el.name) }</span>.
        <br/>
        <br/>
        Don't forget to save your changes! 👇
    </p>
    {/if}
    <Button type="submit" gradient color="cyanToBlue" shadow="teal" class="fixed bottom-6 right-6">保存・Save</Button>
</form>
</section>

