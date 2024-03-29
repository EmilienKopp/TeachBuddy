<script lang="ts">
  import {
    Badge,
    Button,
    Checkbox,
    FloatingLabelInput,
    GradientButton,
    Input,
    Label,
    Modal,
    TextPlaceholder,
    Popover,
    Radio,
    Rating,
    Select,
    Spinner,
    Toggle,
  } from "flowbite-svelte";
  import { removePunctuation, splitWords } from "$lib/helpers/Text";
  import { vertical, toSelectOptions } from "$lib/helpers/Arrays";
  import { searchWeblio } from "$lib/services/weblio";
  import type { Passage } from "$lib/models/Passage";
  import { Vocabulary } from "$lib/models/Vocabulary";
  import { page } from "$app/stores";
    import { vocabularyStore } from "$lib/stores";


  export let pageData: any = null;
  export let passage: Passage | null;
  export let themeColor: any;
  export let form: any = null;

  const supabase = pageData.supabase;

  const userLanguage = pageData?.session?.user?.profile.native_language ?? "ja";

  let clickedWord: string | any = "";
  let custom_translation: string | null = null;
  let selectedPOS: string = "";
  let newTitle: string = passage?.title ?? '';
  let splitPassage = passage?.split() ?? [];
  let innerWidth: number;
  let translationModal = false;
  let isCustomizedTranslation = false;
  let noTranslationFound = false;
  let titleForm: HTMLFormElement;

  let averageRating: number = 0;

  let wordMatchesList: any;
  let selectedVocab: any = {};


  const projectId = "page-turner-388715";
  const location = "global";

  const PosSelectOptions = toSelectOptions(
    pageData.POS,
    "id",
    userLanguage + "_name"
  );

  async function lookupVocab(word: string) {
    

    // Reset wordMatchesList
    wordMatchesList = [];
    word = removePunctuation(word);
    const translation = await fetch('/api/translate', {
        method: 'POST',
        body: JSON.stringify({text: word, source: passage?.language, target: userLanguage}),
    });

    const result = await translation.json();
    console.log(result.translations);
    wordMatchesList = result.translations;

    // Lookup exact word
    const { data: exactMatches, error } = await supabase
      .from("vocabulary")
      .select("*")
      .eq("word", word.toLowerCase());

    if (exactMatches && exactMatches?.length == 1) {
      selectedVocab = exactMatches[0];
      console.log('exactMatches:',exactMatches);
      wordMatchesList.concat(exactMatches);
      return wordMatchesList;
    }

    // Lookup fuzzy matches on 'inflections' AND 'en_word'
    const fuzzyInflectionSearch = supabase
      .from("vocabulary")
      .select("*")
      .textSearch("inflections", word.toLowerCase());
    const fuzzyEnWordSearch = supabase
      .from("vocabulary")
      .select("*")
      .textSearch("word", word.toLowerCase());

    const [
      { data: inflectionData, error: inflectionError },
      { data: enWordData, error: enWordError },
    ] = await Promise.all([fuzzyInflectionSearch, fuzzyEnWordSearch]);

    if (enWordError || inflectionError) {
      return [];
    }

    // // Lookup customized translations existing on 'user_vocabulary'
    // const {data: userVocabData, error: userVocabError } = await supabase.from('user_vocabulary').select('custom_translation').eq('word',word.toLowerCase());
    // console.log('userVocabData:',userVocabData);
    // if(userVocabData?.length > 0) {
    //     custom_translation = userVocabData?.[0]?.custom_translation ?? '';
    // }
    console.log('inflectionData:',inflectionData, 'enWordData:',enWordData);
    // concatenate results if not null
    wordMatchesList = wordMatchesList?.concat(
      inflectionData ?? [],
      enWordData ?? []
    );

    // Remove duplicates between 'inflections' and 'en_word' results
    wordMatchesList = wordMatchesList?.reduce((acc: any, current: any) => {
      const found = acc.find(
        (item: any) =>
          item.id === current.id ||
          (item.word == current.word && item.POS == current.POS)
      );
      return !found ? acc?.concat([current]) : acc;
    }, []);
    return wordMatchesList;
  }

  function displayPOS(item: any) {
    selectedPOS = item.POS;
    const posName = pageData.POS.find((el: any) => el.id === item.POS || el.alternative_code === item.POS)?.[
      userLanguage + "_name"
    ];
    return posName;
  }

  async function launchSaveProcess(word: string | any) {
    console.log($page.data);
    $vocabularyStore = [];
    translationModal = true;
    isCustomizedTranslation = noTranslationFound
      ? true
      : isCustomizedTranslation;
    // if word not in 'vocabulary', add it with a isPublic flag at false
    if (wordMatchesList?.length === 0) {
      const { data: insertData, error } = await supabase
        .from("vocabulary")
        .insert({ word: removePunctuation(word), isPublic: false })
        .select()
        .single();
      if (error) console.log("Error inserting word:", error);
      else {
        wordMatchesList = [insertData];
        selectedVocab = insertData;
      }
    }
  }

  console.log($page.data);

  async function handleTranslationSubmit(vocabulary: any) {
    if (isCustomizedTranslation) {
      const { data, error } = await supabase
        .from("user_vocabulary")
        .insert({
          custom_translation,
          user_id: pageData?.session?.user.id,
          vocabulary_id: vocabulary.id,
        })
        .select();
      const { data: updateData, error: updateError } = await supabase
        .from("vocabulary")
        .update({ POS: selectedPOS })
        .eq("id", vocabulary.id)
        .select();
    } else {
      $vocabularyStore.forEach(async (id: any) => {
        const { data: insertData, error } = await supabase
          .from("user_vocabulary")
          .insert({
            custom_translation,
            user_id: $page.data.profile.id,
            vocabulary_id: id,
          })
          .select();
        if (error) {
          console.log("Error inserting word:", error);
          return;
        }
      });
    }
    translationModal = false;
    custom_translation = "";
  }

  async function print() {
    window.print();
  }

  $: noTranslationFound =
    wordMatchesList?.filter((el: any) => el.ja_word).length === 0;

  $: if (passage) {
    splitPassage = passage.split();
  } else {
    splitPassage = splitWords(form?.message);
  }

</script>

<svelte:window bind:innerWidth />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- TODO: do something about a11y -->

{#if splitPassage?.length > 0}
  

  {#if passage?.rating}
    <Badge>User Ratings: {passage.rating} / 5</Badge>
    <Badge color="red">{passage.nb_ratings} ratings</Badge>
    <Rating total={5} rating={passage.rating} />
  {/if}
  <!-- <div class="italic text-md mb-3">{passage.prompt ?? ''}</div> -->
  <!-- <span class="text-[0.5rem]">Photo credit: {pageData?.pic?.photographer} from <a href={pageData?.pic?.photographer_url}>Pexels</a></span> -->
  <div class="passage md:p-8 p-2 text-black bg-slate-50 mt-4 rounded">
    <!-- <div class="w-full h-32 mb-2 bg-center bg-no-repeat bg-cover rounded-lg" style="background-image:url({pageData?.pic?.src?.large})">
    </div> -->

    {#each splitPassage as word, index}
      {#if word == "\n"}
        <br />
      {:else if word == "\t"}
        &nbsp;&nbsp;&nbsp;&nbsp;
      {:else}
        <button
          class="forceprint"
          type="button"
          id="word-{index}"
          on:click={() => {
            clickedWord = removePunctuation(word);
          }}
        >
          {word}
        </button>
        <Popover
          trigger="click"
          triggeredBy="[id='word-{index}']"
          placement="top"
          arrow={false}
          yOnly={innerWidth <= 425}
          class="p-0"
        >
          {#if custom_translation} ✅ {/if}
          <span class="text-xl pb-3 font-semibold text-white">
            {clickedWord +
              (custom_translation ? `: ${custom_translation}` : "")}
          </span>

          <ol>
            {#await lookupVocab(word)}
              <Spinner size="5" color={themeColor} />
            {:then lookupData}
              {#if lookupData && lookupData.length > 0}
                {#each lookupData as item}
                  <li
                    class="border-b border-slate-500 text-sm mb-1 flex flew-row justify-between"
                  >
                    <div
                      class="mr-2 max-w-[38ch] overflow-hidden text-ellipsis md:max-w-fit"
                    >
                      {item.POS ? `【${displayPOS(item)}】` : ""}
                      {item.word}
                      {item.ja_word ? `➡ ${item.ja_word}` : ""}
                    </div>
                  </li>
                {/each}
              {/if}
            {:catch error}
              <li>error: {error.message}</li>
            {/await}
          </ol>
          {#if passage?.language == "en"}
            <div class="pt-2 flex justify-center">
              <button
                type="button"
                on:click={() => searchWeblio(word)}
                class="btn variant-filled-primary"
              >
                <span class="text-3xl">🔍</span>
              </button>
              <button
                type="button"
                on:click={() => {
                  launchSaveProcess(word);
                }}
                class="btn variant-filled-primary"
              >
                <span class="text-3xl">💾</span>
              </button>
            </div>
          {:else}
            <p>Sorry, this feature is only available for English passages.</p>
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
      <button type="button" on:click={() => searchWeblio(clickedWord)}>
        <span class="text-xl">🔍</span>
      </button>
    </h2>
    {#if noTranslationFound}
      <p class="mt-2 text-xs">翻訳がまだありません！</p>
    {:else}
      <Toggle
        color="blue"
        class="mt-2"
        name="isCustomizedTranslation"
        bind:checked={isCustomizedTranslation}
      >
        入力モード {isCustomizedTranslation ? "ON" : "OFF"}
      </Toggle>
    {/if}

    {#if isCustomizedTranslation}
      <div class="mt-2 flex flex-col">
        <Label for="POS" class="mt-2 self-start"
          >品詞
          <Select
            name="POS"
            size="sm"
            bind:value={selectedPOS}
            items={PosSelectOptions}
            class="mt-1"
          />
        </Label>
        <Label for="custom_translation" class="mt-2 self-start">
          翻訳
          <Input
            type="text"
            placeholder="翻訳を自分で入力"
            name="custom_translation"
            bind:value={custom_translation}
          />
        </Label>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
      </div>
    {:else}
      <div class="flex flex-col gap-2">
        {#if wordMatchesList}
          {#each wordMatchesList.filter(
                    //@ts-ignore
                    (item) => item.ja_word) as vocab, key}
            <Checkbox
              name="vocabulary_id"
              value={parseInt(vocab.id)}
              class="w-full p-2"
              bind:group={$vocabularyStore}
            >
              【{displayPOS(vocab)}】
              {`${vocab.word} ➡ ${vocab.ja_word}`}
            </Checkbox>
          {/each}
        {/if}
      </div>
    {/if}
    <GradientButton
      pill={true}
      type="button"
      color="tealToLime"
      class="m-4"
      disabled={!$vocabularyStore && !custom_translation}
      on:click={() => {
        handleTranslationSubmit(selectedVocab);
      }}
    >
      {isCustomizedTranslation ? "入力" : "選択"}した翻訳で保存
    </GradientButton>
  </div>
</Modal>
