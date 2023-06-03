<script lang="ts">
    import type { PageData } from './$types';
    import { Input, Label, Tabs, TabItem } from 'flowbite-svelte';
    import { C_ } from '$lib/i18n/helpers';
    import UserCard from '$lib/components/organisms/UserCard.svelte';

    export let data: PageData;
    let searchTerm: string | undefined;
    let filteredUsers: any;
    
    $: filteredUsers = data.profiles?.filter((profile) => {
        if (searchTerm === undefined || searchTerm.length < 3) {
            return false;
        }
        return profile?.username?.toLowerCase().includes(searchTerm.toLowerCase()) 
                || profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
                || profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
</script>

<div class="mt-10 md:mt-2 px-2 md:px-12 md:mx-auto md:w-3/5">
<Tabs>
    <TabItem title="{$C_('search')}" open inactiveClasses="p-4 text-gray-800 bg-white bg-opacity-50 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300">
    <div>
        <p class="text-xs">
            {$C_('friends_searchable_fields')}
        </p>
        <p class="text-xs mb-5">
            {$C_('friends_conditions_to_find')}
        </p>
        <Label>
            <Input type="text" bind:value={searchTerm} placeholder="{$C_('search')}" class="max-w-[50ch] mb-6" >
                <i slot="left" class="bi bi-search"></i>
            </Input>
        </Label>
        
        {#if filteredUsers}
            <div class="grid grid-cols-2">
                {#each filteredUsers as user}
                    <UserCard {user} pageData={data} />
                {/each}
            </div>
        {/if}
    </div>
    </TabItem>
    <TabItem title="{$C_('list')}" inactiveClasses="p-4 text-gray-800 bg-white bg-opacity-50 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300">
        <p>フレンド</p>
        {#if data.friends}
            <div class="grid grid-cols-2">
                {#each data.friends as friend}
                    <UserCard user={friend} isFriend={true} pageData={data}/>
                {/each}
            </div>
        {/if}
    </TabItem>
</Tabs>
</div>