<script lang="ts">
    import { GradientButton } from 'flowbite-svelte';
    import Reader from '$lib/components/organisms/Reader.svelte';
    import type { PageData } from './$types';
    import { goto, invalidateAll } from '$app/navigation';
    import InfoBubble from '$lib/components/atoms/InfoBubble.svelte';
    import { superForm } from 'sveltekit-superforms/client';

    export let data: PageData;
    const supabase = data.supabase;

    const { form, enhance, reset, errors, constraints, message } = superForm(data.form, {
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true,
    });

    $: console.log(data);
</script>

<div class="pt-10">
    <GradientButton class="noprint fixed bottom-6 right-6 md:text-xl md:p-3" type="button" pill color="pinkToOrange" on:click={() => { history.back() }}>
        <i class="bi bi-reply-fill"></i>
    </GradientButton>
    <GradientButton class="noprint fixed bottom-6 right-24 md:text-3xl md:p-5 sm:hidden" type="button" pill color="pinkToOrange" on:click={() => { window.print() }}>
        <i class="bi bi-download"></i> 
    </GradientButton>
    <div class="mt-4 px-2 pb-16 md:px-16">
        <form method="POST" action="?/getPassage" use:enhance>
            <Reader passage={data.passage} themeColor="blue" pageData={data} {form}/>
        </form>
    </div>
</div>
