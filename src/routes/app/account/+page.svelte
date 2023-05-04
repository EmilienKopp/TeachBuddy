<script lang="ts">
    import UnderConstruction from "$lib/components/atoms/UnderConstruction.svelte";
    import UserInfoForm from "$lib/components/organisms/UserInfoForm.svelte";
    import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    import type { PageData } from "./$types";

    export let data: PageData;
    let tabSet: number = 0;

    const supabase = data.supabase;
    let userData = data.session?.user;
    let grades = data.grades;
</script>

<UnderConstruction />

<!-- Edit User Information -->
<!-- Path: src\routes\app\account\+page.svelte -->
<div class="w-full">
    <UserInfoForm bind:userData={userData} {grades}/>
</div>