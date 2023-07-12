/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				'Roboto': 'Roboto, sans-serif',
				'Verdana': 'Verdana, serif',
				'Trebuchet': '"Trebuchet MS", serif',
				'EngraversMT': '"Engravers MT", sans-serif'
			},
			colors: {
				'purple': {
					primary: '#582C83',
					secondary: '#8d30ee',
					darker: '#371E51',
					darkest: '#251338',
				},
				'yellow': '#FECD01',
				'lavender': '#EADEF7',
				'white': '#ffffff',
				'black': '#000000'
			}
		},
	},
	plugins: [],
}
