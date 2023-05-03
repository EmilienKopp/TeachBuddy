/** @type {import('tailwindcss').Config} */
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
			  },
			fontFamily: {
				raleway: ['Raleway', 'sans-serif'],
				gloria: ['Gloria Hallelujah', 'cursive'],
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('flowbite/plugin')
	],
	darkMode: 'class',

}
