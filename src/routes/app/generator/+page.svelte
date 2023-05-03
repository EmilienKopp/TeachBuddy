<script lang="ts">
    import type { PageData } from './$types';
    import { removePunctuation, splitWords, extractPunctuationAndPad } from "$lib/helpers/Text";
    import { superForm } from 'sveltekit-superforms/client';
    import { Button, Spinner, Toggle, Popover } from 'flowbite-svelte';
    import Select from "$lib/components/atoms/Select.svelte";
    import { searchWeblio } from '$lib/services/weblio';
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
    import { slide } from 'svelte/transition';
    import type { PopupSettings } from '@skeletonlabs/skeleton';
    import { random } from '$lib/helpers/Arrays';
    import { sleep } from '$lib/helpers/Utils';

    export let data: PageData;
    
    let loading: boolean = false;
    let clickedWord: string = "";
    let randomColor: any = random(["green","blue","red","yellow","purple","pink"]);

    const { form, enhance, reset, errors, constraints } = superForm(data.form, {
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true,
        onUpdated: ({ form }) => { loading = false; console.log('Loading:',loading) },
    });

    let splitPassage: Array<string> = [];

    async function lookupVocab(word: string) {
        return await data.supabase.from('vocabulary').select('*').textSearch('en_word',word);
    }

    function handleSave() {
        console.log(`Save: ${clickedWord}`);

        // Vocabulary.createUserVocabulary(clickedWord)
        //           .then(response => console.log(response));
    }

    async function handleTranslate() {
        console.log(`Translate: ${clickedWord}`);
        // const response = deepL(clickedWord);
        // console.log(await response);

    }

    function handleSubmit() {
        loading = true;
    }

    $: splitPassage = splitWords($form.message);

</script>

<!-- Path: src\routes\app\generator\+page.svelte -->
<div class="w-full h-full md:p-16 px-2 pt-8">
    <form method="POST" use:enhance>
        <div class="md:grid md:grid-cols-3 flex flex-col">
            <Select label="Type" name="type" bind:value={$form.type} data={data.types}/>
            <Select label="Grade" name="type" bind:value={$form.grade} data={data.grades}/>
            <Select label="Topic" name="prompt" bind:value={$form.prompt} data={data.topics} extraClass="col-span-3"/>
            <Toggle color={randomColor} name="testMode" bind:checked={$form.testMode}> {$form.testMode ? "Test Mode" : "Dev Mode"} </Toggle>
        </div>
        
        

        <Button pill={true} type="submit" color="tealToLime" outline gradient class="m-4" on:click={handleSubmit}> 
            <span class="text-3xl">🖋️</span> GIVE ME SOME 長文！！
        </Button>
        
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- TODO: do something about a11y -->
        {#if loading}
            <Spinner size="12" color={randomColor} />
        {/if}
        {#if splitPassage.length > 0}
        <div class="passage md:p-8 p-2 text-black">
            {#each splitPassage as word,index}
                {#if word == '\n'}
                    <br />
                {:else if word == '\t' }
                    &nbsp;&nbsp;&nbsp;&nbsp;
                {:else}
                    <button type="button" id="word-{index}"> 
                        {word}
                    </button>
                    <Popover trigger="click" triggeredBy="[id^='word-{index}']" placement="top" transition={slide} class="p-2">
                        <span class="text-xl font-semibold text-white">{removePunctuation(word)}</span>
                        <ol>
                            {#await lookupVocab(word)}
                                <Spinner size="5" color={randomColor} />
                            {:then result}
                                {#each result.data as item}
                                    <li>
                                        {item.en_word} 
                                        {item.jp_word ? `➡ ${item.jp_word}` : ''}
                                    </li>
                                {/each}
                            {:catch error}
                                <li>error: {error.message}</li>
                            {/await}
                        </ol>
                        <div class="pt-2">
                            <button type="button" on:click={() => handleSave()} class="btn variant-filled-primary">
                                <span class="text-3xl">💾</span>
                            </button>
                            <button type="button" on:click={() => lookupVocab(word)} class="btn variant-filled-primary">
                                <span class="text-3xl">🔃</span>
                            </button>
                            <button type="button" on:click={() => searchWeblio(word) } class="btn variant-filled-primary">
                                <span class="text-3xl">🔍</span>
                            </button>
                        </div>
                    </Popover>
                    &nbsp;
                {/if}
            {/each}
        </div>
        {/if}
    </form>

</div>

<style>
    .passage {
        cursor: pointer;
        background: white;
        max-height: 50%;
    }

    .passage span,
    .passage button {
        background-color: transparent;
        display: inline-block;
        border-radius: 10px;
        transition: all 0.5s ease-in-out;
    }

    .passage span:hover, 
    .passage button:hover {
        @apply bg-lime-500;
        transition: all 0.5s ease-in-out;
    }

    .context-menu {
        position: absolute;
        display: none;
        background-color: white;
        border: 1px solid #c3c3c3;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .context-menu button {
        @apply block w-full mb-2;
    }

</style>