<script lang="ts">
    import { elasticInOut, quadInOut } from 'svelte/easing';
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import { fly, fade } from "svelte/transition";
  
    let cards: any[] = [
      {
        front: "front 1 abcdefghijklmonpasdasdfasgagf",
        back: "back 1",
      },
      {
        front: "front 2",
        back: "back 2",
      },
      {
        front: "front 3",
        back: "back 3",
      },
    ];
  
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
  
  <div class="container p-4 m-4 flex flex-col items-center justify-center md:h-1/2 md:w-3/4 h-3/4 w-5/6">
      
      <!-- <button class="btn variant-ghost" on:click={prevCard}>Prev</button> -->

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="card m-4 p-4 w-full h-full">
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
      <SlideToggle name="isFrontFirst" bind:checked={isBackFirst} class="col-span-2">
        {isBackFirst ? "Back ⇒ Front" : "Front ⇒ Back"}
      </SlideToggle>
      
      {#if isFlipped}
      <div class="btn-group variant-filled w-fit h-18 self-center">
        <button class="bg-red-300" on:click={() => updateCard("again")}>Again</button>
        <button class="bg-blue-400" on:click={() => updateCard("good")}>Good</button>
        <button class="bg-green-300" on:click={() => updateCard("easy")}>Easy</button>
      </div>
      {:else}
        <button class="btn variant-ghost-secondary h-18 self-center" on:click={toggleCard}>Show Answer</button>
      {/if}
      
    </div>
    
  </div>

  