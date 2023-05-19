<script lang="ts">
    import { superForm } from "sveltekit-superforms/client";
    import type { PageData } from "./$types";
    import { Button, ButtonGroup, Helper, InputAddon, Input, Label, Select, Spinner} from "flowbite-svelte";
    import {FORMS} from "$lib/config/forms";
    import { registerSchema } from "$lib/config/schemas";
    import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
    import { ProgressRadial } from "@skeletonlabs/skeleton";

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

</script>
<div class="bg-inherit min-h-screen flex flex-col items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <img
            class="mx-auto md:h-40 h-20 w-auto"
            src="../../logo_home.png"
            alt="Your Company"
        />
        <h2 class="mt-4 text-center text-5xl font-bold tracking-tight text-slate-200 font-informal">
            Join the crew!
        </h2>
    </div>

    <div class="mt-3 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-darkish py-4 px-4 shadow sm:rounded-lg sm:px-10">
            <form class="space-y-6 grid grid-cols-1 gap-1" method="POST" use:enhance>
                    <!-- <SuperDebug data={$form} /> -->
                    <!-- ユーザー名 -->
                    <Label>
                    ユーザ名
                    <Input type="text" name="username" placeholder="Your username" bind:value={$form.username} {...$constraints.username} size="sm">
                        <span slot="left">👋</span>
                    </Input>
                    {#if $errors.username}<Helper class="mt-2" color="red">{$errors.username}</Helper>{/if}
                    </Label>

                    <Label>
                        学生番号(任意)
                        <Input type="text" name="user_number" placeholder="学生番号（任意）" bind:value={$form.user_number} {...$constraints.user_number}>
                            <span slot="left">#️⃣</span>
                        </Input>
                        {#if $errors.user_number}<Helper class="mt-2" color="red">{$errors.user_number}</Helper>{/if}
                    </Label>
                    

                    <!-- メールアドレス -->
                    <Label>
                        メールアドレス
                        <Input type="email" name="email" placeholder="Your email" bind:value={$form.email} bind:errorMessage={emailError} {...$constraints.email}>
                            <span slot="left">📨</span>
                        </Input>
                        {#if $errors.email}<Helper class="mt-2" color="red">{$errors.email}</Helper>{/if}
                    </Label>

                    <!-- パスワード -->
                    <Label for="show-password1">パスワード
                    <ButtonGroup class="w-full mt-0">
                        <InputAddon>
                        <button type="button" on:click={() => (showPassword = !showPassword)}>
                            {#if showPassword}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {:else}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                            {/if}
                        </button>
                        </InputAddon>
                        <Input id="show-password1" bind:value={$form.password} type={showPassword ? 'text' : 'password'} name="password" placeholder="Your password here" {...$constraints.password}/>
                    </ButtonGroup>
                        {#if $errors.password}<Helper class="mt-2" color="red">{$errors.password}</Helper>{/if}
                    </Label>

                    <Label>
                        <span class="italic">母国語は...・My native language is ...</span>
                        <Select class="mt-2" name="native_language" items={data.languages} bind:value={$form.native_language}/>
                    </Label>

                    <div class="mt-4 text-center">
                        <Button type="submit" gradient color="teal" on:click={ () => { loading = true }}>
                            {FORMS.Buttons.register.label}
                            {#if loading}
                            <Spinner class="ml-2" size="3" color="white"/>
                            {/if}
                        </Button>
                        
                    </div>
            </form>
        </div>
    </div>
</div>