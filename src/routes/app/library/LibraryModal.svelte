<script lang="ts">
    import { Badge, Button, FloatingLabelInput, Input, Modal, Popover} from 'flowbite-svelte';
    import { goto } from '$app/navigation';
    import { strLimitByWords, strLimit } from '$lib/helpers/Text';
    import TextInput from '$lib/components/atoms/TextInput.svelte';
    import type { PageData } from '../../$types';
    import { C_ } from '$lib/i18n/helpers';

    export let modalOpen: boolean = false;
    export let selectedItem: any;
    export let deleteHandler: ((e: MouseEvent) => void) | null | undefined;
    export let updateHandler: ((e: MouseEvent) => void) | null | undefined;
    export let tags: any;
    export let data: PageData;

    let filteredTags: any = tags;
    let newTagLabel: string;

    async function handleTagging(event: any) {
        if(event.key == 'Enter' || event.key == 'Tab' || event.key == ' ') {
            event.preventDefault();
            const newTag = {
                taggable_id: selectedItem.id,
                taggable_type: 'passages',
                label: newTagLabel,
                tagger_id: data.session?.user.id,
            };
            if(selectedItem && selectedItem.tags.length > 0) {
                selectedItem.tags = [...selectedItem?.tags, newTag];
            } else {
                selectedItem.tags = [newTag];
            }
            
            newTagLabel = '';
            if(!tags.some((tag: any) => tag.label == newTag.label) && newTag.label != '')
                await data.supabase.from('tags').insert(newTag);
        }
    }

    async function handleUntagging(event: any, index: number) {
        if (!selectedItem.tags[index].toggled) {
            selectedItem.tags[index].toggled = true;
            return;
        }
        const {error} = await data.supabase.from('tags').delete()
                              .eq('label', selectedItem.tags[index].label)
                              .eq('taggable_id', selectedItem.id)
                              .eq('tagger_id', data.session?.user.id);
        selectedItem.tags = selectedItem.tags.toSpliced(index, 1);
    }

</script>

<Modal bind:open={modalOpen} autoclose>
    <div class="z-50 mt-3">
        <FloatingLabelInput type="text" label="タイトルを入力" bind:value={selectedItem.title} placeholder="タイトルを変更"/>
        <div class="max-w-[40ch] md:max-w-[150ch] text-ellipsis overflow-hidden italic border rounded-md border-slate-500 my-2 p-1">
            <h3 class="font-bold text-teal-500 text-lg">Preview</h3>
            <div class="text-xs">{['zh','ja'].includes(selectedItem.language) ? strLimit(selectedItem.content,50,'...') : strLimitByWords(selectedItem.content, 30, '...')}</div>
        </div>
        <div class="w-full grid grid-cols-3 gap-1">
            <Button class="mt-3" type="button" pill outline size="sm" color="red" on:click={deleteHandler}>🗑️ {$C_('delete')} </Button>
            <Button class="mt-3" type="button" pill outline size="sm" color="green" on:click={updateHandler}>💾 {$C_('save')}</Button>
            <Button class="mt-3" type="button" pill outline size="sm" color="blue" on:click={()=> { goto('/app/library/' + selectedItem.id) }}> 👁️ {$C_('read')} </Button>
        </div>
        <div class="max-w-[40ch] md:max-w-[150ch] text-ellipsis overflow-hidden italic  my-2 p-1">
            <h3 class="font-bold text-teal-500 text-lg">#TAGS</h3>

            {#if selectedItem?.tags?.length > 0}
                {#each selectedItem.tags as tag,key}
                <a type="button" class="inline-block m-1 p-1 text-xs border rounded-lg bg-{tag.toggled ? 'red' : 'blue'}-400 text-white" id="tag-{key}" 
                    on:click={(e) => handleUntagging(e,key) } on:keydown={(e) => {e.preventDefault(); tag.toggled = true} }>
                    {#if !tag.toggled}
                       #️⃣{tag.label}
                    {:else}
                        ❌{tag.label}
                    {/if}
                </a>
                {/each}
            {/if}
            <div class="border rounded-md border-slate-500 text-xs my-2 p-2" id="tags" contenteditable="true" on:keydown={handleTagging} bind:innerText={newTagLabel}>
            


            <!-- <Badge color="green" id="newtag" class="m-1"># new tag</Badge>
            <Popover triggeredBy="#newtag" placement="bottom" arrow={false}>
                <div class="taginput w-24 h-5 my-1 text-xs rounded border border-slate-300" contenteditable="true" placeholder="#"
                    bind:innerText={newTagLabel} on:keydown={handleTagging}>
                </div>
                {#each tags.filter( (tag) => !selectedItem.tags.map(t=>t.label).includes(tag.label) ) as tag} 
                    <Badge color="blue" class="m-1">#{tag.label}</Badge>
                {/each}
            </Popover> -->


            </div>
        </div>
    </div>
</Modal>

<style>
    .taginput::before {
        content: attr(placeholder);
    }

    #tags::before {
        content: '#'
    }
</style>