<script lang="ts">
  import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownHeader,
    Avatar,
  } from "flowbite-svelte";

  export let data: any[];
</script>

<div
  id="bell"
  class="inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400"
>
  <svg
    class="w-6 h-6"
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    ><path
      d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
    /></svg
  >
  <div class="flex relative">
    <div
      class="inline-flex relative -top-2 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"
    />
  </div>
</div>
<Dropdown
  triggeredBy="#bell"
  class="w-full max-w-sm rounded divide-y divide-gray-100 shadow dark:bg-gray-800 dark:divide-gray-700"
>
  <div slot="header" class="text-center py-2 font-bold">Notifications</div>
  {#if data.length > 0}
    {#each data as item}
      <DropdownItem class="flex space-x-4">
        <Avatar
          src="/images/profile-picture-2.webp"
          dot={{ color: "bg-red-400" }}
          rounded
        />
        <div class="pl-3 w-full">
          <div class="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
            <span class="font-semibold text-gray-900 dark:text-white"
              >Joseph Mcfall</span
            >
            and
            <span class="font-medium text-gray-900 dark:text-white"
              >5 others</span
            > started following you.
          </div>
          <div class="text-xs text-blue-600 dark:text-blue-500">
            10 minutes ago
          </div>
        </div>
      </DropdownItem>
    {/each}
  {:else}
    <DropdownItem class="flex space-x-4">
      <div class="pl-3 w-full">
        <div class="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
          Nothing to show
        </div>
      </div>
    </DropdownItem>
  {/if}

  {#if data.length > 0}
    <a
      href="/"
      class="block py-2 -my-1 text-sm font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
    >
      <div class="inline-flex items-center">
        <svg
          class="mr-2 w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          ><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path
            fill-rule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clip-rule="evenodd"
          /></svg
        >
        View all
      </div>
    </a>
  {/if}
</Dropdown>
