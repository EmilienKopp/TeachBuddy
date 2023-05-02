<script lang="ts">
    import type { InputConstraint } from "sveltekit-superforms/index";

    export let value: string;
    export let name: string | undefined = undefined;
    export let label: string | undefined = undefined;
    export let constraints: InputConstraint | undefined = undefined;
</script>


<div class="mt-1">
    {#if label != ''}
    <label for={name} class="block text-sm font-medium text-slate-200" >
        {label}
    </label>
    {/if}
    <input {...constraints} {...$$restProps}
        {name}
        bind:value={value}
        class="block w-full px-3 py-2 text-indigo-950 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
</div>