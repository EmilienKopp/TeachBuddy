<script lang="ts">
    import UnderConstruction from '$lib/components/atoms/UnderConstruction.svelte';
    import { searchWeblio } from '$lib/services/weblio';
    import InfoBubble from '$lib/components/atoms/InfoBubble.svelte';
    import type { PageData } from './$types';
    import { Badge, Button, FloatingLabelInput, Input, Popover, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';

    export let data: PageData;
    let searchTerm: string | undefined;

    const supabase = data.supabase;

    async function deleteUserVocab(id: string | number) {
        if(!confirm('フラッシュカードからも削除されます😅 \n本当にやってしまいますか？')) return;
        await supabase.from('user_vocabulary').delete().match({ id });
        if(data.vocabData)
            data.vocabData = data.vocabData.filter((item) => item.id !== id);
    }

    async function updateUserVocab(id: string | number, value: string) {
        console.log(id, typeof id, value);
        const {error} = await supabase.from('user_vocabulary').update({ custom_translation: value }).eq('id', id);
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
        <TableHeadCell> <span class="text-xs">my翻訳</span></TableHeadCell>
    </TableHead>
    <TableBody>
        {#each filteredItems as item, key}
            <TableBodyRow>
                <TableBodyCell class="text-xs px-1 {`vocab-${item.id}`}">{item?.vocabulary?.word}</TableBodyCell>
                <TableBodyCell class="text-[0.7rem] px-1 {`vocab-${item.id}`}">{data.POS.find( pos => pos.id == item?.vocabulary?.POS).ja_name }</TableBodyCell>
                <TableBodyCell class="text-xs px-1 {`vocab-${item.id}`}">{item?.vocabulary?.ja_word ?? '-'}</TableBodyCell>
                <TableBodyCell class="text-xs px-1 {`vocab-${item.id}`}">
                    {item.custom_translation ?? '-'}
                </TableBodyCell>
            </TableBodyRow>
            <Popover trigger="click" triggeredBy={`.vocab-${item.id}`} arrow={false} class="pt-3" placement="{key === 0 ? 'bottom' : 'top'}">
                <FloatingLabelInput type="text" label="my翻訳" bind:value={item.custom_translation} size="xs"/>
                <Button class="mt-3" type="button" pill size="xs" fill color="red" on:click={() => deleteUserVocab(item.id)}>🗑️ 削除</Button>
                <Button class="mt-3" type="button" pill size="xs" fill color="green" on:click={() => updateUserVocab(item.id, item.custom_translation) }>💾 保存</Button>
                <button type="button" on:click={() => searchWeblio(word) } class="btn variant-filled-primary">
                    <span class="text-3xl">🔍</span>
                </button>
            </Popover>

        {/each}
        <TableBodyRow>

        </TableBodyRow>
    </TableBody>
</Table>

{/if}

</div>