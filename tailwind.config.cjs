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
