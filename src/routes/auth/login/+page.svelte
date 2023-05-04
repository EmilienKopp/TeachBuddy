<script lang="ts">
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client';
    import { FORMS } from '$lib/config/forms';
    import { Button, Input, Label } from 'flowbite-svelte';

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


<div class="bg-inherit min-h-screen flex flex-col items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <img
            class="mx-auto md:h-40 h-20 w-auto"
            src="../../logo_home.png"
            alt="Your Company"
        />
        <h2 class="mt-6 text-center text-5xl font-bold tracking-tight text-slate-200 font-informal">
            <p class="text-lg font-yippy">Welcome to </p> Page-Turner
        </h2>
    </div>

    <div class="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-darkish py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form class="space-y-4" method="POST" action="?/signin" use:enhance >
                <Label>
                    Email
                    <Input id="email" type="email" name="email" placeholder="Gimme your email!" bind:errorMessage={$errors.email}  bind:value={$form.email}/>
                </Label>
                <Label>
                    Password
                    <Input id="password" type="password" name="password" placeholder="Gimme your password!" bind:errorMessage={$errors.email}  bind:value={$form.email}/>
                </Label>

                <div class="flex items-center justify-between">
                    <div class="text-sm">
                        <a href={FORMS.Links.forgotPassword.href} class="font-medium text-indigo-600 hover:text-indigo-500"> 
                            {FORMS.Links.forgotPassword.label}
                        </a>
                    </div>
                </div>

                <div>
                    <Button type="submit" class="btn variant-filled">
                        {FORMS.Buttons.login.label}
                    </Button>
                    <a href={FORMS.Links.createAccount.href} class="font-medium text-indigo-600 hover:text-indigo-500"> 
                        {FORMS.Links.createAccount.label}
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>