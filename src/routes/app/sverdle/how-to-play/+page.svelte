
<script>
	import { GradientButton } from "flowbite-svelte";
</script>
<svelte:head>
	<title>How to play Sverdle</title>
	<meta name="description" content="How to play Sverdle" />
</svelte:head>

<div class="mx-auto bg-white bg-opacity-50 w-11/12 p-1 mt-8 mb-12 pb-8 rounded-lg">
	<h1 class="text-lg font-bold">How to play Sverdle</h1>

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
</div>
<GradientButton class="noprint fixed bottom-6 right-6 md:text-xl md:p-3" type="button" pill color="pinkToOrange" on:click={() => { history.back() }}>
	<i class="bi bi-reply-fill"></i>
</GradientButton>


<style>
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
		gap: 0.2rem;
	}

	.example span {
		font-size: 1.4rem;
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
