<script lang="ts">
    import { C_, U_ } from '$lib/i18n/helpers';
    import { _ } from 'svelte-i18n';
    
    export let textcase: "upper" | "lower" | "title" | "unchanged" = "title";

    let span: HTMLSpanElement;
    let text: string;

    $: if(span) text = span.innerText;
    
</script>

{#if !text}
<span bind:this={span}>
    <slot/>
</span>
{/if}

{#if text}
    {#if textcase == "upper"}
        {$U_(text)}
    {:else if textcase == "lower"}
        {$C_(text).toLowerCase()}
    {:else if textcase == "title"}
        {$C_(text)}
    {:else if textcase == "unchanged"}
        {$_(text)}
    {:else}
        {$C_(text)}
    {/if}
{/if}



