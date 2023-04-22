<!-- Login.svelte -->
<script>
    import { onMount } from "svelte";
    import Button from "../atoms/Button.svelte";

    let email = "";
    let password = "";
    let errorMessage = "";
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
            ログイン
        </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form class="space-y-6" on:submit={loginUser}>
                <!-- メールアドレス -->
                <div>
                    <label
                        for="email"
                        class="block text-sm font-medium text-gray-700"
                        >メールアドレス</label
                    >
                    <div class="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            bind:value={email}
                            class="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {#if errorMessage}
                        <p class="mt-2 text-sm text-red-600">{errorMessage}</p>
                    {/if}
                </div>

                <!-- パスワード -->
                <div>
                    <label
                        for="password"
                        class="block text-sm font-medium text-gray-700"
                        >パスワード</label
                    >
                    <div class="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            required
                            bind:value={password}
                            class="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {#if errorMessage}
                        <p class="mt-2 text-sm text-red-600">{errorMessage}</p>
                    {/if}
                </div>

                <div class="flex items-center justify-between">
                        <div class="text-sm">
                            <a
                                href="/password/request"
                                class="font-medium text-indigo-600 hover:text-indigo-500"
                                >パスワードをお忘れですか？</a
                            >
                        </div>
                </div>

                <div>
                    <Button type="submit" class="w-full">
                        ログイン
                    </Button>
                </div>
            </form>
        </div>
    </div>
</div>
