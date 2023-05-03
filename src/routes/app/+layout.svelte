<script lang="ts">
  import "$lib/styles/global.css";
  import { writable, type Writable } from "svelte/store";
  import { Scaffolder } from "/src/config/scaffolder";
  import { page } from "$app/stores";
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
    ImagePlaceholder,
    Skeleton,
    TextPlaceholder,
  } from "flowbite-svelte";
  const storeValue: Writable<number> = writable(0);
</script>

<div class="relative px-8">
  <Navbar
    navClass="px-2 sm:px-4 py-2.5 absolute w-full z-20 top-0 left-0 border-b"
    let:hidden
    let:toggle
  >
    <NavBrand href="/">
      <img
        src="/logo_home.png"
        class="mr-3 h-8 sm:h-16"
        alt="Logo"
      />
      <span
        class="self-center whitespace-nowrap text-xl font-semibold dark:text-white font-raleway"
        >Page-Turner</span
      >
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden} on:click={toggle}>
      {#each Scaffolder.AppRail.Tiles as tile, index}
        <NavLi href={tile.href} class="text-center" >
            <i class="bi {`bi-${tile.icon}`} md:text-3xl"></i>
            <p>
                {tile.label}
            </p>
        </NavLi>
    {/each}
    </NavUl>
  </Navbar>
</div>
<main class="md:pt-24 pt-6 bg-inherit">
    <slot/>
</main>
