<script lang="ts">
    import type { PageData } from './$types';
    
    import { superForm } from 'sveltekit-superforms/client';
    import { Badge, GradientButton, Input, Label, Modal, Select, TextPlaceholder, Spinner, Toggle } from 'flowbite-svelte';
    import { random} from '$lib/helpers/Arrays';
    import Reader from '$lib/components/organisms/Reader.svelte';
    import { DUMMY_PASSAGE } from '../../../config/constants';
    import { costToGenerate } from '$lib/logic/points';
    import { isAllowedToGenerate } from '$lib/logic/passages';
    import type { GenerationPermission } from '$lib/types';
    import {pointStore} from '$lib/stores';
    import { C_ } from '$lib/i18n/helpers';
    import { _ } from 'svelte-i18n';

    export let data: PageData;
    const supabase = data.supabase;
    const { form, enhance, reset, errors, constraints, message } = superForm(data.form, {
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true,
        onUpdated: ({ form }) => { console.log('Loading:',loading); },
    });

    let loading: boolean = false;
    const getRandomColor = () => { return random(["green","blue","red","yellow","purple","pink"]) };
    let innerWidth: number;
    let passage: any;
    let startTime: number;
    let timer: any;
    let elapsedTime: string;
    let multiplier: number | undefined = 1;
    let allowed: GenerationPermission = data.allowed;
    let allowedLengths = data.lengths;
    let averageDuration = data.passages.map( (el: any) => el.generation_duration).reduce((a: any, b: any) => a+b, 0) / data.passages.length;
    

    function handleSubmit(e: any) {
        loading = true;
        startTimer();
        if(!$form.testMode) {
            new Promise(r => setTimeout(r, 1000)).then(() => {
                passage = { content: DUMMY_PASSAGE };
                loading = false;
            });
        }
        $pointStore -= costToGenerate($form.length, multiplier ?? 1)
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
        allowed = await isAllowedToGenerate(supabase, data?.session?.user, $form.length, multiplier ?? 0, $form.quality);
    }

    $: multiplier = data.qualityLevels.find((level: any) => level.value == $form.quality)?.multiplier;
    $: allowedLengths = $form.quality == '3' ? data.lengths.filter((length: any) => length.allowedForTrial ) : data.lengths;

</script>
<svelte:window bind:innerWidth={innerWidth} />

<!-- Path: src\routes\app\generator\+page.svelte -->
<div class="w-full h-full sm:px-16 px-2 md:mt-10 mt-10 mb-32">
    <Badge class="mt-2 md:text-lg p-1"><span class="text-lg mr-2">🤖</span> {$C_('generator')} </Badge>
    <Badge class="mt-2 md:text-lg p-1" color="yellow">
        <span class="text-lg mr-2">⏱️</span> ～ { 1.1 * averageDuration ? Math.round(averageDuration / 1000) : 0} {$_('seconds')} 
    </Badge>
    <form method="POST" action="?/getPassage" use:enhance>
        <div class="grid grid-cols-3 md:grid-cols-2 gap-2 font-pixel mt-4">
            <Label for="type">
                <span class="text-xs md:text-lg"> {$C_('passage_type')} </span>
                <Select label="Type" name="type" bind:value={$form.type} items={data.types}/>
            </Label>

            <Label>
                <span class="text-xs md:text-lg"> {$C_('language')} </span>
                <Select label="Language" name="language" bind:value={$form.language} items={ data.languages } on:change={assessAllowed}/>
            </Label>
            <Label>
                <span class="text-xs md:text-lg"> {$C_('passage_length')} </span>
                <Select label="length" name="length" bind:value={$form.length} items={ allowedLengths } on:change={assessAllowed}/>
            </Label>
            <div class="col-span-2 md:col-span-1">
                <Label>
                    <span class="text-xs md:text-lg"> {$C_('passage_quality')} </span>
                    <Select label="length" name="length" bind:value={$form.quality} items={ data.qualityLevels } on:change={assessAllowed}/>
                </Label>
            </div>

            <div class="col-span-3 md:col-span-2">
            {#if $form.freeInput}
            
                <Label for="prompt">
                    <span class="text-xs md:text-lg"> {$C_('passage_prompt')} </span>
                    <Input type="text" name="prompt" label="テーマ" placeholder="ここで入力・Type here..." bind:value={$form.customPrompt}/>
                    <!-- <Helper class="text-sm"> <i id="info-icon" class="bi bi-exclamation-circle-fill"></i> Hint</Helper> -->
                </Label>
            {:else}
                <Label for="prompt">
                    <span class="text-xs md:text-lg"> {$C_('passage_prompt')} </span>
                    <Select label="Topic" name="prompt" bind:value={$form.prompt} items={data.topics}/>
                    <!-- <Helper class="text-sm"> <i id="info-icon" class="bi bi-exclamation-circle-fill"></i> Hint </Helper> -->
                </Label>
            {/if}
            </div>
            <Toggle color={getRandomColor()} name="freeInput" bind:checked={$form.freeInput} class="col-span-2 text-xs md:text-lg"> {$C_('free_input')} </Toggle>
            {#if data.ENV == "dev"}
                <Toggle color={getRandomColor()} name="testMode" bind:checked={$form.testMode} class="text-xs md:text-lg col-span-3 md:col-span-2"> {$form.testMode ? "Test Mode" : "Dev Mode"} </Toggle>
            {/if}

            {#if allowed.ok}
            <GradientButton type="submit" shadow color="tealToLime" class="col-span-3 md:col-span-2 text-xl md:text-4xl pb-4 md:mt-2" on:click={handleSubmit}> 
                {#if loading}
                    <Spinner size="5" color={getRandomColor()} />
                    <span class="text-lg inline-block w-5 mx-4">{elapsedTime}</span>
                {:else}
                {$form.testMode ? costToGenerate($form.length, multiplier ?? 1) : 0 }🪙 
                    {$C_('lets_do_this')} <span class="text-3xl inline-block">🪄</span>
                
                {/if}
            </GradientButton>
            {:else}
            <GradientButton type="submit" shadow color="pinkToOrange" class="col-span-3 md:col-span-2 text-xl md:text-2xl pb-4 md:mt-2" disabled> 
                {#each allowed?.messages as message}
                    {message} <br/>
                {/each}
            </GradientButton>
            {/if}
        </div>
        

        
    </form>

    

    {#if passage}
        <div class="pb-16">
            <Reader {passage} themeColor={getRandomColor()} pageData={data}/>
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

<Modal bind:open={loading} autoclose>
    <p class="text-2xl">Generating...</p>
    <GradientButton color="pinkToOrange" href="/app/sverdle">Play a game ? 😃</GradientButton>
</Modal>