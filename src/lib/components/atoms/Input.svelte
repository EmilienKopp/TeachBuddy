<script lang="ts">
    import type { InputConstraint } from "sveltekit-superforms/index";

    export let value: string;
    export let name: string | undefined = undefined;
    export let label: string | undefined = undefined;
    export let constraints: InputConstraint | undefined = undefined;
</script>


<div class="mt-1">
    {#if label != ''}
    <label for={name} >
        {label}
    </label>
    {/if}
    <input {...constraints} {...$$restProps}
        {name}
        bind:value={value}
        class="input"
    />
</div>