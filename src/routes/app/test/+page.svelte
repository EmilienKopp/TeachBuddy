<script>
  import { useChat } from "ai/svelte";

  const { input, handleSubmit, messages } = useChat({
    api: '/app/generator'
  });
</script>

<div class="" style="margin-top:300px">
  <ul>
    {#each $messages as message}
      <li>{message.role}: {message.content}</li>
    {/each}
  </ul>
  <form on:submit={handleSubmit}>
    <input bind:value={$input} />
    <button type="submit">Send</button>
  </form>
</div>
