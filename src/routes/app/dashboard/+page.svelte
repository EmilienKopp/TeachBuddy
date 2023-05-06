<script lang="ts">
  import { onMount } from "svelte";
  import NavButton from "$lib/components/atoms/NavButton.svelte";
  import Sidebar from "$lib/components/organisms/Sidebar.svelte";
  import { Scaffolder } from "/src/config/scaffolder";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<h1 class="text-4xl text-teal-600">Nothing to see here yet...</h1>
<div class="flex flex-col justify-start mx-auto w-3/4">
  <p>Go to:</p>
  <ul class="self-start">
    {#each Scaffolder.AppRail.Tiles as tile, index}
      <li class="flex flex-row items-center">
        <NavButton href={tile.href}>
          <i class="bi {`bi-${tile.icon}`} md:text-xl" />
        </NavButton>
        {tile.label}
      </li>
    {/each}
  </ul>
</div>
