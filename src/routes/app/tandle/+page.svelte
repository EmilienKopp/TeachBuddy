<script>
// @ts-nocheck

	import { confetti } from '@neoconfetti/svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { reduced_motion } from './reduced-motion';
    import { goto } from '$app/navigation';
	import { pointStore } from '$lib/stores';
	import { GradientButton, Modal } from 'flowbite-svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	let incomingPassage;
	let suggestions = [];
	let modalOpen = false;
	let generatorFinishedAlert = false;
	let suggestionModalOpen = false;
	let gaveUp = false;
	let gains = 0;

	

	/** Whether or not the user has won */
	$: won = (data.answers.at(-1) === 'xxxxx');

	/** The index of the current guess */
	$: i = won ? -1 : data.answers.length;

	/** Whether the current guess can be submitted */
	$: submittable = data.guesses[i]?.length === 5;

	

	

	/**
	 * A map of classnames for all letters that have been guessed,
	 * used for styling the keyboard
	 * @type {Record<string, 'exact' | 'close' | 'missing'>}
	 */
	let classnames;

	/**
	 * A map of descriptions for all letters that have been guessed,
	 * used for adding text for assistive technology (e.g. screen readers)
	 * @type {Record<string, string>}
	 */
	let description;

	$: {
		classnames = {};
		description = {};

		data.answers.forEach((answer, i) => {
			const guess = data.guesses[i];

			for (let i = 0; i < 5; i += 1) {
				const letter = guess[i];

				if (answer[i] === 'x') {
					classnames[letter] = 'exact';
					description[letter] = 'correct';
				} else if (!classnames[letter]) {
					classnames[letter] = answer[i] === 'c' ? 'close' : 'missing';
					description[letter] = answer[i] === 'c' ? 'present' : 'absent';
				}
			}
		});
	}

	/**
	 * Modify the game state without making a trip to the server,
	 * if client-side JavaScript is enabled
	 * @param {MouseEvent} event
	 */
	async function update(event) {
		const guess = data.guesses[i];
		const key = /** @type {HTMLButtonElement} */ (event.target).getAttribute('data-key');

		if (key === 'backspace') {
			data.guesses[i] = guess.slice(0, -1);
			if (form?.badGuess) form.badGuess = false;
		} else if (guess.length < 5) {
			data.guesses[i] += key;
		}
		console.log('Up for a ' + gains + ' win');
	}

	$: gains = (7 - data.guesses.filter(g => g !== '').length) * 100;

	/**
	 * Trigger form logic in response to a keydown event, so that
	 * desktop users can use the keyboard to play the game
	 * @param {KeyboardEvent} event
	 */
	function keydown(event) {
		if (event.metaKey) return;

		document
			.querySelector(`[data-key="${event.key}" i]`)
			?.dispatchEvent(new MouseEvent('click', { cancelable: true }));
	}

	async function givePoints() {
		const {data: updateData,error} = await data.supabase.from('profiles').update({
			point_balance: $pointStore,
		}).eq('id', data.user.id).select();
		console.log(updateData,error);
	}

	async function showHints() {
		suggestionModalOpen = true;
		// Get 3 Random five letter words from simplifiedWordList
		suggestions = data.simplifiedWordList.sort(() => 0.5 - Math.random()).slice(0, 3);
		$pointStore -= 5;
	}

	$: if(won) {
		$pointStore += gains;
		givePoints();
	}
</script>

<svelte:window on:keydown={keydown} />

<svelte:head>
	<title>Sverdle</title>
	<meta name="description" content="A Wordle clone written in SvelteKit" />
</svelte:head>

<h1 class="visually-hidden">Sverdle</h1>

<form
	class="mt-12 md:mt-1"
	method="POST"
	action="?/enter"
	use:enhance={() => {
		// prevent default callback from resetting the form
		return ({ update }) => {
			update({ reset: false });
		};
	}}
>
<input type="hidden" name="word" />
<GradientButton type="button" color="pinkToOrange" on:click={() => modalOpen = true}>
	How to play・遊び方
</GradientButton>
	<div class="grid" class:playing={!won} class:bad-guess={form?.badGuess}>
		{#each Array.from(Array(6).keys()) as row (row)}
			{@const current = row === i}
			<h2 class="visually-hidden">Row {row + 1}</h2>
			<div class="row" class:current>
				{#each Array.from(Array(5).keys()) as column (column)}
					{@const answer = data.answers[row]?.[column]}
					{@const value = data.guesses[row]?.[column] ?? ''}
					{@const selected = current && column === data.guesses[row].length}
					{@const exact = answer === 'x'}
					{@const close = answer === 'c'}
					{@const missing = answer === '_'}
					<div class="letter" class:exact class:close class:missing class:selected>
						{value}
						<span class="visually-hidden">
							{#if exact}
								(correct)
							{:else if close}
								(present)
							{:else if missing}
								(absent)
							{:else}
								empty
							{/if}
						</span>
						<input name="guess" disabled={!current} type="hidden" {value} />
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="controls mb-12">
		{#if won || data.answers.length >= 6}
			{#if !won && data.answer}
				<p>the answer was "{data.answer}"</p>
			{/if}
			<button data-key="enter" class="restart selected" formaction="?/restart">
				{won ? 'you won ' + gains + '🪙!' : `game over :(`} play again?
			</button>
		{:else}
			<div class="keyboard">
				<button data-key="enter" class:selected={submittable} disabled={!submittable}>enter</button>

				<button
					on:click|preventDefault={update}
					data-key="backspace"
					formaction="?/update"
					name="key"
					value="backspace"
				>
					back
				</button>

				{#each ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'] as row}
					<div class="row">
						{#each row as letter}
							<button
								on:click|preventDefault={update}
								data-key={letter}
								class={classnames[letter]}
								disabled={data.guesses[i].length === 5}
								formaction="?/update"
								name="key"
								value={letter}
								aria-label="{letter} {description[letter] || ''}"
							>
								{letter}
							</button>
						{/each}
					</div>
				{/each}
			</div>
		{/if}
		<button type="button" data-key="enter" class="mt-2 text-xs rounded w-fit h-6 bg-blue-500 p-1" on:click={showHints}>
			5🪙 Show Hints・ヒントを見る
		</button>
	</div>
	
</form>

{#if !gaveUp && won}
	<div
		style="position: absolute; left: 50%; top: 30%"
		use:confetti={{
			particleCount: $reduced_motion ? 0 : undefined,
			force: 0.7,
			stageWidth: window.innerWidth,
			stageHeight: window.innerHeight,
			colors: ['#ff3e00', '#40b3ff', '#676778']
		}}
	/>
{/if}

<!-- RULES MODAL -->
<Modal bind:open={modalOpen} autoclose size="xs">

		<h1 class="text-lg font-bold">How to play Sverdle</h1>
		<div class="text-xl">Win 100~600🪙!</div>
		<div class="text-xs">Your game is saved as long as you are connected. You can come back whenever you want!</div>
		<div class="text-xs">ログインしている間はゲームは保存されます。途中でやめたり戻ったりしてOKです。</div>

		<h2 class="text-lg">Rules</h2>

		<div class="example">
			<span class="close">r</span>
			<span class="missing">i</span>
			<span class="close">t</span>
			<span class="missing">z</span>
			<span class="exact">y</span>
		</div>
	
		<p>
			You have to guess a five-letter word. <br/><br/>
			5文字の単語を当てるゲームです。
		</p>
	
		<p>
			You can't just type a random word. It has to be a real one!
			<br/><br/>
			ただ適当な単語を入力してもダメです。実在する単語でないといけないぞ。
		</p>
	
		<p>
			<span class="exact">y</span> is in the right place. <br/><br/>
			<span class="exact">y</span> は正しい位置にある <br/><br/>
			<span class="close">r</span> and
			<span class="close">t</span>
			are the right letters, but in the wrong place. The other letters are wrong, and can be discarded.
			<br/><br/>
			<span class="close">r</span> and
			<span class="close">t</span>
			は必要な文字だが、位置が違います。
			<br/><br/>
		</p>
	
		<div class="example">
			<span class="exact">p</span>
			<span class="exact">a</span>
			<span class="exact">r</span>
			<span class="exact">t</span>
			<span class="exact">y</span>
		</div>
	
		<p>This time we guessed right! You have <strong>six</strong> guesses to get the word.</p>
		<p>これで単語があてられた。 <strong>6回</strong> しか試せないので、慎重に！</p>

</Modal>

<!-- SUGGESTIONS MODAL -->
<Modal bind:open={suggestionModalOpen} autoclose size="sm">
	<h1 class="text-lg font-bold mt-4 text-center">Hints</h1>

	<ul class="block w-32 text-center">
		{#each suggestions as suggestion}
			<li>{suggestion}</li>
		{/each}
	</ul>

</Modal>



<style>
	form {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		flex: 1;
	}

	.how-to-play {
		color: var(--color-text);
	}

	.how-to-play::before {
		content: 'i';
		display: inline-block;
		font-size: 0.8em;
		font-weight: 900;
		width: 1em;
		height: 1em;
		padding: 0.2em;
		line-height: 1;
		border: 1.5px solid var(--color-text);
		border-radius: 50%;
		text-align: center;
		margin: 0 0.5em 0 0;
		position: relative;
		top: -0.05em;
	}

	.grid {
		--width: min(100vw, 40vh, 380px);
		max-width: var(--width);
		align-self: center;
		justify-self: center;
		width: 100%;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.grid .row {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 0.2rem;
		margin: 0 0 0.2rem 0;
	}

	@media (prefers-reduced-motion: no-preference) {
		.grid.bad-guess .row.current {
			animation: wiggle 0.5s;
		}
	}

	.grid.playing .row.current {
		filter: drop-shadow(3px 3px 10px var(--color-bg-0));
	}

	.letter {
		aspect-ratio: 1;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		box-sizing: border-box;
		text-transform: lowercase;
		border: none;
		font-size: calc(0.08 * var(--width));
		border-radius: 2px;
		background: white;
		margin: 0;
		color: rgba(0, 0, 0, 0.7);
	}

	.letter.missing {
		background: rgba(255, 255, 255, 0.5);
		color: rgba(0, 0, 0, 0.5);
	}

	.letter.exact {
		background: var(--color-theme-2);
		color: white;
	}

	.letter.close {
		border: 2px solid var(--color-theme-2);
	}

	.selected {
		outline: 2px solid var(--color-theme-1);
	}

	.controls {
		text-align: center;
		justify-content: center;
		height: min(18vh, 10rem);
	}

	.keyboard {
		--gap: 0.2rem;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--gap);
		height: 100%;
	}

	.keyboard .row {
		display: flex;
		justify-content: center;
		gap: 0.2rem;
		flex: 1;
	}

	.keyboard button,
	.keyboard button:disabled {
		--size: min(8vw, 4vh, 40px);
		background-color: white;
		color: black;
		width: var(--size);
		border: none;
		border-radius: 2px;
		font-size: calc(var(--size) * 0.5);
		margin: 0;
	}

	.keyboard button.exact {
		background: var(--color-theme-2);
		color: white;
	}

	.keyboard button.missing {
		opacity: 0.5;
	}

	.keyboard button.close {
		border: 2px solid var(--color-theme-2);
	}

	.keyboard button:focus {
		background: var(--color-theme-1);
		color: white;
		outline: none;
	}

	.keyboard button[data-key='enter'],
	.keyboard button[data-key='backspace'] {
		position: absolute;
		bottom: 0;
		width: calc(1.5 * var(--size));
		height: calc(1 / 3 * (100% - 2 * var(--gap)));
		text-transform: uppercase;
		font-size: calc(0.3 * var(--size));
		padding-top: calc(0.15 * var(--size));
	}

	.keyboard button[data-key='enter'] {
		right: calc(50% + 3.5 * var(--size) + 0.8rem);
	}

	.keyboard button[data-key='backspace'] {
		left: calc(50% + 3.5 * var(--size) + 0.8rem);
	}

	.keyboard button[data-key='enter']:disabled {
		opacity: 0.5;
	}

	.restart {
		width: 100%;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 2px;
		border: none;
	}

	.restart:focus,
	.restart:hover {
		background: var(--color-theme-1);
		color: white;
		outline: none;
	}

	@keyframes wiggle {
		0% {
			transform: translateX(0);
		}
		10% {
			transform: translateX(-2px);
		}
		30% {
			transform: translateX(4px);
		}
		50% {
			transform: translateX(-6px);
		}
		70% {
			transform: translateX(+4px);
		}
		90% {
			transform: translateX(-2px);
		}
		100% {
			transform: translateX(0);
		}
	}

	.visually-hidden {
		display: none;
	}

	span {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 0.8em;
		width: 2.4em;
		height: 2.4em;
		background-color: white;
		box-sizing: border-box;
		border-radius: 2px;
		border-width: 2px;
		color: rgba(0, 0, 0, 0.7);
	}

	.missing {
		background: rgba(255, 255, 255, 0.5);
		color: rgba(0, 0, 0, 0.5);
	}

	.close {
		border-style: solid;
		border-color: var(--color-theme-2);
	}

	.exact {
		background: var(--color-theme-2);
		color: white;
	}

	.example {
		display: flex;
		justify-content: flex-start;
		margin: 1rem 0;
		gap: 0.1rem;
	}

	.example span {
		font-size: 1.1rem;
	}

	p span {
		position: relative;
		border-width: 1px;
		border-radius: 1px;
		font-size: 0.4em;
		transform: scale(2) translate(0, -10%);
		margin: 0 1em;
	}
</style>
