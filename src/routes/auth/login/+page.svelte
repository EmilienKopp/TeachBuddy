<script lang="ts">
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client';
    import { FORMS } from '$lib/config/forms';
    import { Button, ButtonGroup, Helper, Input, InputAddon, Label } from 'flowbite-svelte';

    export let data: PageData;
    let showPassword: boolean = false;

    const { form, enhance, errors, constraints } = superForm(data.form, {
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true,
    });

    // Session
    const session = data.session;
    console.log(session)


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
                    <Input id="email" type="email" name="email" placeholder="Gimme your email!" bind:errorMessage={$errors.email}  bind:value={$form.email} {...$constraints.email}/>
                </Label>
                 <!-- パスワード -->
                 <Label for="show-password">パスワード
                    <ButtonGroup class="w-full mt-0">
                        <InputAddon>
                        <button type="button" on:click={() => (showPassword = !showPassword)} tabindex="-1">
                            {#if showPassword}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {:else}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                            {/if}
                        </button>
                        </InputAddon>
                        <Input  id="show-password" bind:value={$form.password} type={showPassword ? 'text' : 'password'} 
                                name="password" placeholder="Your password here" {...$constraints.password}/>
                    </ButtonGroup>
                        {#if $errors.password}<Helper class="mt-2" color="red">{$errors.password}</Helper>{/if}
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