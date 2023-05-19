<script lang="ts">
    import {FORMS} from "$lib/config/forms";
    import Input from "../../atoms/TextInput.svelte";

    export let errors: string;
    export let name: string;
    export let label: string = FORMS.File.label;
    export let value: string = '';

    export let handleChange = () => {};
</script>

<div>
    <label for={name} class="label">{label}</label>
    <input type="file" class="input" bind:value={value} {...$$restProps} {name} on:change={handleChange}/>
    {#if errors}
        <p class="mt-2 text-sm text-red-600">{errors}</p>
    {/if}
</div>