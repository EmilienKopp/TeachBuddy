<script lang="ts">
    import { Button, GradientButton, Spinner } from 'flowbite-svelte';
    import Reader from '$lib/components/organisms/Reader.svelte';
    import type { PageData } from './$types';
    import { goto, invalidateAll } from '$app/navigation';
    import InfoBubble from '$lib/components/atoms/InfoBubble.svelte';
    import { superForm } from 'sveltekit-superforms/client';
    import { Passage } from "$lib/models/Passage";
    import { vocabularyStore } from '$lib/stores';

    export let data: PageData;

    const passage = data.passage;
    const supabase = data.supabase;

    let loading = false;

    const { form: storeUserVocabForm, enhance: storeUserVocabEnhance } = superForm(data.storeUserVocabForm, {
        id: 'storeUserVocabForm',
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true,
        onSubmit: () => { loading = true; },
        onUpdated: () => { loading = false; },
    });

    const { form: titleEditForm, enhance: titleEditEnhance, delayed } = superForm(data.titleEditForm, {
        id: 'titleEditForm',
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true,
    });

    function print() {
        window.print();
    }

</script>

<div class="pt-10">
    <GradientButton class="noprint fixed bottom-6 right-6 md:text-xl md:p-3" type="button" pill color="pinkToOrange" on:click={() => { history.back() }}>
        <i class="bi bi-reply-fill"></i>
    </GradientButton>
    <GradientButton class="noprint fixed bottom-6 right-24 md:text-3xl md:p-5 sm:hidden" type="button" pill color="pinkToOrange" on:click={print}>
        <i class="bi bi-download"></i> 
    </GradientButton>
    <div class="mt-4 px-2 pb-16 md:px-16">
        <form method="POST" action="?/updatePassageTitle" use:titleEditEnhance>
            <div class="mt-4 md:mt-12 flex flex-row justify-around md:justify-normal gap-2">
                <h2 contenteditable="true" bind:innerHTML={$titleEditForm.title}
                class="w-full text-2xl md:text-4xl text-lime-500 font-pixel px-3 pb-2 bg-white bg-opacity-80 rounded md:bg-transparent;"
                >
                {passage?.title ?? "タイトルなし"}
                </h2>
                <button formaction="?/updatePassageTitle" class="bg-transparent" title="Save Title">
                    {#if $delayed}
                    <Spinner size="8" />
                    {:else}
                    <span class="text-2xl">💾</span>
                    {/if}
                </button>
                <input type="hidden" name="title" value={$titleEditForm.title} />

                <GradientButton pill={true}  type="button" class="noprint hidden sm:block text-center" color="red"  on:click={print}>
                    <i class="bi bi-download text-3xl" />
                </GradientButton>
            </div>
            <Reader {passage} themeColor="blue" pageData={data} form={storeUserVocabForm}/>
        </form>
    </div>
</div>
