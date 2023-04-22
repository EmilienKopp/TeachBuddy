<script lang="ts">
    import Input from "../../atoms/Input.svelte";

    export let errorMessage: string = '';
    export let name: string = '';
    export let required: boolean = true;
    export let label: string = '';
    export let placeholder: string = label;
    export let value: string = '';
</script>

<div>
    <Input  type="text" 
            {label}
            {name}
            {required} 
            {placeholder}
            {value} />
    {#if errorMessage}
        <p class="mt-2 text-sm text-red-600">{errorMessage}</p>
    {/if}
</div>