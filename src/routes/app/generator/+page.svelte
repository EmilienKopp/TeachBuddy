<script lang="ts">
    import type { PageData } from './$types';
    import { removePunctuation, splitWords, extractPunctuationAndPad } from "$lib/helpers/Text";
    import { superForm } from 'sveltekit-superforms/client';
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import Select from "$lib/components/atoms/Select.svelte";
    import { searchWeblio } from '$lib/services/weblio';
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
    import { popup } from '@skeletonlabs/skeleton';
    import type { PopupSettings } from '@skeletonlabs/skeleton';

    export let data: PageData;
    
    let loading: boolean = false;
    let testMode: boolean = false;
    let clickedWord: string = "";

    let popupSettings: PopupSettings = {
        event: 'click',
        target: clickedWord + 'Popup',
        closeQuery: '',
        state: (e) => console.log(e),
    }

    const { form, enhance, reset, errors, constraints } = superForm(data.form, {
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true,
        onUpdated: ({ form }) => { loading = false; console.log('Loading:',loading) },
    });

    let splitPassage: Array<string> = [];

    function handleWordClick(event) {
        hideContextMenu();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        clickedWord = removePunctuation(event.target.textContent);
        const menu = document.getElementById("context-menu");
        if(!menu) return;
        menu.style.display = "block";
        menu.style.left = `${event.clientX + scrollX}px`;
        menu.style.top = `${event.clientY + scrollY}px`;
        event.preventDefault();
    }

    function hideContextMenu() {
        const menu = document.getElementById("context-menu");
        if(!menu) return;
        menu.style.display = "none";
    }

    function handleSave() {
        console.log(`Save: ${clickedWord}`);

        // Vocabulary.createUserVocabulary(clickedWord)
        //           .then(response => console.log(response));

        hideContextMenu();
    }

    async function handleTranslate() {
        console.log(`Translate: ${clickedWord}`);
        // const response = deepL(clickedWord);
        // console.log(await response);
        hideContextMenu();
    }

    function handleSubmit() {
        loading = true;
    }

    $: splitPassage = splitWords($form.message);

</script>

<!-- Path: src\routes\app\generator\+page.svelte -->
<div class="w-full h-full p-16">
    {#if !$form.testMode}
    <SuperDebug data={$form} />
    {/if}
    <form method="POST" use:enhance>
        <SlideToggle name="testMode" bind:checked={$form.testMode}> {$form.testMode ? "Test Mode" : "Dev Mode"} </SlideToggle>
        <Select label="Type" name="type" bind:value={$form.type} data={data.types}/>
        <Select label="Grade" name="type" bind:value={$form.grade} data={data.grades}/>
        <Select label="Topic" name="prompt" bind:value={$form.prompt} data={data.topics}/>

        <button type="submit" class="btn variant-filled m-2" on:click={handleSubmit}>GIVE ME SOME 長文！！</button>
        
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- TODO: do something about a11y -->
        <div class="passage p-8 text-black">
        {#if loading}
            <ProgressRadial />
        {:else}
            {#each splitPassage as word}
                {#if word == '\n'}
                    <br />
                {:else if word == '\t' }
                    &nbsp;&nbsp;&nbsp;&nbsp;
                {:else}
                    <span on:click={handleWordClick}> 
                        {word}
                    </span>
                    &nbsp;
                {/if}
            {/each}
        {/if}
        </div>
    </form>

</div>


<div id="context-menu" class="context-menu card variant-filled-secondary p-4">
    <header class="card-header">
        <h3 class="text-lime-500">{clickedWord} </h3>
    </header>
    <section class="p-4">
        <button on:click={() => handleSave()} class="btn variant-filled-primary">Save</button>
        <button on:click={() => handleTranslate()} class="btn variant-filled-primary">Translate</button>
        <button on:click={() => searchWeblio(clickedWord) } class="btn variant-filled-primary">Search on Weblio</button>
    </section>
    <footer class="card-footer">
        <button on:click={hideContextMenu} class="btn variant-filled-error">Close</button>
    </footer>
</div>



<style>
    .passage {
        cursor: pointer;
        background: white;
        max-height: 50%;
    }

    .passage span,
    .passage button {
        background-color: transparent;
        display: inline-block;
        border-radius: 10px;
        transition: all 0.5s ease-in-out;
    }

    .passage span:hover, 
    .passage button:hover {
        @apply bg-lime-500;
        transition: all 0.5s ease-in-out;
    }

    .context-menu {
        position: absolute;
        display: none;
        background-color: white;
        border: 1px solid #c3c3c3;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .context-menu button {
        @apply block w-full mb-2;
    }

</style>