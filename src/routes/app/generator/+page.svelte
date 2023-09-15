<script lang="ts">
  import type { PageData } from "./$types";
  import { useChat, useCompletion } from "ai/svelte";
  import { superForm } from "sveltekit-superforms/client";
  import {
    Badge,
    Checkbox,
    Chevron,
    Textarea,
    GradientButton,
    Input,
    Label,
    Modal,
    Select,
    TextPlaceholder,
    Spinner,
    Toggle,
    Button,
  } from "flowbite-svelte";
  import { random, toSelectOptions } from "$lib/helpers/Arrays";
  import Reader from "$lib/components/organisms/Reader.svelte";
  import { DUMMY_PASSAGE } from "../../../config/constants";
  import { costToGenerate } from "$lib/logic/points";
  import { isAllowedToGenerate } from "$lib/logic/passages";
  import type { GenerationPermission } from "$lib/types";
  import { pointStore } from "$lib/stores";
  import { C_ } from "$lib/i18n/helpers";
  import { _ } from "svelte-i18n";
  import { Collection } from "$lib/models/Collection";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
  import type { Snapshot } from "./$types";
  import { Profile } from "$lib/models/Profile";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { Passage } from "$lib/models/Passage";
    import { slide } from "svelte/transition";
    import TextArea from "$lib/components/atoms/TextArea.svelte";

  export let data: PageData;
  const supabase = data.supabase;
  const { form, enhance, reset, errors, constraints, message } = superForm(
    data.form,
    {
      dataType: "json",
      applyAction: true,
      resetForm: false,
      invalidateAll: true,
      onUpdated: ({ form }) => {
        console.log("Loading:", loading);
      },
    }
  );

  export const snapshot = {
    capture: () => $form.language,
    restore: (value: Snapshot) => {
      console.log("Snapshot", value);
      $form.language = value;
    },
  };

  onMount(async () => {
    allowed = await isAllowedToGenerate(
      supabase,
      profile,
      $form.length,
      multiplier ?? 0,
      $form.quality
    );
  });

  let loading: boolean = false;
  const getRandomColor = () => {
    return random(["green", "blue", "red", "yellow", "purple", "pink"]);
  };
  let innerWidth: number;
  let passage: any;
  let startTime: number;
  let timer: any;
  let elapsedTime: string;
  let multiplier: number | undefined = 1;
  let allowed: GenerationPermission | undefined;
  let allowedLengths = new Collection(data.lengths);
  let averageDuration =
    data.passages
      .map((el: any) => el.generation_duration)
      .reduce((a: any, b: any) => a + b, 0) / data.passages.length;
  let topicPicker = false;
  let grammarPointPickerOpen = false;

  const completion = writable(new Passage({content: ""}));
  const profile = new Profile(data.profile);
  const languages = new Collection(data.languages);
  const qualityLevels = new Collection(data.qualityLevels);
  const topics = new Collection(data.topics);
  const myRecentPassageHistory = new Collection(data.myRecentPassageHistory);
  const grammarPoints = new Collection(data.grammarPoints);

  const { input, messages } = useChat({
    api: "/app/generator",
  });

  $form.language =
    myRecentPassageHistory[0]?.language ??
    profile.studying_languages?.at(0) ??
    "en";

  async function handleSubmit(e: any) {
    e.preventDefault();
    loading = true;
    startTimer();
    // if(!$form.testMode) {
    //     new Promise(r => setTimeout(r, 1000)).then(() => {
    //         passage = { content: DUMMY_PASSAGE };
    //         loading = false;
    //     });
    // }
    fetch("/app/generator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify($form),
    })
      .then((response) => {
        const reader = response?.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) {
          loading = false;
          return;
        }
        const readStream = async () => {
          const { value, done } = await reader.read();
          if (done) {
            return;
          }
          const decodedValue = decoder.decode(value);
          $completion.content += decodedValue;
          readStream();
        };

        readStream();
      })
      .finally(() => {
        loading = false;
      });

    $pointStore -= costToGenerate($form.length, multiplier ?? 1);
  }

  function startTimer() {
    startTime = performance.now();
    clearInterval(timer);
    timer = setInterval(updateElapsedTime, 100);
  }

  function updateElapsedTime() {
    const time = performance.now() - startTime;
    const elapsedTimeRounded = Math.round(time / 100) / 10;
    elapsedTime = elapsedTimeRounded.toFixed(1);
  }

  async function assessAllowed() {
    allowed = await isAllowedToGenerate(
      supabase,
      profile,
      $form.length,
      multiplier ?? 0,
      $form.quality
    );
  }

  $: multiplier = (data.qualityLevels as any).find(
    (q: any) => q.id == $form.quality
  )?.multiplier;

  $: {
    allowedLengths =
      $form.quality == "3"
        ? (data?.lengths as any).filter((length: any) => length.allowedForTrial)
        : data.lengths;
    allowedLengths = new Collection(allowedLengths);
  }

</script>

<svelte:window bind:innerWidth />

<!-- Path: src\routes\app\generator\+page.svelte -->
{#if data.ENV == "dev" && !$form.testMode}
  <div class="fixed bottom-0 leading-3 w-full z-50 opacity-60 text-xs">
    <SuperDebug data={$form} />
  </div>
{/if}
<div class="w-full h-full sm:px-16 px-2 md:mt-10 mt-10 mb-40">
  <Badge class="mt-2 md:text-lg p-1"
    ><span class="text-lg mr-2">🤖</span> {$C_("generator")}
  </Badge>
  <Badge class="mt-2 md:text-lg p-1" color="yellow">
    <span class="text-lg mr-2">⏱️</span> ～ {1.1 * averageDuration
      ? Math.round(averageDuration / 1000)
      : 0}
    {$_("seconds")}
  </Badge>
  <form method="POST" action="?/getPassage" use:enhance>
    <div class="grid grid-cols-3 md:grid-cols-2 gap-2 font-pixel mt-4">
      <Label for="type">
        <span class="text-xs md:text-lg"> {$C_("passage_type")} </span>
        <Select
          label="Type"
          name="type"
          bind:value={$form.type}
          items={toSelectOptions(data.types, "id", "name", $C_)}
        />
      </Label>

      <Label>
        <span class="text-xs md:text-lg"> {$C_("language")} </span>
        <Select
          label="Language"
          name="language"
          bind:value={$form.language}
          items={languages.toSelectOptions("lang_code", "name_native")}
          on:change={assessAllowed}
        />
      </Label>
      <Label>
        <span class="text-xs md:text-lg"> {$C_("passage_length")} </span>
        <Select
          label="length"
          name="length"
          bind:value={$form.length}
          items={allowedLengths.toSelectOptions(
            "word_count",
            "label",
            $C_,
            "word_count",
            "~"
          )}
          on:change={assessAllowed}
        />
      </Label>
      <div class="col-span-2 md:col-span-1">
        <Label>
          <span class="text-xs md:text-lg"> {$C_("passage_quality")} </span>
          <Select
            label="length"
            name="length"
            bind:value={$form.quality}
            items={qualityLevels.toSelectOptions(
              "id",
              "label",
              $C_,
              "multiplier",
              "x"
            )}
            on:change={assessAllowed}
          />
        </Label>
      </div>

      <div class="col-span-3 md:col-span-2">
        {#if $form.freeInput}
          <Label for="prompt">
            <span class="text-xs md:text-lg"> {$C_("passage_prompt")} </span>
            <Textarea
              class="h-20"
              type="text"
              name="prompt"
              label="テーマ"
              placeholder="ここで入力・Type here..."
              bind:value={$form.customPrompt}
            />
            <!-- <Helper class="text-sm"> <i id="info-icon" class="bi bi-exclamation-circle-fill"></i> Hint</Helper> -->
          </Label>
        {:else}
          <Label for="prompt">
            <span class="text-xs md:text-lg"> {$C_("passage_prompt")} </span>
            <Select
              label="Topic"
              name="prompt"
              bind:value={$form.prompt}
              items={toSelectOptions(data.topics, "id", "prompt")}
            />
            <!-- <Helper class="text-sm"> <i id="info-icon" class="bi bi-exclamation-circle-fill"></i> Hint </Helper> -->
          </Label>
        {/if}
      </div>
        <GradientButton type="button" shadow color="pink" class="col-span-3" on:click={() => grammarPointPickerOpen = !grammarPointPickerOpen}>
          {$C_("choose_grammar_points")}
        </GradientButton>
        {#if grammarPointPickerOpen}
        <div transition:slide class="col-span-3 grid grid-cols-2 tracking-wide">
          {#each grammarPoints as point, key}
                <Checkbox name="grammar_points" class="p-3" bind:group={$form.grammar_points} value={point.name}
                    checked={$form.grammar_points.includes(point.name)}>{point.name}</Checkbox>
          {/each}
        </div>
        {/if}
      <!-- <Toggle color={getRandomColor()} name="freeInput" bind:checked={$form.freeInput} class="col-span-2 text-xs md:text-lg"> {$C_('free_input')} </Toggle> -->
      <GradientButton
        type="button"
        shadow
        color="pink"
        class="w-full col-span-3"
        on:click={() => (topicPicker = !topicPicker)}
      >
        {$C_("choose_existing")}
      </GradientButton>

      <div id="separator" class="w-full col-span-3 my-4">
        <hr />
      </div>

      {#if allowed?.ok}
        <GradientButton
          type="submit"
          shadow
          color="tealToLime"
          class="col-span-3 md:col-span-2 text-xl md:text-4xl pb-4 md:mt-2 place-self-center"
          on:click={handleSubmit}
        >
          {#if loading}
            <Spinner size="5" color={getRandomColor()} />
            <span class="text-lg inline-block w-5 mx-4">{elapsedTime}</span>
          {:else}
            {$form.testMode
              ? costToGenerate($form.length, multiplier ?? 1)
              : 0}🪙
            {$C_("lets_do_this")} <span class="text-3xl inline-block">🪄</span>
          {/if}
        </GradientButton>
      {:else}
        <GradientButton
          type="submit"
          shadow
          color="pinkToOrange"
          class="col-span-3 md:col-span-2 text-xl md:text-2xl pb-4 md:mt-2"
          disabled
        >
          {#if allowed?.messages?.length && allowed?.messages?.length > 0}
            {#each allowed?.messages as message}
              {message} <br />
            {/each}
          {/if}
        </GradientButton>
      {/if}

      <!-- {#if $completion?.content}
        <div class="bg-white">
          <p>PASSAGE:</p>
          {$completion.content}
        </div>
      {/if}
    </div> -->
  </form>

  {#if $completion.content}
        <div class="pb-16">
            <Reader passage={$completion} themeColor={getRandomColor()} pageData={data}/>
        </div>
    {:else}
        {#if loading}
        <div class="rounded md:w-full mt-4 mx-2 p-2 bg-slate-200 grid grid-cols-2 gap-1">
            <TextPlaceholder size="xxl"/>
            <TextPlaceholder size="xxl"/>
            <TextPlaceholder size="xxl"/>
            <TextPlaceholder size="xxl"/>
            <TextPlaceholder size="xxl"/>
        </div>  
        {/if}
    {/if}
</div>

<Modal open={loading} autoclose>
  <p class="text-2xl">Generating...</p>
  <GradientButton color="pinkToOrange" href="/app/tandle"
    >Play a game ? 😃</GradientButton
  >
</Modal>

<Modal bind:open={topicPicker} autoclose class="w-5/6">
  <p>{$C_("choose_existing")}</p>
  <Label>
    {$C_("browse_topics")}
    <Select
      label="Topic"
      name="prompt"
      bind:value={$form.customPrompt}
      items={topics.toSelectOptions("prompt", "prompt")}
      on:change={() => console.log($form.customPrompt)}
    />
  </Label>
  <Label>
    {$C_("from_my_topics")}
    <Select
      label="Topic"
      name="prompt"
      bind:value={$form.customPrompt}
      items={myRecentPassageHistory.toSelectOptions("prompt", "prompt")}
      on:change={() => console.log($form.customPrompt)}
    />
  </Label>
  <GradientButton color="blue" class="w-full">OK</GradientButton>
</Modal>
