<script lang="ts">
    import { Button, Checkbox, Chevron, Dropdown, Label, Select, Spinner } from 'flowbite-svelte';
    import { toSelectOptions, type SelectOptionType } from '$lib/helpers/Arrays';
    import SaveButton from '$lib/components/atoms/SaveButton.svelte';
    import { superForm } from 'sveltekit-superforms/client';
    import { _ } from 'svelte-i18n';
    import { C_ } from '$lib/i18n/helpers';

    export let data: any;
    let loading: boolean = false;

    const { form: langForm, enhance: langFormEnhance, tainted, delayed } = superForm(data.langForm, {
        id: 'langForm',
        onSubmit: () => { loading = true; },
        onUpdated: () => { loading = false; },
    });

    let languages: SelectOptionType[] | any[] = toSelectOptions(data.languages, 'lang_code', 'name_native') as SelectOptionType[] | any[];
    let selectableLanguages: SelectOptionType[] | any[];
    let selectedLanguages: string[] = [];
    let FORM: HTMLFormElement;
    
    $: selectableLanguages = languages.filter(lang => lang.value !== $langForm.native_language);
</script>

<section class="mt-1">
<form bind:this={FORM} class="flex flex-col gap-5 pb-12" method="POST" use:langFormEnhance action="?/saveLanguageInfo">
    <Label>
        <span class="italic">{$C_('my_native_language_is')}</span>
        <Select class="mt-2" name="native_language" items={languages} bind:value={$langForm.native_language} change={() => FORM.submit()}/>
    </Label>
    <Label>
        <p class="font-semibold italic">Languages you're studying ・ 勉強中の言葉:</p>
        <Button color="blue" class="w-full"><Chevron>{$C_('now_studying')}</Chevron></Button>
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
        { $tainted ? "Don't forget to save your changes!" : '' }
    {/if}


    {#if Object.values($langForm).some(value => !!value)}
        <SaveButton type="submit" tainted={$tainted} loading={$delayed}/>
    {/if}
</form>
</section>

