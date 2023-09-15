<script lang="ts">
    import { superForm } from "sveltekit-superforms/client";
    import type { PageData } from "./$types";
    import {  ButtonGroup, GradientButton, Helper, InputAddon, Input, Label, Select, Spinner, Button, Dropdown, Checkbox, Chevron} from "flowbite-svelte";
    import {FORMS} from "/src/config/forms";
    import { registerSchema } from "/src/config/schemas";
    import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
    import { ProgressRadial } from "@skeletonlabs/skeleton";
    import { C_ } from "$lib/i18n/helpers";
    import Underlay from "$lib/components/atoms/Underlay.svelte";

    export let data: PageData;

    let loading: boolean = false;
    let showPassword: boolean = false;
    let emailError: any, passwordError: any, passwordConfirmError: any;

    const supabase = data.supabase;

    const { form, enhance, reset, errors, constraints, validate, delayed, timeout } = superForm(data.form, {
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true,
        validators: registerSchema,
        validationMethod: 'oninput',
        defaultValidator: 'keep',
        delayMs: 800,
        timeoutMs: 4000,
        onUpdated: ({ form }) => { loading = false; console.log('Loading:',loading) },
    });

    console.log($errors.studying_languages);
</script>
<div class="bg-inherit min-h-screen flex flex-col items-center justify-center font-pixel pt-4 pb-20 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="md:mt-6 text-center text-2xl font-bold tracking-tight text-slate-">
            Join the crew!
        </h2>
    </div>

    <div class="mt-3 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="py-4 px-4 sm:px-10">
            <form class="space-y-3 grid grid-cols-1" method="POST" use:enhance>
                    <!-- <SuperDebug data={$form} /> -->
                    <!-- ユーザー名 -->
                    <Label>
                    Username・ユーザ名
                    <Input type="text" name="username" placeholder="Your username" bind:value={$form.username} {...$constraints.username} size="sm">
                        <span slot="left">👋</span>
                    </Input>
                    {#if $errors.username}
                    <Underlay extraClasses="mt-2 pb-3 tracking-wide">
                        <Helper color="red">{$errors.username}</Helper>
                    </Underlay>
                    {/if}
                    </Label>                   

                    <!-- メールアドレス -->
                    <Label>
                        Email・メールアドレス
                        <Input type="email" name="email" placeholder="Your email" bind:value={$form.email} bind:errorMessage={emailError} {...$constraints.email}>
                            <span slot="left">📨</span>
                        </Input>
                        {#if $errors.email}
                        <Underlay extraClasses="mt-2 pb-3 tracking-wide">
                            <Helper color="red">{$errors.email}</Helper>
                        </Underlay>
                        {/if}
                    </Label>

                    <!-- パスワード -->
                    <Label for="show-password1">Password・パスワード
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
                        <Input id="show-password1" class="font-mono" bind:value={$form.password} type={showPassword ? 'text' : 'password'} name="password" placeholder="Your password here" {...$constraints.password}/>
                    </ButtonGroup>
                        {#if $errors.password}
                        <Underlay extraClasses="mt-2 pb-3 tracking-wide">
                            <Helper color="red">{$errors.password}</Helper>
                        </Underlay>
                        {/if}
                    </Label>

                    <Label>
                        <span class="italic">Native language・母国語</span>
                        <Select class="mt-2" name="native_language" items={data.languages} bind:value={$form.native_language}/>
                        {#if $errors.native_language}
                        <Underlay extraClasses="mt-2 pb-3 tracking-wide">
                            <Helper color="red">{$errors.native_language}</Helper>
                        </Underlay>
                        {/if}
                    </Label>

                    <Label>
                        <p class="font-semibold italic mb-2">Languages you're studying ・ 勉強中の言葉:</p>
                        <Button color="alternative" class="w-full"><Chevron>{$C_('now_studying')}</Chevron></Button>
                        <Dropdown class="overflow-y-auto px-3 pb-3 text-sm h-44">
                            {#each data?.selectableLanguages as lang, key}
                            <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                                <Checkbox name="studying_languages" class="p-3" bind:group={$form.studying_languages} value={lang.value}
                                    checked={$form.studying_languages.includes(lang.value)}
                                    {...$constraints.studying_languages}>{lang.name}</Checkbox>
                            </li>
                            {/each}
                        </Dropdown>
                        {#if $errors.studying_languages && Object.values($errors.studying_languages).some( e => e != undefined) }
                        <Underlay extraClasses="mt-2 pb-3 tracking-wide">
                            <Helper color="red">{$errors.studying_languages[0]}</Helper>
                        </Underlay>  
                        {/if}
                    </Label>

                    <div class="mt-4 text-center">
                        <GradientButton type="submit" shadow color="lime" size="xl" class="md:text-xl w-full" on:click={ () => { loading = true }}>
                            {FORMS.Buttons.register.label}
                            {#if loading}
                            <Spinner class="ml-2" size="3" color="white"/>
                            {/if}
                        </GradientButton>
                        <GradientButton outline href="/auth/login" class="font-medium mt-2 text-sm md:text-md text-white dark:text-indigo-600 hover:text-lime-400 focus:text-lime-400 md:hover:text-2xl"> 
                            Back・戻る
                        </GradientButton>
                    </div>
            </form>
        </div>
    </div>
</div>

<style lang="postcss">
    :global(body) {
        background-image: url('/backgrounds/bg-arcade-blank.png');
        background-repeat: repeat-x;
        background-size: cover;
    }
</style>