<script lang="ts">
    import { Button, FloatingLabelInput, Modal } from 'flowbite-svelte';
    import { goto } from '$app/navigation';

    export let modalOpen: boolean = false;
    export let selectedItem: any;
    export let deleteHandler: ((e: MouseEvent) => void) | null | undefined;
    export let updateHandler: ((e: MouseEvent) => void) | null | undefined;

</script>

<Modal bind:open={modalOpen} autoclose>
    <div class="z-50 mt-3">
        <FloatingLabelInput type="text" label="タイトルを入力" bind:value={selectedItem.title} placeholder="タイトルを変更"/>
        {#if selectedItem.prompt}
        <div class="max-w-[40ch] md:max-w-[150ch] text-ellipsis overflow-hidden italic border rounded-md border-slate-500 my-2 p-1">
            <h3 class="font-bold text-teal-500 text-lg">プロンプト</h3>
            <div class="text-xs">{selectedItem.prompt}</div>
        </div>
        {/if}
        <Button class="mt-3" type="button" pill size="sm" fill color="red" on:click={deleteHandler}>🗑️ 削除</Button>
        <Button class="mt-3" type="button" pill size="sm" fill color="green" on:click={updateHandler}>💾 保存</Button>
        <Button class="mt-3" type="button" pill size="sm" fill color="blue" on:click={()=> { goto('/app/library/' + selectedItem.id) }}>開く</Button>
    </div>
</Modal>