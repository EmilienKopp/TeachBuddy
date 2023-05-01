<script lang="ts">
    import NavButton from '$lib/components/atoms/NavButton.svelte';
    import { Scaffolder } from '/src/config/scaffolder';

    let subMenus = Scaffolder.OptionsNav;
</script>

<nav id="options-header" class="flex flex-row">
    {#each subMenus as menu}
        <NavButton  />
    {/each}
</nav>

<div>
    <slot></slot>
</div>