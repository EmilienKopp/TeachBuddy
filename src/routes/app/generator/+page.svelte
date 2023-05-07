<script lang="ts">
    import type { PageData } from './$types';
    
    import { superForm } from 'sveltekit-superforms/client';
    import { Badge, Button, FloatingLabelInput, Helper, Input, Label, Select, TextPlaceholder, Spinner, Toggle, Toast } from 'flowbite-svelte';
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
<div class="w-full h-full sm:px-16 px-2 mt-10">
    <Badge class="mb-4">長文生成・Generator</Badge>
    <form method="POST" action="?/getPassage" use:enhance>
        <div class="md:grid md:grid-cols-2 flex flex-col gap-2">
            <Label for="type">
                <span class="italic">種類・Type</span>
                <Select label="Type" name="type" bind:value={$form.type} items={data.types}/>
            </Label>

            <Label>
                <span class="italic">言語・Language</span>
                <Select label="Language" name="language" bind:value={$form.language} items={ data.languages }/>
            </Label>
            {#if $form.freeInput}
                <Label for="prompt">
                    <span class="italic">自分で入力・Custom Prompt</span>
                    <Input type="text" name="prompt" label="テーマ" placeholder="ここで入力・Type here..." bind:value={$form.customPrompt}/>
                    <Helper class="text-sm"> <i id="info-icon" class="bi bi-exclamation-circle-fill"></i> Hint</Helper>
                </Label>
            {:else}
                <Label for="prompt">
                    <span class="italic">テーマ・Prompt</span>
                    <Select label="Topic" name="prompt" bind:value={$form.prompt} items={data.topics}/>
                    <Helper class="text-sm"> <i id="info-icon" class="bi bi-exclamation-circle-fill"></i> Hint </Helper>
                </Label>
            {/if}


            <Toggle color={randomColor} name="freeInput" bind:checked={$form.freeInput}> 自分で入力・Free Input </Toggle>
            <Toggle color={randomColor} name="testMode" bind:checked={$form.testMode}> {$form.testMode ? "Test Mode" : "Dev Mode"} </Toggle>
        </div>
        <Badge class="mt-2" color="green">
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
    {:else}
        {#if loading}
            <TextPlaceholder size="xxl" class="mx-2 p-2 "/>
        {/if}
    {/if}
</div>