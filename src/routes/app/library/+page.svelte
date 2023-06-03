<script lang="ts">
    import { Badge, Button, Card, Checkbox, Chevron, Dropdown, GradientButton, Indicator, Input, Label, Modal, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
    import type { PageData } from './$types';
    import { invalidateAll } from '$app/navigation';
    import InfoBubble from '$lib/components/atoms/InfoBubble.svelte';
    import { superForm } from 'sveltekit-superforms/client';
    import { goto } from '$app/navigation';
    import LibraryModal from './LibraryModal.svelte';
    import { strLimit, strLimitByWords } from '$lib/helpers/Text';

    export let data: PageData;
    const supabase = data.supabase;

    let searchTerm: string | undefined;
    let filteredItems: any = data.passages;
    let newTitle: string;
    let selectedItem: any;
    let selectedKey: number;
    let modalOpen: boolean = false;
    let filterLanguages: string[] = [];
    let filterDate: string | undefined;
    let searchTermCondidtion: boolean, dateCondition: boolean, languageCondition: boolean;
    const tags = data.tags;
    

    async function deletePassage() {
        if(!confirm('完全に削除されます😨 \n本当にやってしまいますか？')) return;
        await supabase.from('passages').delete().match({ id: selectedItem?.id });
        if(data.passages)
            data.passages = data.passages.filter((item: any) => selectedItem.id !== item.id);
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
    } 

    function openModal(item: any, key: number) {
        selectedItem = item;
        selectedKey = key;
        modalOpen = true;
    }

    function resetFilters() {
        filteredItems = data.passages;
        filterDate = searchTerm = undefined;
        filterLanguages = [];
    }

    $: {
        filteredItems = data.passages.filter(
            (item: any) => {
                searchTermCondidtion = searchTerm ? (
                    item?.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                    item?.content?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                    item?.date?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                    item?.prompt?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                    item?.language?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                    item?.topic_string?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                    item?.language?.toLowerCase().includes(searchTerm?.toLowerCase())
                ) : true;
                dateCondition = filterDate ? item?.created_at?.includes(filterDate) : true;
                languageCondition = filterLanguages.length > 0 ? filterLanguages.includes(item.language) : true;

                return (
                    searchTermCondidtion &&
                    dateCondition && 
                    languageCondition
                );
        });
    }

</script>


<div class="mt-12 flex flex-col justify-center items-center">

{#if !data.passages}
    <p>データがありません。</p>
{/if}

<div class="px-5 z-10 w-5/6 grid grid-cols-3 gap-1">
    <Input class="col-span-2" type="text" bind:value={searchTerm} placeholder="Search・検索"/>
    <GradientButton color="pinkToOrange" class="w-full sm:w-auto" on:click={resetFilters}>Reset</GradientButton>
    <Button color="blue" class="mt-2 w-full col-span-2 sm:w-auto text-xs md:text-md"><Chevron>Languages 言語</Chevron></Button>
    <Dropdown>
            {#each data?.languages as lang}
            <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600 ">
                <Checkbox name="studying_languages" class="p-3" bind:group={filterLanguages} value={lang.lang_code}>{lang.name_native}</Checkbox>
            </li>
            {/each}
    </Dropdown>
    <input class="bg-lime-100 rounded-md border border-green-400 mt-2 w-full sm:w-auto" type="month" bind:value={filterDate} />
    <div class="col-span-3 h-8">
        {#each filterLanguages as lang}
        <Indicator color="red" border size="xl">
            <span class="text-white text-xs font-bold">{lang}</span>
        </Indicator>
        {/each}
    </div>
    
</div>
<div class="hidden md:block">
    <Table hoverable={true} divClass="relative xs:w-5/6 w-full xs:mx-auto overflow-x-clip shadow-md sm:rounded-lg pt-4 mb-12" >
        <TableHead>
            <TableHeadCell class="text-lg px-2 hidden md:block">作成日</TableHeadCell>
            <TableHeadCell class="text-xs md:text-lg px-2">情報<InfoBubble message="テーブルにクリック・タップして展開・編集・削除できます。"/></TableHeadCell>
            <TableHeadCell class="text-xs md:text-lg px-2">概要<InfoBubble message="テーブルにクリック・タップして展開・編集・削除できます。"/></TableHeadCell>
        </TableHead>
        <TableBody>
            {#each filteredItems as item, key}
                <TableBodyRow on:click={() => openModal(item,key)} class="cursor-pointer">
                    <TableBodyCell class="text-md px-2 hidden md:block">{item.date}</TableBodyCell>
                    <TableBodyCell tdClass="px-3 py-3 font-medium" id={`vocab-${item.id}`}>
                        <div class="max-w-[40ch] md:w-full text-md text-lime-600 py-1 flex flex-col gap-1">
                            <div>
                                <Indicator color="red" border size="xl">
                                    <span class="text-white text-xs font-bold">{item.language ?? '?'}</span>
                                </Indicator>
                                {item.title ?? 'No Title'}
                            </div>
                            <div>
                                {#if item.topic_string} <Badge color="yellow">{item.topic_string} </Badge> {/if}
                            </div>
                            <div>
                                {#if item.tags} 
                                    {#each item.tags as tag}
                                        <Badge color="blue" class="text-[0.] m-1"> #{tag.label} </Badge> 
                                    {/each}
                                {/if}
                            </div>
                        </div>
                        <span class="inline xs:hidden text-xs text-gray-400"> ({item.date})</span>
                    </TableBodyCell>
                    <TableBodyCell tdClass="px-3 py-3 font-medium" id={`vocab-${item.id}`}>
                        {#if item.content}
                        <div class="max-w-[40ch] md:max-w-[150ch] italic py-1 text-xs lg:text-lg">
                            { ['zh','ja'].includes(item.language) ? strLimit(item.content,50,'...') : strLimitByWords(item.content, 30, '...')}
                        </div>
                        {/if}
                    </TableBodyCell>
                </TableBodyRow>
                
            {/each}
        </TableBody>
    </Table>
</div>


<div class="md:hidden mt-2 grid grid-cols-2 gap-2 mx-2">
    {#each filteredItems as item, key}
        <Card on:click={() => openModal(item,key)} class="cursor-pointer">
            
            <div id={`vocab-${item.id}`}>
                <div class="grid grid-cols-5 py-1 text-xs text-lime-400">
                    <div class="col-span-4"> 
                        {item.title ?? 'No Title'}
                    </div>
                    <Indicator color="red" border size="xl">
                        <span class="text-white text-xs font-bold">{item.language ?? '?'}</span>
                    </Indicator>
                </div>
                <div class="flex flex-col text-lime-400 text-xs">
                    <span class="inline xs:hidden text-xs text-gray-400"> ({item.date})</span>
                </div>
                {#if item.content}
                <div class="max-w-[40ch] md:max-w-[150ch] italic py-1 text-xs lg:text-lg">
                    { ['zh','ja'].includes(item.language) ? strLimit(item.content,20,'...') : strLimitByWords(item.content, 6, '...')}
                </div>
                {/if}
                {#if item.topic_string} 
                    <Badge color="yellow" class="text-xs"> {item.topic_string} </Badge> 
                {/if}
                <br/>
                {#if item.tags} 
                    {#each item.tags as tag}
                        <Badge color="blue" class="text-[0.] m-1"> #{tag.label} </Badge> 
                    {/each}
                {/if}
            </div>
            
        </Card>
        
    {/each}
</div>

<LibraryModal {selectedItem} {tags} bind:modalOpen={modalOpen} deleteHandler={deletePassage} updateHandler={updatePassage} {data}/>
</div>
