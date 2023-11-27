/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				'Roboto': 'Roboto, sans-serif',
				'Trebuchet': '"Trebuchet MS", sans-serif',
				'Eras': ''
			},
			colors: {
				'honey-flower': {
					'50': '#faf6fe',
					'100': '#f2ebfc',
					'200': '#e7dafa',
					'300': '#d5bdf5',
					'400': '#bb93ed',
					'500': '#a169e3',
					'600': '#8a49d4',
					'700': '#7637b9',
					'800': '#633198',
					'900': '#582c83',
					'950': '#361259',
				},				
				'supernova': {
					'50': '#fffee7',
					'100': '#fffec1',
					'200': '#fff986',
					'300': '#ffed41',
					'400': '#ffdc0e',
					'500': '#fecd01',
					'600': '#d09600',
					'700': '#a66b02',
					'800': '#89530a',
					'900': '#74440f',
					'950': '#442304',
				},
				'lavender': '#EADEF7',
			},
			backgroundImage: {
				'raising-the-stakes': "url('/images/raising-the-stakes.png')"
			}
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
