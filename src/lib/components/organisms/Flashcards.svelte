<script lang="ts">
    import { elasticInOut, quadInOut } from 'svelte/easing';
    import { Button, ButtonGroup, Toggle } from 'flowbite-svelte';
    import { fly, fade } from "svelte/transition";
  
    export let cardsData;
    
    let cards = cardsData?.map((card: any) => {
      return {
        front: card.vocabulary.en_word,
        back: `${card.vocabulary.ja_word ?? ''} \n ${card.custom_translation ?? ''}`,
      };
    });

    let currentIndex = 0;
    let isFlipped = false;
    let isBackFirst = false;
  
    function nextCard() {
      isFlipped = false;
      currentIndex = (currentIndex + 1) % cards.length;
    }
  
    function prevCard() {
      isFlipped = false;
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    }
  
    function toggleCard() {
      isFlipped = !isFlipped;
    }
  
    function updateCard(type: any) {
      // Call API to update UserVocabularies attributes based on the selected button
      console.log("Update card with type:", type);
  
      // Move to the next card
      nextCard();
    }

    function cardFlip(node: any, { duration }) {
      return {
        duration,
        css: (t: any) => {
          const eased = elasticInOut(t);
          return `
            transform: perspective(1000px) rotateX(${180 * eased}deg);
            backface-visibility: hidden;
            transform-style: preserve-3d;
          `;
        },
      };
    }

  </script>
  
  <div class="container p-4 mt-8 flex flex-col items-center justify-center md:h-1/2 md:w-3/4 h-3/4 w-5/6">
      {#if cards}
      <div class="card m-4 p-4 min-h-[250px] max-h-full md:w-[600px] min-w-[220px] rounded-md border-slate-300 border">
        {#if isBackFirst}
          <div class="grid grid-rows-2 h-full min-w-full justify-stretch items-stretch"> 
            <div class="pt-4 md:text-2xl text-center w-auto break-words hyphens-auto">
              {cards[currentIndex].back}
            </div>
            {#if isFlipped}
              <div in:fade="{{duration: 800, easing: quadInOut}}" class="pt-4 md:text-2xl text-center w-auto break-words hyphens-auto">
                {cards[currentIndex].front}
              </div>
            {/if}
          </div>
        {:else}
          <div class="grid grid-rows-2 h-full w-full justify-stretch items-stretch "> 
            <div class="pt-4 md:text-2xl text-center w-auto break-words hyphens-auto">
                {cards[currentIndex].front}
            </div>
            {#if isFlipped}
              <div in:fade="{{duration: 800, easing: quadInOut}}" class="pt-4 md:text-2xl text-center w-auto break-words hyphens-auto">
                {cards[currentIndex].back}
              </div>
            {/if}
          </div>
        {/if}
      <!-- <button class="btn variant-ghost" on:click={nextCard}>Next</button> -->
    </div>
    <div class="w-full md:grid md:grid-cols-3 md:gap-10 md:justify-items-center flex flex-col gap-6 items-center">
      <Toggle name="isFrontFirst" bind:checked={isBackFirst} class="col-span-2">
        {isBackFirst ? "Back ⇒ Front" : "Front ⇒ Back"}
      </Toggle>
      
      {#if isFlipped}
      <ButtonGroup>
        <Button pill gradient color="red" on:click={() => updateCard("again")}>Again</Button>
        <Button pill gradient color="blue" on:click={() => updateCard("good")}>Good</Button>
        <Button pill gradient color="green" on:click={() => updateCard("easy")}>Easy</Button>
      </ButtonGroup>
      {:else}
        <Button pill gradient color="purple" on:click={toggleCard}>Show Answer</Button>
      {/if}
      
    </div>
    {:else}
      <p>
        単語は未だ登録していないみたいです。。。
      </p>
    {/if}
  </div>

  