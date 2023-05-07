<script lang="ts">
    import { Button, FloatingLabelInput, Input, Popover, Modal, SpeedDial, SpeedDialButton, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
    import Reader from '$lib/components/organisms/Reader.svelte';
    import type { PageData } from './$types';
    import { invalidateAll } from '$app/navigation';
    import InfoBubble from '$lib/components/atoms/InfoBubble.svelte';
    import { superForm } from 'sveltekit-superforms/client';

    export let data: PageData;
    const supabase = data.supabase;

    let searchTerm: string | undefined;
    let filteredItems: any;
    let newTitle: string;
    let selectedItem: any;
    let selectedKey: number;
    let modalOpen: boolean = false;
    let passageOpen: boolean = false;

    const { form, enhance, reset, errors, constraints, message } = superForm(data.form, {
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true,
    });

    async function deletePassage() {
        if(!confirm('完全に削除されます😨 \n本当にやってしまいますか？')) return;
        await supabase.from('passages').delete().match({ id: selectedItem?.id });
        if(data.passagesData)
            data.passagesData = data.passagesData.filter((item) => selectedItem.id !== item.id);
    }

    async function updatePassage() {
        const {data: updatedData, error} = await supabase.from('passages')
                                                         .update({ title: selectedItem.title })
                                                         .eq('id', selectedItem.id).select();
        if(error) {
            alert('エラーが発生しました。');
            console.log(error);
        }
        invalidateAll();
    }

    async function openPassage() {
        modalOpen = false;
        passageOpen = true;
        console.log('SelectedItem: ',selectedItem);
    } 

    function openModal(item: any, key: number) {
        selectedItem = item;
        selectedKey = key;
        modalOpen = true;
    }

    $: filteredItems = data.passagesData?.filter(
        (item: any) => {
            if(!searchTerm) return true;
            return (item?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item?.content?.toLowerCase().includes(searchTerm.toLowerCase()) )
    });

</script>


<div class="mt-12">
{#if !data.passagesData}
    <p>データがありません。</p>
{/if}

<div class="px-5 z-10">
    <Input type="text" bind:value={searchTerm} placeholder="検索 (何語でも👍)" class="max-w-[50ch] mb-6" >
        <i slot="left" class="bi bi-search"></i>
    </Input>
</div>

<InfoBubble message="テーブルにクリック・タップして展開・編集・削除できます。"/>

{#if !passageOpen}
<Table hoverable={true} divClass="relative md:w-5/6 w-full md:mx-auto overflow-x-clip shadow-md sm:rounded-lg pt-4" >
    <TableHead>
        <TableHeadCell>日付</TableHeadCell>
        <TableHeadCell>内容</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each filteredItems as item, key}
            <TableBodyRow on:click={() => openModal(item,key)}>
                <TableBodyCell class="text-xs px-2">{item.created_at}</TableBodyCell>
                <TableBodyCell tdClass="px-3 py-3 font-medium" id={`vocab-${item.id}`}>
                    <div class="max-w-[40ch] md:w-full text-md text-lime-400 py-1">
                        {item.title ?? 'タイトルなし'}
                    </div>
                    {#if item.prompt}
                    <div class="max-w-[40ch] md:max-w-[150ch] italic py-1 text-xs">
                        {item.prompt}
                    </div>
                    {/if}
                </TableBodyCell>
            </TableBodyRow>
            
        {/each}
    </TableBody>
</Table>
<Modal bind:open={modalOpen} autoclose>
    <div class="z-50 mt-3">
        <FloatingLabelInput type="text" label="タイトルを入力" bind:value={selectedItem.title} placeholder="タイトルを変更"/>
        {#if selectedItem.prompt}
        <div class="max-w-[40ch] md:max-w-[150ch] text-ellipsis overflow-hidden italic border rounded-md border-slate-500 my-2 p-1">
            <h3 class="font-bold text-teal-500 text-lg">プロンプト</h3>
            <div class="text-xs">{selectedItem.prompt}</div>
        </div>
        {/if}
        <Button class="mt-3" type="button" pill size="sm" fill color="red" on:click={deletePassage}>🗑️ 削除</Button>
        <Button class="mt-3" type="button" pill size="sm" fill color="green" on:click={updatePassage}>💾 保存</Button>
        <Button class="mt-3" type="button" pill size="sm" fill color="blue" on:click={openPassage}>開く</Button>
    </div>
</Modal>
{:else}
    <Button class="fixed bottom-6 right-6" type="button" pill gradient color="pinkToOrange" on:click={() => { passageOpen = false }}>
        文章を閉じる
    </Button>
    <div class="mt-4 px-2 pb-16 md:px-16">
        <form method="POST" action="?/getPassage" use:enhance>
            <Reader passage={selectedItem} themeColor="blue" pageData={data}/>
        </form>
    </div>
{/if}
</div>
