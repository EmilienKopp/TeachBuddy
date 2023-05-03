<script lang="ts">
    import NavButton from "$lib/components/atoms/NavButton.svelte";
    import Sidebar from "$lib/components/organisms/Sidebar.svelte";
    import Flashcards from "$lib/components/organisms/Flashcards.svelte";
    import type { PageData } from "./$types";
    import UnderConstruction from "$lib/components/atoms/UnderConstruction.svelte";

    export let data: PageData;

</script>

<UnderConstruction />

<div class="h-full w-full flex justify-center items-center">

<Flashcards cardsData={data.vocabData}/>

</div>