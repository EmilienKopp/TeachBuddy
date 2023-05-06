<script lang="ts">
    import type { PageData } from './$types';
    import { removePunctuation, splitWords } from "$lib/helpers/Text";
    import { superForm } from 'sveltekit-superforms/client';
    import { Button, Spinner, Toggle, Popover, Modal, Radio, Toast, Select, Label, Input } from 'flowbite-svelte';
    import { searchWeblio } from '$lib/services/weblio';
    import { slide, fade } from 'svelte/transition';
    import { random, uniquify, Policies, toSelectOptions } from '$lib/helpers/Arrays';
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

    export let data: PageData;
    const supabase = data.supabase;
    let loading: boolean = false;
    let clickedWord: string = "";
    let dbMatchWord: any;
    let wordMatchesList: any;
    let randomColor: any = random(["green","blue","red","yellow","purple","pink"]);
    let translationModal = false;
    let isCustomizedTranslation = false;
    let noTranslationFound = false;
    let innerWidth: number;
    let custom_translation: string = "";
    let selectedVocab: any = {};
    let selectedPOS: string = "";

    

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
        word = removePunctuation(word);

        // Lookup exact word
        const {data: exactMatches, error } = await supabase.from('vocabulary').select('*').eq('en_word',word.toLowerCase());

        
        if(exactMatches && exactMatches?.length == 1) {
            console.log(`${word.toLowerCase()} has a single exact match:`,exactMatches);
            selectedVocab = exactMatches[0];
            wordMatchesList = exactMatches;
            return wordMatchesList;
        }
        
        // Lookup fuzzy matches on 'inflections' AND 'en_word'
        const fuzzyInflectionSearch = supabase.from('vocabulary').select('*').textSearch('inflections',word.toLowerCase());
        const fuzzyEnWordSearch = supabase.from('vocabulary').select('*').textSearch('en_word',word.toLowerCase());

        const [ {data: inflectionData, error: inflectionError }, 
                {data: enWordData, error: enWordError } ] = await Promise.all([fuzzyInflectionSearch,fuzzyEnWordSearch]);
        
        if(enWordError || inflectionError) {
            console.log('Error looking up word:',enWordError,inflectionError);
            return [];
        }

        // Lookup customized translations existing on 'user_vocabulary'
        const {data: userVocabData, error: userVocabError } = await supabase.from('user_vocabulary').select('custom_translation').eq('en_word',word.toLowerCase());
        console.log('userVocabData:',userVocabData);
        custom_translation = userVocabData?.[0]?.custom_translation ?? '';

        // concatenate results if not null
        wordMatchesList = wordMatchesList?.concat(inflectionData ?? [], enWordData ?? []);

        // Remove duplicates between 'inflections' and 'en_word' results
        wordMatchesList = wordMatchesList.reduce((acc: any, current: any) => {
                    const found = acc.find((item: any) => item.id === current.id);
                    return (!found) ? acc.concat([current]) : acc;
                }, []);

        return wordMatchesList;
    }

    async function launchSaveProcess(item: string | any) {
        translationModal = true;
        const isWord = typeof item === 'string';
        isCustomizedTranslation = noTranslationFound ? true : isCustomizedTranslation;
        clickedWord = removePunctuation( isWord ? item : item.en_word );

        if(!isWord) {
            selectedPOS = item.POS;
            selectedVocab = item;
        }

        // if word not in 'vocabulary', add it with a isPublic flag at false
        if(wordMatchesList?.length === 0) {
            console.log('No matches found, adding word to vocabulary');
            const {data: insertData, error } = await supabase.from('vocabulary').insert({en_word: clickedWord, isPublic: false});
            console.log('insertData:',insertData);
            if(error) console.log('Error inserting word:',error);
        }
    }

    async function handleTranslationSubmit(vocabulary: any) {
        console.log('handleTranslationSubmit', data);

        // Handle vocabulary not existing in DB
        if(!vocabulary.id) {
            console.log('Vocabulary not existing in DB, adding it');
            const {data: insertData, error } = await supabase.from('vocabulary').insert({en_word: clickedWord, isPublic: false});
            if(error) {
                console.log('Error inserting word:',error);
                return;
            }
            vocabulary = insertData?.[0];
        }

        const {data: insertData, error } = await supabase.from('user_vocabulary').insert({
            custom_translation, 
            user_id: data?.session?.user.id,
            vocabulary_id: vocabulary.id,
        });
        if(error) {
            console.log('Error inserting word:',error);
            return;
        }
        translationModal = false;
        $form.custom_translation = '';
    }

    function handleSubmit() {
        loading = true;
    }

    $: splitPassage = splitWords($form.message);

    $: console.log($form, selectedVocab);

    $: noTranslationFound = wordMatchesList?.filter((el: any) => el.jp_word).length === 0;
    
</script>
<svelte:window bind:innerWidth={innerWidth} />

{#if $message}
<Toast transition={fade} position="top-right" divClass="w-full max-w-[250px] p-2 md:mt-24 mt-12">
    {$message}
</Toast>
{/if}

<!-- Path: src\routes\app\generator\+page.svelte -->
<div class="w-full h-full sm:p-16 px-2 pt-8 mt-8">
    <form method="POST" action="?/getPassage" use:enhance>
        <div class="md:grid md:grid-cols-3 flex flex-col">
            <Select label="Type" name="type" bind:value={$form.type} items={data.types} class="my-2"/>
            <Select label="Grade" name="type" bind:value={$form.grade} items={data.grades} class="my-2"/>
            <Select label="Topic" name="prompt" bind:value={$form.prompt} items={data.topics} class="my-2 md:col-span-3"/>
            <Select label="Language" name="language" bind:value={$form.language} items={ data.languages } class="my-2"/>
            <Toggle color={randomColor} name="testMode" bind:checked={$form.testMode}> {$form.testMode ? "Test Mode" : "Dev Mode"} </Toggle>
        </div>

        <Button pill={true} type="submit" color="tealToLime" outline gradient class="m-4" on:click={handleSubmit}> 
            <span class="text-3xl mr-2">
                {#if loading}
                    <Spinner size="10" color={randomColor} />
                {:else}
                    🖋️
                {/if}
            </span>GIVE ME SOME 長文！！
        </Button>
        
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- TODO: do something about a11y -->
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
                    <Popover trigger="click" triggeredBy="[id='word-{index}']" placement="top" arrow={false} yOnly={ innerWidth <= 425}
                             class="p-0">
                        {#if custom_translation} ✅ {/if}
                        <span class="text-xl pb-3 font-semibold text-white">
                            {removePunctuation(word)}
                        </span> 

                        {#if wordMatchesList?.length == 0}
                        <button type="button" on:click={() => { launchSaveProcess(word) }} class="btn variant-filled-primary">
                            <span class="text-xl">💾</span>
                        </button>
                        {/if}
                        <ol>
                            {#await lookupVocab(word)}
                                <Spinner size="5" color={randomColor} />
                            {:then lookupData}
                                {#each lookupData as item}
                                    <li class="border-b border-slate-500 text-sm mb-1 flex flew-row justify-between">
                                        <div class="mr-2 max-w-[38ch] overflow-hidden text-ellipsis md:max-w-fit">
                                        {item.POS ? `【${ data?.POS?.find( (el) => el.value == item.POS)?.name }】` : ''}
                                        {item.en_word}
                                        {item.jp_word ? `➡ ${item.jp_word}` : ''}
                                        </div>
                                        <button type="button" on:click={() => { launchSaveProcess(item) }} class="self-end">
                                            <span class="text-md">💾</span>
                                        </button>
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
            <h2 class="text-center text-lime-500 font-semibold">
                {clickedWord} 
                <button type="button" on:click={() => searchWeblio(clickedWord) }>
                    <span class="text-xl">🔍</span>
                </button>
            </h2>
            {#if noTranslationFound}
                <p class="mt-2 text-xs">翻訳がまだありません！</p>
            {:else}
                <Toggle color="blue" class="mt-2" name="isCustomizedTranslation" bind:checked={isCustomizedTranslation}> 入力モード {isCustomizedTranslation ? 'ON' : 'OFF'} </Toggle>
            {/if}

            
            
            {#if isCustomizedTranslation}
            <div class="mt-2 flex flex-col">
                <Label for="POS" class="mt-2 self-start">品詞</Label>
                <Select name="POS" size="sm" bind:value={selectedPOS} items={data.POS} class="mt-1"/>
                <Label for="custom_translation" class="mt-2 self-start">
                    翻訳
                    <Input type="text" placeholder="翻訳を自分で入力" name="custom_translation" bind:value={custom_translation} />
                </Label>
                <!-- <TextInput name="custom_translation" placeholder="翻訳を自分で入力"
                            bind:value={$form.custom_translation} disabled={!isCustomizedTranslation}/> -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
            </div>
            {:else}
            <div class="flex flex-col gap-2">

                {#each wordMatchesList.filter((w) => w.jp_word) as word}
                    <Radio name="vocabulary_id" bind:group={$form.vocabulary_id} class="w-full p-2" value={parseInt(word.id)}>
                        【{data.POS?.find((el) => el.value == word.POS)?.name}】
                        {`${word.en_word} ➡ ${word.jp_word}`}
                    </Radio>
                {/each}
            </div>
            {/if}
            
            <Button  pill={true} type="button" color="tealToLime" gradient class="m-4" on:click={()=>{ handleTranslationSubmit(selectedVocab) }}> 
                {isCustomizedTranslation ? '入力' : '選択'}した翻訳で保存
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