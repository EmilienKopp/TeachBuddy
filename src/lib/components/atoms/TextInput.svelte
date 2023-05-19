<script lang="ts">
    import { Label, Input } from 'flowbite-svelte';

    export let label: string | undefined = undefined;
    export let value: string | number | undefined;
    export let name: string;
    export let id: string | undefined = undefined;
    export let errors: any;
</script>

{#if label}
<Label for="{name}">{label}
    <Input type="text" {name} {id} bind:value={value} />
</Label>
{:else}
<Input type="text" {name} {id} bind:value={value} />
{/if}

{#if errors[name]}
<span class="text-red-500 text-sm">{errors[name]}</span>
{/if}
