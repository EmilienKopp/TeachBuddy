<script lang="ts">
    import type { PageData } from './$types';
    import { Input, Label, Tabs, TabItem } from 'flowbite-svelte';
    import InfoBubble from '$lib/components/atoms/InfoBubble.svelte';
    import SaveButton from '$lib/components/atoms/SaveButton.svelte';
    import UserCard from '$lib/components/organisms/UserCard.svelte';

    export let data: PageData;
    let searchTerm: string | undefined;
    let filteredUsers: any;


    console.log(data);
    
    $: filteredUsers = data.profiles?.filter((profile) => {
        if (searchTerm === undefined || searchTerm.length < 3) {
            return false;
        }
        return profile.username.toLowerCase().includes(searchTerm.toLowerCase()) 
                || profile.first_name.toLowerCase().includes(searchTerm.toLowerCase())
                || profile.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    });
</script>

<div class="mt-10 md:mt-2 px-2 md:px-12 md:mx-auto md:w-3/5">
<Tabs>
    <TabItem title="検索・Search" open>
    <div>
        <p class="text-xs">
            とりあえず、username, first name, last nameで検索してください。
        </p>
        <p class="text-xs mb-5">
            (アカウントの「基本情報」入力済みの人のみ検索できます)
        </p>
        <Label>
            <span class="text-xs">ユーザー検索</span>
            <Input type="text" bind:value={searchTerm} placeholder="検索 (何語でも👍)" class="max-w-[50ch] mb-6" >
                <i slot="left" class="bi bi-search"></i>
            </Input>
        </Label>
        
        {#if filteredUsers}
            <div class="grid grid-cols-2">
                {#each filteredUsers as user}
                    <UserCard {user} pageData={data}/>
                {/each}
            </div>
        {/if}
    </div>
    </TabItem>
    <TabItem title="一覧・List">
        <p>友人</p>
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