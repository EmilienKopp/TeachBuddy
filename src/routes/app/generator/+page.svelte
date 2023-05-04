<script lang="ts">
    import type { PageData } from './$types';
    import { removePunctuation, splitWords } from "$lib/helpers/Text";
    import { superForm } from 'sveltekit-superforms/client';
    import { Button, Spinner, Toggle, Popover, Modal, Radio, Toast, Select, Label, Input } from 'flowbite-svelte';
    import { searchWeblio } from '$lib/services/weblio';
    import { slide, fade } from 'svelte/transition';
    import { random, uniquify, Policies } from '$lib/helpers/Arrays';

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
        // Reset wordMatchesList    
        wordMatchesList = [];

        const {data: exactMatches, error } = await data.supabase.from('vocabulary').select('*').eq('en_word',word.toLowerCase());

        console.log(`${word.toLowerCase()} has exact matches:`,exactMatches);
        if(exactMatches && exactMatches?.length == 1) {
            dbMatchWord = exactMatches[0];
            return exactMatches;
        }
        
        wordMatchesList = (await data.supabase.from('vocabulary').select('*').textSearch('inflections',word.toLowerCase())).data;

        wordMatchesList = wordMatchesList.concat(exactMatches);
        //TODO: Remove duplicates on POS is null and en_word are the same
        console.log(`${word.toLowerCase()} has fuzzy matches:`,wordMatchesList);
        return wordMatchesList;
    }

    async function launchSaveProcess(word: string) {
        translationModal = true;
        clickedWord = removePunctuation(word);
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

    $: console.log(data, $message, $form);

    $: customizeTranslation = wordMatchesList?.filter( (el: any) => el.jp_word).length === 0 || customizeTranslation;
    
</script>

{#if $message}
<Toast transition={fade} position="top-right" divClass="w-full max-w-[250px] p-2 mt-12">
    {$message}
</Toast>
{/if}

<!-- Path: src\routes\app\generator\+page.svelte -->
<div class="w-full h-full md:p-16 px-2 pt-8 mt-8">
    <form method="POST" action="?/getPassage" use:enhance>
        <div class="md:grid md:grid-cols-3 flex flex-col">
            <Select label="Type" name="type" bind:value={$form.type} items={data.types} class="my-2"/>
            <Select label="Grade" name="type" bind:value={$form.grade} items={data.grades} class="my-2"/>
            <Select label="Topic" name="prompt" bind:value={$form.prompt} items={data.topics} class="my-2 md:col-span-3"/>
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
        <div class="flex flex-col justify-center items-stretch gap-1">
            <h2 class="text-center text-lime-500 font-semibold">{clickedWord}</h2>
            {#if wordMatchesList.filter((el) => el.jp_word).length != 0}
                <Toggle color="blue" class="mt-2" name="customizeTranslation" bind:checked={customizeTranslation}> 入力モード {customizeTranslation ? 'ON' : 'OFF'} </Toggle>
            {:else}
                <p class="mt-2">この単語の日本語はまだ登録されていません。</p>
                <Button gradient color="lime" on:click={() => searchWeblio(clickedWord) }>
                    <span class="text-3xl">🔍</span>　外部辞書で検索
                </Button>
            {/if}

            {#if customizeTranslation}
            <div class="mt-2 flex flex-col">
                <Label for="part_of_speech" class="mt-2 self-start">品詞</Label>
                <Select name="POS" bind:value={$form.POS} items={data.POS} class="mt-1"/>
                <Label for="custom_translation" class="mt-2 self-start">
                    翻訳
                    <Input type="text" placeholder="翻訳を自分で入力" name="custom_translation" bind:value={$form.custom_translation} />
                </Label>
                <!-- <TextInput name="custom_translation" placeholder="翻訳を自分で入力"
                            bind:value={$form.custom_translation} disabled={!customizeTranslation}/> -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                

            </div>
            {:else}
            <div class="flex flex-col gap-2">

                {#each wordMatchesList.filter((w) => w.jp_word) as word}
                    <Radio name="vocabulary_id" bind:group={$form.vocabulary_id} class="w-full p-4" value={parseInt(word.id)}>
                        【{data.POS?.find((el) => el.value == word.POS)?.name}】
                        {`${word.en_word} ➡ ${word.jp_word}`}
                    </Radio>
                {/each}
            </div>
            {/if}
            <Button formaction="?/storeUserVocab" pill={true} type="submit" color="tealToLime" gradient class="m-4" on:click={handleTranslationSubmit}> 
                {customizeTranslation ? '入力' : '選択'}した翻訳で保存
            </Button>
        </div>
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