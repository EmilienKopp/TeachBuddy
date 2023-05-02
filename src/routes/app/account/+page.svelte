<script lang="ts">
    import NavButton from "$lib/components/atoms/NavButton.svelte";
    import Sidebar from "$lib/components/organisms/Sidebar.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;

    const supabase = data.supabase;

    console.log(data);
</script>

