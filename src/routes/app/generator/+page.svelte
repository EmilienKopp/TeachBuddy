<script lang="ts">
    import type { PageData } from './$types';
    import { removePunctuation, splitWords } from "$lib/helpers/Text";
    import { superForm } from 'sveltekit-superforms/client';
    import { Button, Spinner, Toggle, Popover, Modal, Radio, Toast } from 'flowbite-svelte';
    import Select from "$lib/components/atoms/Select.svelte";
    import { searchWeblio } from '$lib/services/weblio';
    import { slide, fade } from 'svelte/transition';
    import { random } from '$lib/helpers/Arrays';
    import TextInput from '$lib/components/molecules/inputs/TextInput.svelte';

    export let data: PageData;
    
    let loading: boolean = false;
    let clickedWord: string = "";
    let dbMatchWord: any;
    let wordMatchesList: any;
    let randomColor: any = random(["green","blue","red","yellow","purple","pink"]);
    let translationModal = false;
    let customizeTranslation = false;

    const { form, enhance, reset, errors, constraints, message } = superForm(data.form, {
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true,
        onUpdated: ({ form }) => { loading = false; console.log('Loading:',loading) },
    });

    let splitPassage: Array<string> = [];

    async function lookupVocab(word: string) {
        const {data: exactMatch, error } = await data.supabase.from('vocabulary').select('*').eq('en_word',word).single();
        wordMatchesList = (await data.supabase.from('vocabulary').select('*').textSearch('en_word',word)).data;

        dbMatchWord = exactMatch;
        if( !wordMatchesList.find((item: any) => item.id == dbMatchWord?.id) ) {
            wordMatchesList.push(dbMatchWord);
        }

        return wordMatchesList;
    }

    async function launchSaveProcess(word: string) {
        translationModal = true;
        clickedWord = word;
        $form.vocabulary_id = dbMatchWord?.id;
    }

    async function handleTranslationSubmit() {
        translationModal = false;
        $form.custom_translation = '';
    }

    function handleSubmit() {
        loading = true;
    }

    $: splitPassage = splitWords($form.message);

    $: console.log(data, $message);
    
</script>

{#if $message}
<Toast transition={fade} position="top-right" divClass="w-full max-w-[250px] p-2 mt-12">
    {$message}
</Toast>
{/if}

<!-- Path: src\routes\app\generator\+page.svelte -->
<div class="w-full h-full md:p-16 px-2 pt-8">
    <form method="POST" action="?/getPassage" use:enhance>
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
                    <Popover trigger="hover" triggeredBy="[id='word-{index}']" placement="top" arrow={false} class="p-2">
                        <span class="text-xl pb-3 font-semibold text-white">{removePunctuation(word)}</span> 

                        <button type="button" on:click={() => { launchSaveProcess(word) }} class="btn variant-filled-primary">
                            <span class="text-xl">💾</span>
                        </button>
                        <ol>
                            {#await lookupVocab(word)}
                                <Spinner size="5" color={randomColor} />
                            {:then lookupData}
                                {#each lookupData as item}
                                    <li>
                                        {item.en_word} 
                                        {item.jp_word ? `➡ ${item.jp_word}` : ''}
                                    </li>
                                {/each}
                            {:catch error}
                                <li>error: {error.message}</li>
                            {/await}
                        </ol>
                        <div class="pt-2 flex justify-center">
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



        <Modal bind:open={translationModal} size="xs" autoclose={false} class="w-full">
            英単語の翻訳を...
            <Toggle color={randomColor} class="mt-2" name="customizeTranslation" bind:checked={customizeTranslation}> 入力モード {customizeTranslation ? 'ON' : 'OFF'} </Toggle>
            {#if customizeTranslation}
            <div class="mt-2 flex items-center">
                <TextInput label={`${clickedWord}の翻訳`} name="custom_translation" placeholder="翻訳を自分で入力" 
                            bind:value={$form.custom_translation} disabled={!customizeTranslation}/>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
            </div>
            {:else}
            <div class="flex flex-col gap-2">

                {#each wordMatchesList.filter((el) => el.jp_word) as word}
                    <Radio name="vocabulary_id" bind:group={$form.vocabulary_id} class="w-full p-4" value={parseInt(word.id)}>
                        {`${word.en_word} ➡ ${word.jp_word}`}
                    </Radio>
                {/each}
            </div>
            {/if}
            <Button formaction="?/storeUserVocab" pill={true} type="submit" color="tealToLime" gradient class="m-4 col-span-2" on:click={handleTranslationSubmit}> 
                {customizeTranslation ? '入力' : '選択'}した翻訳で保存
            </Button>
        </Modal>
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