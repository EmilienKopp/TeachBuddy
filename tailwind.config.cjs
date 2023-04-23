/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
			colors: {
				darkish: '#282828',
			  },
		},
	},
	plugins: [require('@tailwindcss/forms'),require('@tailwindcss/typography'),...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()],
}
