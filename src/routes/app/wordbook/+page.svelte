<script lang="ts">
    import { searchWeblio } from '$lib/services/weblio';
    import InfoBubble from '$lib/components/atoms/InfoBubble.svelte';
    import type { PageData } from './$types';
    import { Badge, Button,  Input, Label, Modal, Popover, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';

    export let data: PageData;
    let isModalOpen: boolean = false;
    let selectedItem: any;
    let searchTerm: string | undefined;
    let filteredItems: any = data.vocabData;


    const supabase = data.supabase;

    async function deleteUserVocab(id: string | number) {
        if(!confirm('フラッシュカードからも削除されます😅 \n本当にやってしまいますか？')) return;
        await supabase.from('user_vocabulary').delete().match({ id });
        if(data.vocabData)
            data.vocabData = data.vocabData.filter((item) => item.id !== id);
    }

    async function updateUserVocab(id: string | number, value: string) {
        const {error} = await supabase.from('user_vocabulary').update({ custom_translation: value }).eq('id', id);
    }

    async function openModal(item: any) {
        isModalOpen = true;
        selectedItem = item;
    }

    $: filteredItems = data.vocabData?.filter(
        (item) => {
            if(!searchTerm) return true;
            return (item?.vocabulary?.en_word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.vocabulary?.ja_word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.custom_translation?.toLowerCase().includes(searchTerm.toLowerCase()) )
        });

</script>

<div class="mt-10 px-2">
<Badge class="mb-4">単語帳・Wordbook</Badge>
{#if !data.vocabData}
    <p class="p-4">データがありません。</p>
{:else}

<div class="px-5">
    <Input type="text" bind:value={searchTerm} placeholder="検索 (何語でも👍)" class="max-w-[50ch] mb-6" >
        <i slot="left" class="bi bi-search"></i>
    </Input>
</div>

<InfoBubble message="テーブルにクリック・タップして編集・削除できます。"/>
<Table hoverable={true} divClass="relative overflow-x-auto shadow-md sm:rounded-lg pt-2" >
    <TableHead>
        <TableHeadCell><span class="text-xs">English</span></TableHeadCell>
        <TableHeadCell><span class="text-xs">品詞</span></TableHeadCell>
        <TableHeadCell><span class="text-xs">日本語</span></TableHeadCell>
        <!-- <TableHeadCell> <span class="text-xs">my翻訳</span></TableHeadCell> -->
    </TableHead>
    <TableBody>
        {#each filteredItems as item, key}
            <TableBodyRow on:click={() => openModal(item) }>
                <TableBodyCell tdClass="px-3 py-4 whitespace-nowrap font-medium text-xs {`vocab-${item.id}`}">{item?.vocabulary?.word}</TableBodyCell>
                <TableBodyCell tdClass="px-3 py-4 whitespace-nowrap font-medium text-[0.7rem] {`vocab-${item.id}`}">{data?.POS?.find( pos => pos.id == item?.vocabulary?.POS)?.ja_name }</TableBodyCell>
                {#if item?.vocabulary?.ja_word == null}
                    <TableBodyCell class="px-3 py-4 whitespace-nowrap font-medium text-xs {`vocab-${item.id}`}">
                        {item?.custom_translation ?? '-'}
                    </TableBodyCell>
                {:else}
                    <TableBodyCell class="px-3 py-4 whitespace-nowrap font-medium text-xs {`vocab-${item.id}`}">
                        {item?.vocabulary?.ja_word}
                    </TableBodyCell>
                {/if}
                <!-- <TableBodyCell class="text-xs px-1 {`vocab-${item.id}`}">
                    {item.custom_translation ?? '-'}
                </TableBodyCell> -->
            </TableBodyRow>
            <!-- <Popover trigger="click" triggeredBy={`.vocab-${item.id}`} arrow={false} class="pt-3" placement="{key === 0 ? 'bottom' : 'top'}">
                <FloatingLabelInput type="text" label="my翻訳" bind:value={item.custom_translation} size="xs"/>
                <Button class="mt-3" type="button" pill size="xs" fill color="red" on:click={() => deleteUserVocab(item.id)}>🗑️ 削除</Button>
                <Button class="mt-3" type="button" pill size="xs" fill color="green" on:click={() => updateUserVocab(item.id, item.custom_translation) }>💾 保存</Button>
                <button type="button" on:click={() => searchWeblio(word) } class="btn variant-filled-primary">
                    <span class="text-3xl">🔍</span>
                </button>
            </Popover> -->

        {/each}
        <TableBodyRow>

        </TableBodyRow>
    </TableBody>
</Table>

{/if}

</div>

<Modal bind:open={isModalOpen} size="xs" autoclose={true}  class="pt-3">
    <Label> My Translation・my翻訳
        <Input type="text" placeholder="my翻訳" bind:value={selectedItem.custom_translation} />  
    </Label>
    <div class="grid grid-cols-3 gap-2">
        <Button class="mt-3" type="button" pill outline size="xs" fill color="red" on:click={() => deleteUserVocab(selectedItem.id)}>🗑️</Button>
        <Button class="mt-3" type="button" pill outline size="xs" fill color="green" on:click={() => updateUserVocab(selectedItem.id, selectedItem.custom_translation) }>💾</Button>
        <Button class="mt-3" type="button" pill outline size="xs" fill color="green" on:click={() => searchWeblio(selectedItem.vocabulary.word) }>🔍</Button>
    </div>
    
</Modal>