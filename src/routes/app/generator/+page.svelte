<script lang="ts">
    import type { PageData } from './$types';
    import { removePunctuation, splitWords, extractPunctuationAndPad } from "$lib/helpers/Text";
    import { superForm } from 'sveltekit-superforms/client';
    import Spinner from '$lib/components/atoms/Spinner.svelte';
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
    import Input from "$lib/components/atoms/Input.svelte";
	import TextInput from "$lib/components/molecules/inputs/TextInput.svelte";
    import { boolean } from 'zod';

    export let data: PageData;
    
    let loading = false;
    let clickedWord = "";

    const { form, enhance, reset } = superForm(data.form, {
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true,
        onUpdated: ({ form }) => { loading = false; console.log(loading) },
    });

    let splitPassage: Array<string> = [];

    function handleWordClick(event) {
        hideContextMenu();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        clickedWord = removePunctuation(event.target.textContent);
        const menu = document.getElementById("context-menu");
        menu.style.display = "block";
        menu.style.left = `${event.clientX + scrollX}px`;
        menu.style.top = `${event.clientY + scrollY}px`;
        event.preventDefault();
    }

    function hideContextMenu() {
        const menu = document.getElementById("context-menu");
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

    function handleSubmit(event) {
        loading = true;
    }

    $: splitPassage = splitWords($form.message);

</script>

<!-- Path: src\routes\app\generator\+page.svelte -->
<div class="w-full h-full p-16">

    <form method="POST" use:enhance>
        <label for="grade" class="text-slate-300"> Grade: </label>
        <select name="grade" bind:value={$form.grade}>
            {#each data.grades as item }
                <option value="{item.id}">{item.name}</option>
            {/each}
        </select>
        <label for="type" class="text-slate-300"> Type: </label>
        <select name="type" bind:value={$form.type}>
            {#each data.types as item }
                <option value="{item.id}">{item.name}</option>
            {/each}
        </select>

        <label class="block text-sm font-medium text-slate-300" for="prompt"> Prompt </label>
        <input  type="text" name="prompt" bind:value={$form.prompt} 
                class="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>

        <button type="submit" class="p-3 rounded-md bg-slate-400 text-black m-3" on:click={handleSubmit}>GIVE ME SOME 長文！！</button>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- TODO: do something about a11y -->
        <div class="passage p-8 w-full h-full" on:click={hideContextMenu}>
        {#if loading}
            <Spinner />
        {:else}
            {#each splitPassage as word}
                {#if word == '\n'}
                    <br />
                {:else if word == '\t' }
                    &nbsp;&nbsp;&nbsp;&nbsp;
                {:else}
                    <span on:click|stopPropagation={handleWordClick} > 
                        {word}
                    </span>
                    &nbsp;
                {/if}
            {/each}
        {/if}
        </div>
    </form>

</div>

<div id="context-menu" class="context-menu">
    <h3 class="p-3 bg-slate-300 text-center font-bold">{clickedWord}</h3>
    <button on:click={() => handleSave()}>Save</button>
    <button on:click={() => handleTranslate()}>Translate</button>
</div>

<style>
    .passage {
        cursor: pointer;
        background: white;
        height: 50%;
        width: 75%;
    }

    .passage span {
        background-color: white;
        display: inline-block;
        border-radius: 10px;
        transition: all 0.5s ease-in-out;
    }

    .passage span:hover {
        background-color: yellow;
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
        display: block;
        width: 100%;
        padding: 8px 16px;
        background: none;
        border: none;
        text-align: left;
    }
    .context-menu button:hover {
        background-color: #f1f1f1;
    }
</style>