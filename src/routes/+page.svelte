<script>
    import { goto } from '$app/navigation';
    import { Button } from 'flowbite-svelte';
</script>

<div class="h-full w-2/3 mx-auto grid place-items-center">
    <div class="flex flex-col gap-3">
        <img src="/PENPAI-alpha.png" class="animated-logo mx-auto" alt="Logo-Skeleton" />
        <h1 class="text-3xl text-center font-raleway font-extrabold">
            penpAI
        </h1>
        <p class="text-md text-center mb-8">
            読むことを、もっと楽しく。
        </p>
        <Button color="blue" on:click={() => goto('/auth/register')}>アカウント作成</Button>
        <Button outline color="blue" on:click={() => goto('/auth/login')}>ログイン</Button>
    </div>
</div>

<style>
    .animated-logo:hover {
        animation: spin 5s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>