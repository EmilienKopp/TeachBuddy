<script lang="ts">
    import ContactForm from "$lib/components/organisms/Forms/ContactForm.svelte";
    import type { PageData } from './$types';
    import UnderConstruction from "$lib/components/atoms/UnderConstruction.svelte";

    export let data: PageData;

</script>

<ContactForm {data}/>