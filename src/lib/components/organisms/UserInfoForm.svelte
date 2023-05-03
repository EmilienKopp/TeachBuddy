<script lang="ts">
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client';
    import { FORMS } from '$lib/config/forms';
    import { Button, Spinner, TabItem, Tabs, Label, Input } from 'flowbite-svelte';
    import { toSelectOptions } from '$lib/helpers/Arrays';

    export let userData: any;
    export let grades: any;

    grades = toSelectOptions(grades, 'id', 'name');
    console.log(grades);
</script>



<Tabs style="underline" class="mt-8">

    <TabItem open title="基本設定">
        <form>
            <div>
                <Label for="username">Username</Label>
                <Input type="text" id="username" name="username" bind:value={userData.user_metadata.username} />
            </div>
        </form>
    </TabItem>


</Tabs>



