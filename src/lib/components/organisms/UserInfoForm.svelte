<script lang="ts">
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client';
    import { FORMS } from '$lib/config/forms';
    import EmailInput from '$lib/components/molecules/inputs/EmailInput.svelte';
    import PasswordInput from '$lib/components/molecules/inputs/PasswordInput.svelte';
    import Button from '$lib/components/atoms/Button.svelte';
    import TextInput from '../molecules/inputs/TextInput.svelte';
    import Select from '../atoms/Select.svelte';
    import { toSelectOptions } from '$lib/helpers/Arrays';

    export let userData: any;
    export let grades: any;

    grades = toSelectOptions(grades, 'id', 'name');
    console.log(grades);
</script>


<div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">


    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-darkish py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form>
                <EmailInput
                    class="text-slate-100"
                    errorMessage={undefined}
                    bind:value={userData.email}
                    name="email"
                    label="Email"
                    placeholder="Email"/>
                <TextInput
                    class="text-slate-100"
                    errorMessage={undefined}
                    bind:value={userData.user_metadata.username}
                    name="username"
                    label="Username"
                    placeholder="Username"/>
                <Select name="grade" data={grades} label="学年" bind:value={userData.user_metadata.grade} on:change={()=> {console.log('test aaaa')}}/>

            </form>
        </div>
    </div>
</div>
