<script lang="ts">
    import NavButton from "$lib/components/atoms/NavButton.svelte";
    import Sidebar from "$lib/components/organisms/Sidebar.svelte";
    import UserInfoForm from "$lib/components/organisms/UserInfoForm.svelte";
    import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    import type { PageData } from "./$types";

    export let data: PageData;
    let tabSet: number = 0;

    const supabase = data.supabase;
    let userData = data.session?.user;
    let grades = data.grades;

    console.log(userData);
</script>

<!-- Edit User Information -->
<!-- Path: src\routes\app\account\+page.svelte -->
<div class="w-full">
    <TabGroup>
        <svelte:fragment slot="panel">
            {#if tabSet === 0}
                <UserInfoForm bind:userData={userData} {grades}/>
            {/if}
        </svelte:fragment>
        <Tab bind:group={tabSet} name="tab1" value={0}>General Information</Tab>
        <Tab bind:group={tabSet} name="tab2" value={1}>Learning Preferences</Tab>
        <Tab bind:group={tabSet} name="tab3" value={2}>Advanced</Tab>
        
    </TabGroup>
</div>