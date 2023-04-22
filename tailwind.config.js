/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    require('path').join(require.resolve(
      '@skeletonlabs/skeleton'),
      '../**/*.{html,js,svelte,ts}'
    )
  ],
  theme: {
    extend: {
      colors: {
        darkish: '#282828',
      },
    },
  },
  plugins: [
    require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')(),
  ],
}

