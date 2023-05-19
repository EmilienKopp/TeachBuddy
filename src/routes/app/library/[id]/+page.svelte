<script lang="ts">
    import { Button, FloatingLabelInput, Input, Popover, Modal, SpeedDial, SpeedDialButton, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
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
    <Button class="fixed bottom-6 right-6" type="button" pill gradient color="pinkToOrange" on:click={() => { goto('/app/library') }}>
        戻る
    </Button>
    <div class="mt-4 px-2 pb-16 md:px-16">
        <form method="POST" action="?/getPassage" use:enhance>
            <Reader passage={data.passage} themeColor="blue" pageData={data}/>
        </form>
    </div>
</div>
