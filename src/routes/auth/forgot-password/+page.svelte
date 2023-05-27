<script lang="ts">
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
    import type { PageData } from "./$types";
    import { superForm } from 'sveltekit-superforms/client';
    import { FORMS } from '$lib/config/forms';
    import { Button, ButtonGroup, GradientButton, Helper, Input, InputAddon, Label } from 'flowbite-svelte';

    export let data: PageData;

    let email: string = '';

    // Session
    const session = data.session;
    
    async function sendResetEmail() {
        const { error } = await data.supabase.auth.resetPasswordForEmail(email,{
            redirectTo: 'https://teach-buddy.vercel.app/auth/reset',
        });
        if (error) {
            console.log('Error sending reset email:', error);
        } else {
            console.log('Reset email sent!');
        }
    }

</script>


<div class="min-h-screen flex flex-col items-center justify-center py-4 px-1 sm:px-4 lg:px-2 mx-auto container">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-4xl md:text-6xl dark:text-slate-200 font-pixel">
            <p class="text-2xl md:text-3xl">パスワードリセット・ Password Reset</p>
        </h2>
    </div>

    <div class="mt-4 w-full sm:mx-auto sm:w-full sm:max-w-md font-pixel">
        <div class="py-8 px-4 rounded sm:rounded-lg sm:px-10">
                <Label class="font-bold md:text-xl mb-4">
                    Email
                    <Input id="email" type="email" name="email" placeholder="Gimme your email!" bind:value={email}/>
                </Label>
                <GradientButton type="button" shadow color="lime" size="xl" class="md:text-xl w-full" on:click={sendResetEmail}>
                    リセット・Reset
                </GradientButton>
        </div>
    </div>
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