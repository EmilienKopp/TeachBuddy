<script lang="ts">
    import { Button, Checkbox, Chevron, Dropdown, Label, Select } from 'flowbite-svelte';
    import type { SelectOptionType } from '$lib/helpers/Arrays';
    import type { PageData } from './$types';

    export let data: PageData;

    let languages: SelectOptionType[] | any[] = data.languages as SelectOptionType[] | any[];
    let selectableLanguages: SelectOptionType[] | any[];
    let selectedLanguages: string[] = [];
    let nativeLanguage: string = '';

    async function saveNativeLanguage() {
        if(nativeLanguage) {
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

<div class="mt-12 p-2 md:p-8">
    <h1 class="text-2xl text-teal-400 font-bold mb-5">設定・Settings</h1>

    <section class="flex flex-col gap-5 mt-1">
        <h2 class="font-semibold italic ">言葉・Language</h2>
        <Label>
            <span class="italic">母国語は...・My native language is ...</span>
            <Select class="mt-2" items={languages} bind:value={nativeLanguage} on:change={saveNativeLanguage}/>
        </Label>
        <Label>
            <p class="font-semibold italic"></p>
            <Button><Chevron>勉強中・I'm studying...</Chevron></Button>
            <Dropdown class="overflow-y-auto px-3 pb-3 text-sm h-44">
                {#each selectableLanguages as lang, key}
                <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <Checkbox class="p-3" bind:group={selectedLanguages} value={lang.value} on:change={saveStudyingLanguages}>{lang.name}</Checkbox>
                </li>
                {/each}
            </Dropdown>
        </Label>
        {#if nativeLanguage && selectedLanguages.length > 0}
        <p>
            🤖🗯️ Hello, I see you speak <span class="text-cyan-500 font-semibold">{languages.find(el => el.value === nativeLanguage).name}</span> and are studying 
            <span class="text-orange-400 font-semibold">{languages.filter(el => selectedLanguages.includes(el.value)).map(el => el.name) }</span>.
        </p>
        {/if}

    </section>

</div>

