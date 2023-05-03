<script lang="ts">
    import NavButton from '$lib/components/atoms/NavButton.svelte';
    import { Scaffolder } from '/src/config/scaffolder';
    import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    let subMenus = Scaffolder.OptionsNav;

    let tabSet: number = 0;
</script>

<TabGroup>
    <Tab bind:group={tabSet} name="tab1" value={0}>Vocab List Setting</Tab>
    <Tab bind:group={tabSet} name="tab2" value={1}>Reading Settings</Tab>
    <Tab bind:group={tabSet} name="tab3" value={2}>Advanced</Tab>
</TabGroup>

<div>
    <slot></slot>
</div>