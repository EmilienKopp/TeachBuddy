<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { page } from '$app/stores';

    const dispatch = createEventDispatcher();
    export let href: string = '';
    export let animated = false;
    export let color = '';
    export let hoverColor = '';
    export let label: string | undefined = undefined;

    let menuIconClass = 'menu-icon' + ( color ? '-' + color : '' );

    let active = $page.url.pathname === href;

    function emit() {
        dispatch('click', {});
    }



</script>

<div class="flex flex-col items-center">
    {#if href}
    <a {href} on:click={emit} class="{menuIconClass} {animated ? 'animate-bounce' : ''} mt-4" type="button">
        <slot></slot>
    </a>
    {:else}
    <button on:click={emit} class="{menuIconClass} {animated ? 'animate-bounce' : ''} mt-4">
        <slot></slot>
    </button>
    {/if}
    {#if label}
        <div class="text-xs text-center mt-2">{label}</div>
    {/if}
</div>
