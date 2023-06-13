import { Game, simplifiedWordList } from './game';

import type { RequestEvent } from '../$types';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
//@ts-nocheck
export const load = async ({ cookies, request, locals: {supabase, getSession}}: RequestEvent) => {

	const { user } = await getSession();
	const game = new Game(cookies.get('sverdle'));

	const wordId = new URL(request.url).searchParams.get('word');


	if(wordId) {
		const {data:wordItem, error} = await supabase.from('vocabulary').
												select('*')
												.eq('id', new URL(request.url).searchParams.get('word')).single();
		if(wordItem) game.overrideAnswer(wordItem.word);
	}

	return {
		simplifiedWordList,
		user,
		/**
		 * The player's guessed words so far
		 */
		guesses: game.guesses,

		/**
		 * An array of strings like '__x_c' corresponding to the guesses, where 'x' means
		 * an exact match, and 'c' means a close match (right letter, wrong place)
		 */
		answers: game.answers,

		/**
		 * The correct answer, revealed if the game is over
		 */
		answer: game.answers.length >= 6 ? game.answer : null,
		
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	/**
	 * Modify game state in reaction to a keypress. If client-side JavaScript
	 * is available, this will happen in the browser instead of here
	 */
	update: async ({ request, cookies }: RequestEvent) => {
		console.log('UPDATE');

		const game = new Game(cookies.get('sverdle'));
		console.log(cookies.get('sverdle'),game);

		const data = await request.formData();
		const key = data.get('key');

		const i = game.answers.length;

		if (key === 'backspace') {
			game.guesses[i] = game.guesses[i].slice(0, -1);
		} else {
			game.guesses[i] += key;
		}

		cookies.set('sverdle', game.toString());
	},

	/**
	 * Modify game state in reaction to a guessed word. This logic always runs on
	 * the server, so that people can't cheat by peeking at the JavaScript
	 */
	enter: async ({ request, cookies }: RequestEvent) => {

		console.log('ENTER');

		const game = new Game(cookies.get('sverdle'));
		console.log(cookies.get('sverdle'), game);

		const data = await request.formData();
		const guess = /** @type {string[]} */ (data.getAll('guess'));

		if (!game.enter(guess as string[])) {
			return fail(400, { badGuess: true });
		}

		cookies.set('sverdle', game.toString());
	},

	restart: async ({ cookies }: RequestEvent) => {
		console.log('restartings');
		cookies.delete('sverdle');
	},

	retry: async ({ cookies }: RequestEvent) => {
		console.log('restartings');
		cookies.delete('sverdle');
	}
};
