/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}', 
		"./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}", 
	],
	theme: {
		extend: {
			colors: {
				darkish: '#282828',
				darkshine: '#151F29',
				sky: '#87CEEB',
			  },
			fontFamily: {
				raleway: ['Raleway', 'sans-serif'],
				gloria: ['Gloria Hallelujah', 'cursive'],
				butterfly: ['Butterfly', 'cursive'],
				yippy: ['Yippy Skippy', 'sans-serif'],
				semicasual: ['Semicasual', 'sans-serif'],
				informal: ['InFormal', 'sans-serif'],
				barlow: ['Barlow-Condensed', 'sans-serif'],
				pixel: ['BestTen', 'PublicPixel', 'sans-serif'],
			},
		},
		screens: {
			'xs': '375px',
			...defaultTheme.screens,
		}
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('flowbite/plugin')
	],
	darkMode: 'class',

}
