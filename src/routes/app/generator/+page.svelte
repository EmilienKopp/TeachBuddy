<script lang="ts">
    import type { PageData } from './$types';
    
    import { superForm } from 'sveltekit-superforms/client';
    import { Badge, Button, FloatingLabelInput, Spinner, Toggle, Toast, Select } from 'flowbite-svelte';
    import { slide, fade } from 'svelte/transition';
    import { random, uniquify, Policies, toSelectOptions } from '$lib/helpers/Arrays';
    import Reader from '$lib/components/organisms/Reader.svelte';
    import { DUMMY_PASSAGE } from '../../../config/constants';

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
    let randomColor: any = random(["green","blue","red","yellow","purple","pink"]);
    let innerWidth: number;
    let passage: any;
    let startTime: number;
    let timer: any;
    let elapsedTime: string;
    
    supabase.channel('any')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'passages' }, payload => {
                console.log('Change received!', payload);
                loading = false;
                passage = payload.new;
                // splitPassage = splitWords(passage);
                const totalTime = Math.round(Date.now() - startTime);
                supabase.from('passages').update({ total_time: totalTime }).eq('id', payload.new.id).then(({ data, error }) => {
                    if (error) console.log('Error updating passage:', error);
                });
                clearInterval(timer);
            }).subscribe()

    function handleSubmit(e: any) {
        loading = true;
        startTimer();
        if(!$form.testMode) {
            new Promise(r => setTimeout(r, 1000)).then(() => {
                passage = { content: DUMMY_PASSAGE };
                loading = false;
            });
        }
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

    // $: if(passage) { console.log(passage); splitPassage = splitWords(passage); }
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
            {#if $form.freeInput}
            <FloatingLabelInput type="text" name="prompt" label="テーマ" bind:value={$form.customPrompt} class="my-3"/>
            {:else}
            <Select label="Topic" name="prompt" bind:value={$form.prompt} items={data.topics} class="my-2 md:col-span-3"/>
            {/if}
            <Toggle color={randomColor} name="freeInput" bind:checked={$form.freeInput}> 自分で入力 </Toggle>
            <Select label="Language" name="language" bind:value={$form.language} items={ data.languages } class="my-2"/>
            <Toggle color={randomColor} name="testMode" bind:checked={$form.testMode}> {$form.testMode ? "Test Mode" : "Dev Mode"} </Toggle>
        </div>
        <Badge class="mt-2">
            <span class="text-xl mr-2">⏱️</span> 平均生成時間: { 1.1 * data.averageDuration ? Math.round(data.averageDuration / 1000) : 0} seconds 
        </Badge>

        <Button pill={true} type="submit" color="tealToLime" outline gradient class="m-4" on:click={handleSubmit}> 
            <span class="text-3xl mr-2">
                {#if loading}
                    <Spinner size="10" color={randomColor} />
                    <span class="text-xs">{elapsedTime}</span>
                {:else}
                    🖋️
                {/if}
            </span>GIVE ME SOME 長文！！
        </Button>
    </form>

    {#if passage}
        <div class="pb-16">
            <Reader {passage} themeColor={randomColor} pageData={data}/>
        </div>
    {/if}
</div>