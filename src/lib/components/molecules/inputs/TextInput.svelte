<script lang="ts">
    import type { InputConstraint } from "sveltekit-superforms/index";
    import Input from "../../atoms/Input.svelte";

    export let value: string | undefined;
    export let label: string | undefined = undefined;
    export let errors: string[] | undefined = undefined;
    export let constraints: InputConstraint | undefined = undefined;
</script>

<div>
    <Input  type="text" 
            {...constraints}
            {...$$restProps}
            {label}
            bind:value={value} />
    {#if errors}
        <p class="mt-2 text-sm text-red-600">{errors}</p>
    {/if}
</div>