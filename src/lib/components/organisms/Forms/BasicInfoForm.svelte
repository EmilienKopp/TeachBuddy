<script lang="ts">
    import { Helper, Label, Input } from 'flowbite-svelte';
    import { toSelectOptions } from '$lib/helpers/Arrays';
    import { superForm } from 'sveltekit-superforms/client';
    import SaveButton from '$lib/components/atoms/SaveButton.svelte';
    import { _ } from 'svelte-i18n';
    import { C_ } from '$lib/i18n/helpers';

    export let data: any;
    export let grades: any;
    let loading: boolean = false;
    let FORM: HTMLFormElement;

    const { form: infoForm, enhance: infoFormEnhance , errors, tainted, delayed} = superForm(data.infoForm, {
        id: 'infoForm',
        onSubmit: () => { loading = true; },
        onUpdated: () => { loading = false; },
    }); 

    grades = toSelectOptions(grades, 'id', 'name');

</script>


<form method="POST" use:infoFormEnhance action="?/saveBasicInfo" class="h-5/6" bind:this={FORM}>
    <section class="flex flex-col gap-4">
        <Label for="username">{$C_('username')}
            <Input type="text" id="username" name="username" bind:value={$infoForm.username} />
            <Helper color="red">{$errors?.username ?? ''}</Helper>
        </Label>
        <Label for="first_name">{$C_('first_name')}
            <Input type="text" id="first_name" name="first_name" bind:value={$infoForm.first_name} />
            <Helper color="red">{$errors?.first_name ?? ''}</Helper>
        </Label>
        <Label for="last_name">{$C_('last_name')}
            <Input type="text" id="last_name" name="last_name" bind:value={$infoForm.last_name} />
            <Helper color="red">{$errors?.last_name ?? ''}</Helper>
        </Label>
        <Label for="user_number">{$C_('user_number')}
            <Input type="text" id="user_number" name="user_number" bind:value={$infoForm.user_number} />
            <Helper color="red">{$errors?.user_number ?? ''}</Helper>
        </Label>
    </section>

    {#if Object.values($infoForm).some(value => !!value)}
        <SaveButton type="submit" tainted={$tainted} loading={$delayed}/>
    {/if}

</form>




