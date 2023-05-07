<script lang="ts">
  import "$lib/styles/global.css";
  import { writable, type Writable } from "svelte/store";
  import { Scaffolder } from "/src/config/scaffolder";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
    Badge
  } from "flowbite-svelte";
  
  const storeValue: Writable<number> = writable(0);

  const user = $page.data.session?.user;

  const logout = async () => {
    const { error } = await $page.data.supabase.auth.signOut();
    if(error) {
      console.error(error);
    }
    await goto("/auth/login");
  };

</script>

<div class="relative px-8">
  <Navbar
    navClass="px-2 sm:px-4 py-2.5 absolute w-full z-20 top-0 left-0 border-b"
    let:hidden
    let:toggle>

    <NavBrand href="/app/dashboard">
      <img src="/PageTurner-bg-black-reading-plus.png" class="mr-3 h-10 sm:h-12" alt="Logo"/>
      <!-- <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white font-raleway">
        Page-Turner
      </span> -->
      <svg data-testid="geist-icon" fill="none" height="32" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" width="32" style="color: var(--accents-2);"><path d="M16.88 3.549L7.12 20.451"></path></svg>
      <p class="mr-2">{user?.user_metadata.username ?? user?.email}</p>
      <Badge rounded border color="dark">User</Badge>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden} on:click={toggle} class="py-0.5">
      {#each Scaffolder.AppRail.Tiles as tile, index}
        {#if !tile.disabled}
          <NavLi href={tile.href} class="text-center" >
              <i class="bi {`bi-${tile.icon}`} md:text-xl"></i>
              <p>
                  {tile.label}
              </p>
          </NavLi>
        {/if}
      {/each}
      <NavLi class="text-center" on:click={logout}>
        <i class="bi bi-box-arrow-right md:text-xl"></i>
        <p>
          Logout
        </p>
      </NavLi>
    </NavUl>
  </Navbar>
</div>
<main class="md:pt-24 pt-6 bg-inherit">
    <slot/>
</main>
