<script lang="ts">
    import { Button, FloatingLabelInput, Input, Popover, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
    import type { PageData } from './$types';

    export let data: PageData;
    const supabase = data.supabase;

    let searchTerm: string | undefined;
    let filteredItems: any;
    let newTitle: string;

    async function deletePassage(id: string | number) {
        if(!confirm('完全に削除されます😨 \n本当にやってしまいますか？')) return;
        await supabase.from('passages').delete().match({ id });
        if(data.passagesData)
            data.passagesData = data.passagesData.filter((item) => item.id !== id);
    }

    async function updatePassage(id: string | number, value: string) {
        console.log(id, typeof id, value);
        const {error} = await supabase.from('passages').update({ title: value }).eq('id', id);
        if(error) {
            alert('エラーが発生しました。');
            console.log(error);
        }
    }

    $: filteredItems = data.passagesData?.filter(
        (item: any) => {
            console.log(item);
            if(!searchTerm) return true;
            return (item?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item?.content?.toLowerCase().includes(searchTerm.toLowerCase()) )
    });

</script>

<div class="mt-12">
{#if !data.passagesData}
    <p>データがありません。</p>
{:else}

<div class="px-5">
    <Input type="text" bind:value={searchTerm} placeholder="検索 (何語でも👍)" class="max-w-[50ch] mb-6" >
        <i slot="left" class="bi bi-search"></i>
    </Input>
</div>


<Table striped={true} hoverable={true} divClass="relative overflow-x-auto shadow-md sm:rounded-lg pt-20" >
    <TableHead>
        <TableHeadCell>日付</TableHeadCell>
        <TableHeadCell>内容</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each filteredItems as item, key}
            <TableBodyRow >
                <TableBodyCell class="text-xs px-2">{item.created_at}</TableBodyCell>
                <TableBodyCell class="text-xs px-2" id={`vocab-${item.id}`}>
                    <div class="max-w-[40ch] md:w-full text-ellipsis overflow-hidden text-md text-lime-600">
                        {item.title ?? 'タイトルなし'}
                    </div>
                    {#if item.prompt}
                    <div class="max-w-[40ch] md:max-w-[150ch] text-ellipsis overflow-hidden italic">
                        {item.prompt}
                    </div>
                    {/if}
                    <div class="max-w-[40ch] md:max-w-[150ch] text-ellipsis overflow-hidden">
                        {item.content}
                    </div>
                </TableBodyCell>
            </TableBodyRow>
            <Popover trigger="click" triggeredBy={`#vocab-${item.id}`} arrow={false} class="pt-3">
                <FloatingLabelInput type="text" label="タイトルを入力" bind:value={newTitle} placeholder="タイトルを変更"/>
                {#if item.prompt}
                <div class="max-w-[40ch] md:max-w-[150ch] text-ellipsis overflow-hidden italic border rounded-md border-slate-500 my-2 p-1">
                    <h3>プロンプト</h3>
                    {item.prompt}
                </div>
                {/if}
                <Button class="mt-3" type="button" pill size="xs" fill color="red" on:click={() => deletePassage(item.id)}>🗑️ 削除</Button>
                <Button class="mt-3" type="button" pill size="xs" fill color="green" on:click={() => { updatePassage(item.id, newTitle); item.title = newTitle }}>💾 保存</Button>
            </Popover>
        {/each}
    </TableBody>
</Table>

{/if}

</div>