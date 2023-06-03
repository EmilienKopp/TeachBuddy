<script lang="ts">
    import BasicInfoForm from "$lib/components/organisms/Forms/BasicInfoForm.svelte";
    import LanguageInfoForm from "$lib/components/organisms/Forms/LanguageInfoForm.svelte";
    import { Tabs, TabItem } from 'flowbite-svelte';
    import type { PageData } from './$types';
    import UnderConstruction from "$lib/components/atoms/UnderConstruction.svelte";
    import { _ } from 'svelte-i18n';
    import { C_ } from '$lib/i18n/helpers';

    export let data: PageData;

    let grades = data.grades;
    
</script>

<UnderConstruction />

<div class="mt-10 md:mt-2 px-2 md:px-12 md:mx-auto md:w-3/5 pb-20">

    <Tabs >
        <TabItem title="{$C_('basic')}" open inactiveClasses="p-4 text-gray-800 bg-white bg-opacity-50 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300">
            <BasicInfoForm {data} {grades} />
        </TabItem>
        <TabItem title="{$C_('languages')}" inactiveClasses="p-4 text-gray-800 bg-white bg-opacity-50 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300">
            <LanguageInfoForm {data} />
        </TabItem>
    </Tabs>
</div> 