<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    export let href: string = '';
    export let animated = false;
    export let color = '';
    export let hoverColor = '';

    let menuIconClass = 'menu-icon' + ( color ? '-' + color : '' );

    function emit() {
        dispatch('click', {});
    }

</script>

{#if href}
<a {href} on:click={emit} class="{menuIconClass} {animated ? 'animate-bounce' : ''}" type="button">
    <slot></slot>
</a>
{:else}
<button on:click={emit} class="{menuIconClass} {animated ? 'animate-bounce' : ''}">
    <slot></slot>
</button>
{/if}