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
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('flowbite/plugin')
	],
	darkMode: 'class',

}
