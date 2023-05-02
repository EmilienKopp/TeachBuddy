<script lang="ts">
    import { superForm } from "sveltekit-superforms/client";
    import type { PageData } from "./$types";
    import TextInput from "$lib/components/molecules/inputs/TextInput.svelte";
    import PasswordInput from "$lib/components/molecules/inputs/PasswordInput.svelte";
    import EmailInput from "$lib/components/molecules/inputs/EmailInput.svelte";
    import Button from "$lib/components/atoms/Button.svelte";
    import {FORMS} from "$lib/config/forms";
    import { registerSchema } from "$lib/config/schemas";
    import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
    import { ProgressRadial } from "@skeletonlabs/skeleton";

    export let data: PageData;

    let loading: boolean = false;
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
            Join the crew!
        </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-darkish py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form class="space-y-6 grid grid-cols-1" method="POST" use:enhance>
                <section title="basic"> 
                    <!-- <SuperDebug data={$form} /> -->
                    <!-- ユーザー名 -->
                    <TextInput label="Name" name="username" placeholder="Your username" bind:value={$form.username} {...$constraints.username}/>

                    <TextInput label="学生番号" name="user_number" placeholder="学生番号（任意）" 
                        bind:value={$form.user_number} {...$constraints.user_number}/>

                    <!-- メールアドレス -->
                    <EmailInput  name="email" placeholder="Your email" bind:value={$form.email} bind:errorMessage={emailError} {...$constraints.email}/>

                    <!-- パスワード -->
                    <PasswordInput name="password" placeholder="Your deepest darkest secret" bind:value={$form.password} bind:errorMessage={passwordError} {...$constraints.password}/>
                    <PasswordInput label="Confirm" name="password_confirm" placeholder="One more, please" 
                        bind:value={$form.password_confirm} bind:errorMessage={passwordConfirmError} {...$constraints.password_confirm}/>


                    <div class="mt-4 text-center">
                        
                        <Button type="submit" class="btn variant-filled">
                            {FORMS.Buttons.register.label}
                        </Button>
                        {#if $delayed && !$timeout}
                        <ProgressRadial/>
                        {/if}
                        {#if $timeout}
                        <p class="mt-2 text-sm text-red-600">Timeout. Try again.</p>
                        {/if}
                    </div>
                </section>
            </form>
        </div>
    </div>
</div>