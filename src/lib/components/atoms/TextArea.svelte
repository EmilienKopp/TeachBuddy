<script lang="ts">
    import { Label, Textarea } from 'flowbite-svelte';

    export let label: string | undefined = undefined;
    export let value: string | undefined;
    export let name: string;
    export let id: string | undefined = undefined;
    export let errors: any;
</script>

{#if label}
<Label for="{name}">{label}
    <Textarea type="text" {name} {id} bind:value={value}>
    </Textarea>
</Label>
{:else}
<Textarea type="text" {name} {id} bind:value={value}>
</Textarea>
{/if}

{#if errors[name]}
<span class="text-red-500 text-sm">{errors[name]}</span>
{/if}

