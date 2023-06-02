<script lang="ts">
    import { superForm } from "sveltekit-superforms/client";
    import type { PageData } from "./$types";
    import { Button, ButtonGroup, Helper, InputAddon, Input, Label, Spinner} from "flowbite-svelte";
    import {FORMS} from "/src/config/forms";
    import { registerSchema } from "/src/config/schemas";
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
        <h2 class="mt-4 text-center text-xl font-bold tracking-tight text-slate-200 font-informal">
            Thanks for joining!
        </h2>
        <p class="text-center mt-2">
            Please check your email for a confirmation link.
            
        </p>
    </div>

    <div class="mt-3 sm:mx-auto sm:w-full sm:max-w-md">
        <a href="/auth/login" class="underline text-teal-400">
            Back to Login
        </a>
    </div>
</div>