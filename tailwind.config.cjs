/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				'Roboto': 'Roboto, sans-serif',
				'Trebuchet': '"Trebuchet MS", serif',
				'Georgia' : 'Georgia, sans-serif'
			},
			colors: {
				'purple': {
					primary: '#582C83',
					secondary: '#8d30ee',
					darker: '#371E51',
					darkest: '#251338',
				},
				
				yellow: {
					primary:'#FECD01',
					darker: '#c9a200',
				},
				'lavender': '#EADEF7',
			},
			backgroundImage: {
				'raising-the-stakes': "url('/images/raising-the-stakes.png')"
			}
		},
	},
	plugins: [],
}
