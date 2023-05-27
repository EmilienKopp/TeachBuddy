<script lang="ts">
    import { Badge, Button, FloatingLabelInput, Input, Label, Modal, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
    import type { PageData } from './$types';
    import { invalidateAll } from '$app/navigation';
    import InfoBubble from '$lib/components/atoms/InfoBubble.svelte';
    import { superForm } from 'sveltekit-superforms/client';
    import { goto } from '$app/navigation';
    import LibraryModal from './LibraryModal.svelte';

    export let data: PageData;
    const supabase = data.supabase;

    let searchTerm: string | undefined;
    let filteredItems: any;
    let newTitle: string;
    let selectedItem: any;
    let selectedKey: number;
    let modalOpen: boolean = false;

    

    async function deletePassage() {
        if(!confirm('完全に削除されます😨 \n本当にやってしまいますか？')) return;
        await supabase.from('passages').delete().match({ id: selectedItem?.id });
        if(data.passagesData)
            data.passagesData = data.passagesData.filter((item) => selectedItem.id !== item.id);
        modalOpen = false;
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
        modalOpen = false;
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
                item?.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item?.created_at?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item?.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item?.language?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item?.topic_string?.toLowerCase().includes(searchTerm.toLowerCase())
            );
    });

</script>


<div class="mt-12 flex flex-col justify-center items-center">

{#if !data.passagesData}
    <p>データがありません。</p>
{/if}

<div class="px-5 z-10 w-5/6">
    <Label>
        <span class="font-raleway md:text-3xl">検索</span>
        <Input type="text" bind:value={searchTerm} placeholder="Search"/>
    </Label>
</div>

<Table hoverable={true} divClass="relative xs:w-5/6 w-full xs:mx-auto overflow-x-clip shadow-md sm:rounded-lg pt-4" >
    <TableHead>
        <TableHeadCell class="text-lg px-2 hidden md:block">作成日</TableHeadCell>
        <TableHeadCell class="text-xs md:text-lg px-2">内容<InfoBubble message="テーブルにクリック・タップして展開・編集・削除できます。"/></TableHeadCell>
    </TableHead>
    <TableBody>
        {#each filteredItems as item, key}
            <TableBodyRow on:click={() => openModal(item,key)} class="cursor-pointer">
                <TableBodyCell class="text-md px-2 hidden md:block">{item.created_at}</TableBodyCell>
                <TableBodyCell tdClass="px-3 py-3 font-medium" id={`vocab-${item.id}`}>
                    <div class="max-w-[40ch] md:w-full text-md text-lime-400 py-1">
                        {item.title ?? 'タイトルなし'}
                        <span class="inline xs:hidden text-xs text-gray-400"> ({item.created_at})</span>
                        {#if item.language} <Badge>{item.language}</Badge> {/if}
                    </div>
                    {#if item.prompt}
                    <div class="max-w-[40ch] md:max-w-[150ch] italic py-1 text-xs lg:text-lg">
                        {item.topic_string ?? item.prompt}
                    </div>
                    {/if}
                </TableBodyCell>
            </TableBodyRow>
            
        {/each}
    </TableBody>
</Table>
<LibraryModal {selectedItem} {modalOpen} deleteHandler={deletePassage} updateHandler={updatePassage}/>
</div>
