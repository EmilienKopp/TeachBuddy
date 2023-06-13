<script lang="ts">
    import { Card, MenuButton, Dropdown, DropdownItem, Avatar, Button, GradientButton } from "flowbite-svelte";
    import { C_ } from '$lib/i18n/helpers';

    export let pageData: any = null;
    export let user: any;
    export let isFriend: boolean = false;
    export let isPending: boolean = pageData.friends.some((friendship: any) => friendship.friend_id === user.id && friendship.approved === false);

    let challengeModalOpen: boolean = false;

    const supabase = pageData.supabase;

    async function friendRequest() {
        alert('友達申請しました！');
        const { error } = await supabase.from('friendships').insert([{   
                user_id: pageData.session.user.id, // logged user
                friend_id: user.id, // target user
            }]);
        if (error) {
            console.log(error);
        }
    }

    async function challengeFriend() {
        alert('チャレンジしました！');
        const { error } = await supabase.from('challenges').insert([{   
                challenger_id: pageData.session.user.id, // logged user
                challengee_id: user.id, // target user
            }]);
        if (error) {
            console.log(error);
        }
    }
</script>

<Card padding='sm'>
    <div class="flex justify-end">
      <MenuButton />
      <Dropdown class="w-36">
        <DropdownItem>図書室を見る・See Library</DropdownItem>
        <DropdownItem on:click={challengeFriend}>チャレンジ・Challenge</DropdownItem>
      </Dropdown>
    </div>
    <div class="flex flex-col items-center p-1">
        {#if user?.avatar}
            <Avatar src="/images/profile-picture-3.webp" />
        {:else}
            <Avatar class="bg-gray-200 dark:bg-gray-800" />
        {/if}
        <h5 class="mb-1 text-xs md:text-xl font-medium text-gray-900 dark:text-white my-2">{user.first_name + ' ' + user.last_name}</h5>
        {#if user?.role}
        <span class="text-sm text-gray-500 dark:text-gray-400">{user.role}</span>
        {/if}
        <div class="flex mt-4 space-x-3 lg:mt-6">
            {#if !isFriend}
                {#if isPending}
                    <Button color="light" class="dark:text-white pointer-events-none cursor-default">{$C_('friend_request_pending')}</Button>
                {:else}
                    <GradientButton color="greenToBlue" on:click={friendRequest}>
                        追加😊
                    </GradientButton>
                {/if}
            {/if}
            
          <!-- <Button color="light" class="dark:text-white">Message</Button> -->
        </div>
    </div>
  </Card>