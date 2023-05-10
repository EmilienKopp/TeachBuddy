<script lang="ts">
    import BasicInfoForm from "$lib/components/organisms/Forms/BasicInfoForm.svelte";
    import LanguageInfoForm from "$lib/components/organisms/Forms/LanguageInfoForm.svelte";
    import { Tabs, TabItem } from 'flowbite-svelte';
    import type { PageData } from './$types';
    import UnderConstruction from "$lib/components/atoms/UnderConstruction.svelte";

    export let data: PageData;

    let grades = data.grades;

</script>

<UnderConstruction />

<div class="mt-10 md:mt-2 px-2 md:px-12 md:mx-auto md:w-3/5">

    <Tabs>
        <TabItem title="基本・Basic" open>
            <BasicInfoForm {data} {grades} />
        </TabItem>
        <TabItem title="言語・Languages">
            <LanguageInfoForm {data} />
        </TabItem>
    </Tabs>
</div> 