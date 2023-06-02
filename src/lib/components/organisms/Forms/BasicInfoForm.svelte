<script lang="ts">
    import { Button, Helper, Spinner, TabItem, Tabs, Label, Input } from 'flowbite-svelte';
    import { toSelectOptions } from '$lib/helpers/Arrays';
    import { superForm } from 'sveltekit-superforms/client';
    import SaveButton from '$lib/components/atoms/SaveButton.svelte';

    export let data: any;
    export let grades: any;

    const { form: infoForm, enhance: infoFormEnhance , errors, tainted} = superForm(data.infoForm, {
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true
    }); 

    grades = toSelectOptions(grades, 'id', 'name');

</script>


<form method="POST" use:infoFormEnhance action="?/saveBasicInfo" class="h-5/6">
    <section class="flex flex-col gap-4">
        <Label for="username">Username
            <Input type="text" id="username" name="username" bind:value={$infoForm.username} />
            <Helper color="red">{$errors?.username ?? ''}</Helper>
        </Label>
        <Label for="first_name">First Name
            <Input type="text" id="first_name" name="first_name" bind:value={$infoForm.first_name} />
            <Helper color="red">{$errors?.first_name ?? ''}</Helper>
        </Label>
        <Label for="last_name">Last Name
            <Input type="text" id="last_name" name="last_name" bind:value={$infoForm.last_name} />
            <Helper color="red">{$errors?.last_name ?? ''}</Helper>
        </Label>
        <Label for="user_number">User Number / Student Number
            <Input type="text" id="user_number" name="user_number" bind:value={$infoForm.user_number} />
            <Helper color="red">{$errors?.user_number ?? ''}</Helper>
        </Label>
    </section>

    {#if Object.values($infoForm).some(value => !!value)}
        <SaveButton type="submit" tainted={$tainted} />
    {/if}

</form>




