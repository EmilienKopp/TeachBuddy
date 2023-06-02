<script lang="ts">
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client';
    import { FORMS } from '/src/config/forms';
    import { Button, ButtonGroup, GradientButton, Helper, Input, InputAddon, Label, Spinner } from 'flowbite-svelte';
    import Underlay from '$lib/components/atoms/Underlay.svelte';

    export let data: PageData;
    let showPassword: boolean = false;
    let loading: boolean = false;
    let formElement: HTMLFormElement;

    const { form, enhance, errors, constraints } = superForm(data.form, {
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true,
        taintedMessage: null,
    });

    // Session
    const session = data.session;

    function handleSubmit(e: any) {
        e.preventDefault();
        loading = true;
        formElement.submit();
    }
</script>


<div class="min-h-screen flex flex-col items-center justify-center py-4 px-3 sm:px-4 lg:px-5 mx-auto container">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-4xl md:text-6xl dark:text-slate-200 font-pixel">
            <p class="text-2xl md:text-3xl">Welcome to </p> Page Turner
        </h2>
    </div>

    {#if !loading}
    <div class="mt-4 sm:mx-auto sm:w-full sm:max-w-md font-pixel">
        <div class="py-8 px-4 rounded sm:rounded-lg sm:px-10">
            <form class="space-y-4" method="POST" action="?/signin" use:enhance bind:this={formElement}>
                <Label class="font-bold md:text-xl">
                    Email
                    <Input id="email" type="email" name="email" placeholder="Gimme your email!" bind:errorMessage={$errors.email}  bind:value={$form.email} {...$constraints.email}/>
                </Label>
                 <!-- パスワード -->
                 <Label for="show-password" class="font-bold md:text-xl">Password
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
                                name="password" placeholder="Your password here" {...$constraints.password} class="font-{showPassword? 'pixel' : 'raleway'} tracking-wide"/>
                    </ButtonGroup>
                    
                        {#if $errors.password || $errors.email}
                            <Underlay extraClasses="mt-2 pb-3 tracking-wide">
                                {#each Object.entries($errors) as [field,message]}
                                    <Helper color="red">{message == 'Invalid login credentials' ? message + ' ログイン情報が正しくありません' : message}</Helper>
                                {/each}
                            </Underlay>
                        {/if}
                    </Label>
                    <GradientButton type="submit" shadow color="lime" size="xl" class="w-full text-xl md:text-4xl pb-4 md:mt-2" on:click={handleSubmit} disabled={loading}>
                            
                            {#if loading}
                                <Spinner size="5" />
                            {:else}
                                {FORMS.Buttons.login.label}
                            {/if}
                    </GradientButton>
                    <div class="flex flex-col text-sm md:text-md text-left h-20">
                        <ul class="mb-2  py-3 h-full ">
                            <li class="mb-2 h-1/2">
                                <a href={FORMS.Links.forgotPassword.href} class="ml-1 font-medium md:text-xl text-white dark:text-indigo-600 hover:text-lime-400 focus:text-lime-400  md:hover:text-2xl"> 
                                    {FORMS.Links.forgotPassword.label}
                                </a>
                            </li>
                            <li class="mb-2 h-1/2">
                                <a href={FORMS.Links.createAccount.href} class="ml-1 font-medium md:text-xl text-white dark:text-indigo-600 hover:text-lime-400 focus:text-lime-400 md:hover:text-2xl"> 
                                    {FORMS.Links.createAccount.label}
                                </a>
                            </li>
                        </ul>
                    </div>
            </form>
        </div>
    </div>
    {:else}
    <div class="flex justify-center items-center h-screen">
        <Spinner size="10" />
    </div>
    {/if}
</div>

<style lang="postcss">
    :global(body) {
        background-image: url('/backgrounds/bg-arcade-blank.png');
        background-repeat: repeat-x;
        background-size: cover;
    }

    li {
        @apply bg-slate-500 bg-opacity-50 rounded md:bg-transparent;
    }
    
    li a:hover::after,
    li a:focus::after {
        content: "👈";
    }
</style>