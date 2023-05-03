<script lang="ts">
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client';
    import { FORMS } from '$lib/config/forms';
    import EmailInput from '$lib/components/molecules/inputs/EmailInput.svelte';
    import PasswordInput from '$lib/components/molecules/inputs/PasswordInput.svelte';
    import Button from '$lib/components/atoms/Button.svelte';

    export let data: PageData;

    const { form, enhance, errors } = superForm(data.form, {
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true,
    });


    $: {
        console.error($errors);
    }
</script>


<div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <img
            class="mx-auto h-40 w-auto"
            src="../../logo_home.png"
            alt="Your Company"
        />
        <h2
            class="mt-6 text-center text-3xl font-bold tracking-tight text-slate-200"
        >
            Welcome =)
        </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-darkish py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form class="space-y-6" method="POST" action="?/signin" use:enhance >
                <EmailInput  name="email" placeholder="Your email" bind:errorMessage={$errors.email}  bind:value={$form.email}/>

                <!-- パスワード -->
                <PasswordInput name="password" placeholder="Your deepest darkest secret" bind:errorMessage={$errors.password} bind:value={$form.password}/>

                <div class="flex items-center justify-between">
                        <div class="text-sm">
                            <a
                                href={FORMS.Links.forgotPassword.href}
                                class="font-medium text-indigo-600 hover:text-indigo-500"
                                > {FORMS.Links.forgotPassword.label}</a
                            >
                            
                        </div>
                </div>

                <div>
                    <Button type="submit" class="btn variant-filled">
                        {FORMS.Buttons.login.label}
                    </Button>
                    <a
                                href={FORMS.Links.createAccount.href}
                                class="font-medium text-indigo-600 hover:text-indigo-500"
                                > {FORMS.Links.createAccount.label}</a
                            >
                </div>
            </form>
        </div>
    </div>
</div>
