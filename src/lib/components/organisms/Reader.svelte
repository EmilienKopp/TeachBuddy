<script lang="ts">
    import { Badge, Button, Checkbox, FloatingLabelInput, GradientButton, Input, Label, Modal, TextPlaceholder, Popover, Radio, Rating, Select, Spinner, Toggle} from 'flowbite-svelte';
    import { removePunctuation, splitWords } from "$lib/helpers/Text";
    import { vertical, toSelectOptions} from '$lib/helpers/Arrays';
    import { searchWeblio } from '$lib/services/weblio';

    export let pageData: any = null;
    export let passage: any | null;
    export let themeColor: any;
    export let form: any = null;

    const supabase = pageData.supabase;

    const userLanguage = pageData?.session?.user?.user_metadata?.language ?? 'ja';

    let clickedWord: string | any = "";
    let custom_translation: string | null = null;
    let selectedPOS: string = "";
    let newTitle: string = "";
    let splitPassage: Array<string> = splitWords(passage?.content);
    let innerWidth: number;
    let translationModal = false;
    let isCustomizedTranslation = false;
    let noTranslationFound = false;

    let averageRating: number = 0;

    let wordMatchesList: any;
    let selectedVocab: any = {};

    

    const PosSelectOptions = toSelectOptions(pageData.POS,'id',userLanguage + '_name');

async function lookupVocab(word: string) {
    // Reset wordMatchesList    
    wordMatchesList = [];
    word = removePunctuation(word);

    // Lookup exact word
    const {data: exactMatches, error } = await supabase.from('vocabulary').select('*').eq('word',word.toLowerCase());

    if(exactMatches && exactMatches?.length == 1) {
        console.log(`${word.toLowerCase()} has a single exact match:`,exactMatches);
        selectedVocab = exactMatches[0];
        wordMatchesList = exactMatches;
        return wordMatchesList;
    }
    
    // Lookup fuzzy matches on 'inflections' AND 'en_word'
    const fuzzyInflectionSearch = supabase.from('vocabulary').select('*').textSearch('inflections',word.toLowerCase());
    const fuzzyEnWordSearch = supabase.from('vocabulary').select('*').textSearch('word',word.toLowerCase());

    const [ {data: inflectionData, error: inflectionError }, 
            {data: enWordData, error: enWordError } ] = await Promise.all([fuzzyInflectionSearch,fuzzyEnWordSearch]);
    
    if(enWordError || inflectionError) {
        console.log('Error looking up word:',enWordError,inflectionError);
        return [];
    }

    // // Lookup customized translations existing on 'user_vocabulary'
    // const {data: userVocabData, error: userVocabError } = await supabase.from('user_vocabulary').select('custom_translation').eq('word',word.toLowerCase());
    // console.log('userVocabData:',userVocabData);
    // if(userVocabData?.length > 0) {
    //     custom_translation = userVocabData?.[0]?.custom_translation ?? '';
    // }

    // concatenate results if not null
    wordMatchesList = wordMatchesList?.concat(inflectionData ?? [], enWordData ?? []);

    // Remove duplicates between 'inflections' and 'en_word' results
    wordMatchesList = wordMatchesList.reduce((acc: any, current: any) => {
                const found = acc.find((item: any) => (item.id === current.id || (item.word == current.word && item.POS == current.POS)));
                return (!found) ? acc.concat([current]) : acc;
            }, []);
    console.log('Lookup results:',wordMatchesList);
    return wordMatchesList;
}

function displayPOS(item: any) {
    selectedPOS = item.POS;
    const posName =  pageData.POS.find((el: any) => el.id === item.POS)?.[userLanguage + '_name'];
    return posName;
}

async function launchSaveProcess(word: string | any) {
    pageData.form.data.vocabulary_id = [];
    translationModal = true;
    isCustomizedTranslation = noTranslationFound ? true : isCustomizedTranslation;
    // if word not in 'vocabulary', add it with a isPublic flag at false
    if(wordMatchesList?.length === 0) {
        console.log('No matches found, adding word to vocabulary');
        const {data: insertData, error } = await supabase.from('vocabulary')
                                .insert({word: removePunctuation(word), isPublic: false})
                                .select().single();
        console.log('insertData:',insertData);
        if(error) console.log('Error inserting word:',error);
        else {
            wordMatchesList = [insertData];
            selectedVocab = insertData;
        }
    }
}

async function handleTranslationSubmit(vocabulary: any) {
    console.log('handleTranslationSubmit', vocabulary);
    if(isCustomizedTranslation) {
        console.log('CUSTOM', custom_translation, pageData?.session?.user.id, vocabulary.id, selectedPOS);
        const { data, error } = await supabase.from('user_vocabulary').insert({
            custom_translation, 
            user_id: pageData?.session?.user.id,
            vocabulary_id: vocabulary.id,
        }).select();
        console.log(data,error);

        const {data:updateData, error:updateError} = await supabase.from('vocabulary').update({POS: selectedPOS}).eq('id',vocabulary.id).select();
        console.log(updateData,updateError);
        
    } else {
        console.log('SELECTION', pageData?.session?.user.id, pageData.form.data.vocabulary_id);
        pageData.form.data.vocabulary_id.forEach( async (id: any) => {
            const {data: insertData, error } = await supabase.from('user_vocabulary').insert({
                custom_translation, 
                user_id: pageData?.session?.user.id,
                vocabulary_id: id,
            }).select();
            if(error) {
                console.log('Error inserting word:',error);
                return;
            }
            console.log(insertData,error);
        });
    }
    translationModal = false;
    custom_translation = '';
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

async function print() {
    window.print();
}


$: noTranslationFound = wordMatchesList?.filter((el: any) => el.ja_word).length === 0;

$: if(passage) {
    splitPassage = splitWords(passage?.content);
} else {
    splitPassage = splitWords(form?.message);
}

$: console.log(pageData.form.data);

</script>

<svelte:window bind:innerWidth={innerWidth} />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- TODO: do something about a11y -->

{#if splitPassage.length > 0}
<div class="mt-4 md:mt-12 flex flex-row justify-around md:justify-normal gap-2">
    <h2 class="w-full text-2xl md:text-4xl text-lime-500 font-pixel px-3 pb-2 bg-white bg-opacity-80 rounded md:bg-transparent;">{passage?.title ?? 'タイトルなし'}</h2>
    <GradientButton pill={true} type="button" class="noprint hidden sm:block text-center" color="red" on:click={print}> <i class="bi bi-download text-3xl"></i> </GradientButton>
</div>
{#if passage.rating}
<Badge>User Ratings: {passage.rating}  / 5</Badge> <Badge color="red"> {passage.nb_ratings} ratings </Badge>
<Rating total={5} rating={passage.rating} />
{/if}
<!-- <div class="italic text-md mb-3">{passage.prompt ?? ''}</div> -->

<div class="passage md:p-8 p-2 text-black bg-slate-50 mt-4 rounded">
    {#each splitPassage as word,index}
        {#if word == '\n'}
            <br />
        {:else if word == '\t' }
            &nbsp;&nbsp;&nbsp;&nbsp;
        {:else}
            <button class="forceprint" type="button" id="word-{index}" on:click={() => { clickedWord = removePunctuation(word) }}> 
                {word}
            </button>
            <Popover trigger="click" triggeredBy="[id='word-{index}']" placement="top" arrow={false} yOnly={ innerWidth <= 425}
                        class="p-0">
                {#if custom_translation} ✅ {/if}
                <span class="text-xl pb-3 font-semibold text-white">
                    {clickedWord + (custom_translation ? `: ${custom_translation}` : '') }
                </span>               

                <ol>
                    {#await lookupVocab(word)}
                        <Spinner size="5" color={themeColor} />
                    {:then lookupData}
                        {#each lookupData as item}
                            <li class="border-b border-slate-500 text-sm mb-1 flex flew-row justify-between">
                                <div class="mr-2 max-w-[38ch] overflow-hidden text-ellipsis md:max-w-fit">
                                {item.POS ? `【${ displayPOS(item) }】` : ''}
                                {item.word}
                                {item.ja_word ? `➡ ${item.ja_word}` : ''}
                                </div>
                            </li>
                            
                        {/each}
                    {:catch error}
                        <li>error: {error.message}</li>
                    {/await}
                </ol>
                {#if passage.language == 'en'}
                <div class="pt-2 flex justify-center">
                    <button type="button" on:click={() => searchWeblio(word) } class="btn variant-filled-primary">
                        <span class="text-3xl">🔍</span>
                    </button>
                    <button type="button" on:click={() => { launchSaveProcess(word) }} class="btn variant-filled-primary">
                        <span class="text-3xl">💾</span>
                    </button>
                </div>
                {:else}
                    <p>
                        Sorry, this feature is only available for English passages.
                    </p>
                {/if}
                
            </Popover>
            &nbsp;
        {/if}
    {/each}
    
</div>



{/if}



<Modal bind:open={translationModal} size="xs" autoclose={true} class="w-full">
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
            <Label for="POS" class="mt-2 self-start">品詞
                <Select name="POS" size="sm" bind:value={selectedPOS} items={PosSelectOptions} class="mt-1"/>
            </Label>
            <Label for="custom_translation" class="mt-2 self-start">
                翻訳
                <Input type="text" placeholder="翻訳を自分で入力" name="custom_translation" bind:value={custom_translation} />
            </Label>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
        </div>
        {:else}
        <div class="flex flex-col gap-2">
            {#if wordMatchesList}
            {#each wordMatchesList.filter((item) => item.ja_word) as vocab, key}
                <Checkbox name="vocabulary_id" value={parseInt(vocab.id)} class="w-full p-2" bind:group={pageData.form.data.vocabulary_id}>
                    【{displayPOS(vocab)}】
                    {`${vocab.word} ➡ ${vocab.ja_word}`}
                </Checkbox>
            {/each}
            {/if}
        </div>
        {/if}
        <GradientButton  pill={true} type="button" color="tealToLime" class="m-4" disabled={!pageData.form.data.vocabulary_id && !custom_translation}
        on:click={()=>{ handleTranslationSubmit(selectedVocab) }}> 
            {isCustomizedTranslation ? '入力' : '選択'}した翻訳で保存
        </GradientButton>

    </div>
</Modal>

