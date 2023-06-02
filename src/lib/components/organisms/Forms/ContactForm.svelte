<script lang="ts">
    import { Button, Checkbox, Chevron, Dropdown, Label, Select, Textarea } from 'flowbite-svelte';
    import TextInput from '$lib/components/atoms/TextInput.svelte';
    import TextArea from '$lib/components/atoms/TextArea.svelte';
    import type { SelectOptionType } from '$lib/helpers/Arrays';
    import SaveButton from '$lib/components/atoms/SaveButton.svelte';
    import { superForm } from 'sveltekit-superforms/client';

    export let data: any;

    const { form: form, enhance, tainted, errors } = superForm(data.langForm, {
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true
    });

    let message: string = '';

</script>

<section class="mt-12 mx-auto w-2/3 min-w-90">
    <p class="text-sm md:text-md mb-8">
        🤖🗯️ Hey there! 
        管理者のエミリアンです！ 
        何か言いたいことがあれば、何でも良いのでこちらに書いてください！
        お早目に返信します 😉
    </p>

<form class="flex flex-col gap-3 pb-12" method="POST" use:enhance>
    <TextInput name="title" label="Title" errors={$errors} bind:value={$form.title}/>
    <TextArea name="content" label="Message" errors={$errors} bind:value={$form.content}/>
    
    <SaveButton type="submit" />
</form>


</section>

