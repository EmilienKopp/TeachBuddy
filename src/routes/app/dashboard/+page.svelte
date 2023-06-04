<script lang="ts">
  console.time('dashboard+page');
  import type { PageData } from "./$types";
  import type { CustomUser } from "$lib/types";
  import { _ } from "svelte-i18n";
  import { C_ } from "$lib/i18n/helpers";
  import { Card, GradientButton } from "flowbite-svelte";
  import { random } from "$lib/helpers/Arrays";
  import { goto } from "$app/navigation";

  export let data: PageData;
  const user: CustomUser | undefined = data.session?.user;

  async function surpriseMe(): Promise<void> {
    try {
      const languages = user?.profile?.studying_languages ?? [];
      const randomLanguage = languages?.length > 0 ? random(languages) : "en";
      const { data: allPassagesForLanguage, error } = await data.supabase
        .from("passages")
        .select("id")
        .eq("language", randomLanguage);

      if (error) throw new Error(error.message);
      if (allPassagesForLanguage.length === 0)
        throw new Error("No passages found for this language");

      const randomPassage = random(allPassagesForLanguage);

      goto(`/app/library/${randomPassage.id}?supriseMe=true`);
    } catch (error) {
      console.error(error);
      return surpriseMe();
    }
  }

  console.timeEnd('dashboard+page')
</script>

<div class="mt-12 flex flex-col justify-start mx-auto w-3/4 font-gloria">
  <h2 class="text-lg md:text-2xl mb-6 font-pixel">
    Welcome, {user?.profile?.username ?? user?.email}!
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 font-pixel">
    <Card>
      <h5
        class="mb-2 text-xl md:text-3xl font-bold text-gray-900 dark:text-white"
      >
        {$C_('learning')}
      </h5>
      <ul class="text-sm">
        <li>
          Number of passages:
          <span class="font-bold">{data.passages?.length}</span>
        </li>
        <li>
          Number of words:
          <span class="font-bold">{data.words.length}</span>
        </li>
      </ul>
    </Card>
    <Card>
      <h5
        class="mb-2 text-xl md:text-3xl font-bold text-gray-900 dark:text-white"
      >
        {$C_("friends")}
      </h5>
      <ul class="text-sm">
        <li>
          Number of friends:
          <span class="font-bold">{data.friends.length ?? 0}</span>
        </li>
      </ul>
    </Card>
    <GradientButton
      shadow
      class="col-span-1 md:col-span-2"
      color="redToYellow"
      on:click={surpriseMe}
    >
      Surprise Me!
    </GradientButton>
  </div>
</div>
