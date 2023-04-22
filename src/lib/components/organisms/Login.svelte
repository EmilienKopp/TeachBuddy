<!-- Login.svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    import Button from "../atoms/Button.svelte";
	import TextInput from "../molecules/inputs/TextInput.svelte";
	import EmailInput from "../molecules/inputs/EmailInput.svelte";
	import PasswordInput from "../molecules/inputs/PasswordInput.svelte";
	import { FORMS } from "$lib/config/forms";

    let email = "";
    let password = "";
    let emailError: string;
    let passwordError: string;
    let hasPasswordRequestRoute = false;


</script>

<div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <img
            class="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
        />
        <h2
            class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900"
        >
            Welcome =)
        </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form class="space-y-6" method="POST" action="/login">
                <!-- メールアドレス -->
                <EmailInput  name="email" placeholder="Your email" bind:errorMessage={emailError}/>

                <!-- パスワード -->
                <PasswordInput name="password" placeholder="Your deepest darkest secret" bind:errorMessage={passwordError}/>

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
                    <Button type="submit" class="w-full">
                        {FORMS.Buttons.login.label}
                    </Button>
                </div>
            </form>
        </div>
    </div>
</div>
