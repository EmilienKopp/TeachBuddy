<script lang="ts">
  import "$lib/styles/global.css";
  import NotificationDropdown from "$lib/components/atoms/NotificationDropdown.svelte";
  import GenerationCompleteAlert from "$lib/components/organisms/GenerationCompleteAlert.svelte";
  import { writable, type Writable } from "svelte/store";
  import { Scaffolder } from "/src/config/scaffolder";
  import { formatMG, capitalize } from "$lib/helpers/Text";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import type { PageData } from './$types';
  import type { CustomUser } from "$lib/types";
  import { _ } from 'svelte-i18n';
  import { C_ } from '$lib/i18n/helpers';
  import { pointStore } from "$lib/stores";
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
    Dropdown,
    DropdownItem,
    Button,
    GradientButton,
  } from "flowbite-svelte";
    import ChallengeAlert from "$lib/components/organisms/ChallengeAlert.svelte";
    import { slide } from "svelte/transition";
  
  export let data: PageData;  

  const profile = $page.data.profile;
  $pointStore = $page.data.profile?.point_balance ?? 0;

  let shownItems: {index: number, displayed: boolean}[];

  const logout = async () => {
    const { error } = await $page.data.supabase.auth.signOut();
    if(error) {
      console.error(error);
    }
    await goto("/auth/login");
  };

</script>

<GenerationCompleteAlert {data}/>
<ChallengeAlert {data}/>

<div class="relative px-8">
  <Navbar
    navClass="noprint bg-opacity-80 font-pixel tracking-wide text-darkish px-2 sm:px-4 py-2.5 absolute w-full z-20 top-0 left-0 border-b"
    let:hidden
    let:toggle>

    <NavBrand href="/app/dashboard">
      <img src="/PageTurner-bg-black-reading-plus.png" class="h-10 hidden sm:h-12 xs:block" alt="Logo"/>
      <!-- <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white font-raleway">
        Page-Turner
      </span> -->
      <svg data-testid="geist-icon" fill="none" height="16" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" width="32" style="color: var(--accents-2);"><path d="M16.88 3.549L7.12 20.451"></path></svg>
      <p class="font-raleway mr-2 text-xs md:text-xl">{profile.username ?? profile.email}</p>
    </NavBrand>
    {#if $pointStore} <span>{formatMG($pointStore)}🪙</span> {/if}

    {#if data?.friendsRequests?.length > 0}
      <NotificationDropdown data={data.friendsRequests} />
    {/if}

    
    <NavHamburger on:click={() => { toggle(); 
                                    //@ts-ignore
                                    Scaffolder.AppRail.Tiles.forEach( el => el.active = false )}} />
    <NavUl {hidden} class="py-0.5">
      {#each Scaffolder.AppRail.Tiles as tile, index}
        {#if !tile.disabled}
          {#if tile.children?.length > 0}
            <NavLi class="text-center border-b md:border-0" id="navli{index}" on:click={ () => tile.active = !tile.active }>
              <i class="bi {`bi-${tile.icon}`} md:text-2xl"></i>
              <p class="text-xs lg:text-lg">
                  {$C_(tile.name)}
              </p>
            </NavLi>
            <Dropdown class="hidden md:block p-2 w-44 z-50">
              {#each tile.children as child}
                <DropdownItem href="{child.href}">
                  <i class="bi {`bi-${child.icon}`} md:text-2xl"></i>
                  <p class="text-xs lg:text-lg">
                    {$C_(child.name)}
                  </p>   
                </DropdownItem>
              {/each}
            </Dropdown>   
            {#if tile.active === true}
            <div class="grid grid-cols-2 justify-center md:hidden" transition:slide>
                {#each tile.children as child}
                  <NavLi class="text-black text-center border border-slate-300 rounded" href="{child.href}" on:click={toggle}>
                    <i class="bi {`bi-${child.icon}`} md:text-2xl"></i>
                    <p class="text-xs lg:text-lg">
                      {$C_(child.name)}
                    </p>   
                  </NavLi>
                {/each} 
            </div>
            {/if}

          {:else}
          <NavLi href={tile.href} class="text-center border-b md:border-0" id="navli{index}" on:click={toggle}>
            <i class="bi {`bi-${tile.icon}`} md:text-2xl"></i>
            <p class="text-xs lg:text-lg">
                {$C_(tile.name)}
            </p>
          </NavLi>
          {/if}
        {/if}
      {/each}
      <NavLi class="text-center" on:click={logout}>
        <i class="bi bi-box-arrow-right md:text-xl"></i>
        <p class="text-xs lg:text-lg">
          Logout
        </p>
      </NavLi>
    </NavUl>
  </Navbar>
</div>
<main class="md:pt-24 pt-6 bg-inherit">
    <slot/>
</main>
