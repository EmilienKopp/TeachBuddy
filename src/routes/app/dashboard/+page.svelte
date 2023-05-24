<script lang="ts">
  import { onMount } from "svelte";
  import NavButton from "$lib/components/atoms/NavButton.svelte";
  import Sidebar from "$lib/components/organisms/Sidebar.svelte";
  import { Scaffolder } from "/src/config/scaffolder";
  import type { PageData } from "./$types";

  export let data: PageData;
  console.log(data);
</script>

<div class="mt-12 flex flex-col justify-start mx-auto w-3/4 font-gloria">
  Welcome, {data.user.profile.username}!
</div>
