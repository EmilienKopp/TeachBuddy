<script lang="ts">
    import {FORMS} from "$lib/config/forms";
    import Input from "../../atoms/TextInput.svelte";

    export let errorMessage: string | undefined;
    export let name: string;
    export let required: boolean = true;
    export let label: string = FORMS.Inputs.email.label;
    export let placeholder: string = label;
    export let value: string = '';
</script>

<div>
    <Input  type="email" 
            bind:value={value}
            {label}
            {name}
            {required} 
            {placeholder} {...$$restProps}/>
    {#if errorMessage}
        <p class="mt-2 text-sm text-red-600">{errorMessage}</p>
    {/if}
</div>