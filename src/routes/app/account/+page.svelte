<script lang="ts">
    import NavButton from "$lib/components/atoms/NavButton.svelte";
    import Sidebar from "$lib/components/organisms/Sidebar.svelte";
    import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    import type { PageData } from "./$types";

    export let data: PageData;
    let tabSet: number = 0;

    const supabase = data.supabase;

    console.log(data);
</script>

<!-- Edit User Information -->
<!-- Path: src\routes\app\account\+page.svelte -->
<div>

    <TabGroup>
        <Tab bind:group={tabSet} name="tab1" value={0}>General Information</Tab>
        <Tab bind:group={tabSet} name="tab2" value={1}>Learning Preferences</Tab>
        <Tab bind:group={tabSet} name="tab3" value={2}>Advanced</Tab>
    </TabGroup>

</div>