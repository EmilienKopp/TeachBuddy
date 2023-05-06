<script lang="ts">
    import { Button, FloatingLabelInput, Input, Label, Modal, P, Popover, Radio, Select, Spinner, Toggle} from 'flowbite-svelte';
    import { removePunctuation, splitWords } from "$lib/helpers/Text";
    import { searchWeblio } from '$lib/services/weblio';

    export let pageData: any = null;
    export let passage: any | null;
    export let themeColor: any;
    export let form: any = null;

    let clickedWord: string = "";
    let custom_translation: string = "";
    let selectedPOS: string = "";
    let newTitle: string = "";
    let splitPassage: Array<string> = splitWords(passage?.content);
    
    let translationModal = false;
    let isCustomizedTranslation = false;
    let noTranslationFound = false;
    
    let wordMatchesList: any;
    let selectedVocab: any = {};

    const supabase = pageData.supabase;

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
    console.log('handleTranslationSubmit', pageData);

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
        user_id: pageData?.session?.user.id,
        vocabulary_id: vocabulary.id,
    });
    if(error) {
        console.log('Error inserting word:',error);
        return;
    }
    translationModal = false;
    form.custom_translation = '';
}

async function saveTitle() {
    console.log(passage, newTitle);
    const {data: updatedData, error } = await supabase.from('passages')
                                                     .update({title: newTitle})
                                                     .eq('id',passage?.id).select();
    if(error) {
        console.log('Error updating title:',error);
        return;
    }
    passage.title = newTitle;
    console.log(updatedData);
}

$: noTranslationFound = wordMatchesList?.filter((el: any) => el.jp_word).length === 0;

$: if(passage) {
    splitPassage = splitWords(passage?.content);
} else {
    splitPassage = splitWords(form?.message);
}

$: console.log(pageData);

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- TODO: do something about a11y -->

{#if splitPassage.length > 0}

<div class="my-4 flex flex-row justify-around md:justify-normal gap-4">
    {#if passage?.title}
        <h2 class="text-lg md:text-3xl text-lime-500">{passage?.title ?? 'タイトルなし'}</h2>
    {:else}
        <FloatingLabelInput label="タイトル" bind:value={newTitle} class="md:w-[60ch]"/>
        <Button class="mt-2" color="blue" size="sm" on:click={saveTitle}>保存</Button>
    {/if}
    
</div>
<div class="italic text-md mb-3">{passage.prompt ?? ''}</div>


<div class="passage md:p-8 p-2 text-black bg-slate-50">
    {#each splitPassage as word,index}
        {#if word == '\n'}
            <br />
        {:else if word == '\t' }
            &nbsp;&nbsp;&nbsp;&nbsp;
        {:else}
            <button type="button" id="word-{index}" on:click={() => { clickedWord = removePunctuation(word) }}> 
                {word}
            </button>
            <Popover trigger="click" triggeredBy="[id='word-{index}']" placement="top" arrow={false} yOnly={ innerWidth <= 425}
                        class="p-0">
                {#if custom_translation} ✅ {/if}
                <span class="text-xl pb-3 font-semibold text-white">
                    {clickedWord}
                </span> 

                {#if wordMatchesList?.length == 0}
                <button type="button" on:click={() => { launchSaveProcess(word) }} class="btn variant-filled-primary">
                    <span class="text-xl">💾</span>
                </button>
                {/if}
                <ol>
                    {#await lookupVocab(word)}
                        <Spinner size="5" color={themeColor} />
                    {:then lookupData}
                        {#each lookupData as item}
                            <li class="border-b border-slate-500 text-sm mb-1 flex flew-row justify-between">
                                <div class="mr-2 max-w-[38ch] overflow-hidden text-ellipsis md:max-w-fit">
                                {item.POS ? `【${ pageData?.POS?.find( (el) => el.value == item.POS)?.name }】` : ''}
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
        <Select name="POS" size="sm" bind:value={selectedPOS} items={pageData.POS} class="mt-1"/>
        <Label for="custom_translation" class="mt-2 self-start">
            翻訳
            <Input type="text" placeholder="翻訳を自分で入力" name="custom_translation" bind:value={custom_translation} />
        </Label>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
    </div>
    {:else}
    <div class="flex flex-col gap-2">

        {#each wordMatchesList.filter((w) => w.jp_word) as word}
            <Radio name="vocabulary_id" bind:group={form.vocabulary_id} class="w-full p-2" value={parseInt(word.id)}>
                【{pageData.POS?.find((el) => el.value == word.POS)?.name}】
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

