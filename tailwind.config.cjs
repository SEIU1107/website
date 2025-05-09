/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        Roboto: "Roboto, sans-serif",
        Trebuchet: '"Trebuchet MS", sans-serif',
        Eras: "",
      },
      colors: {
        "honey-flower": {
          50: "#faf6fe",
          100: "#f2ebfc",
          200: "#e7dafa",
          300: "#d5bdf5",
          400: "#bb93ed",
          500: "#a169e3",
          600: "#8a49d4",
          700: "#7637b9",
          800: "#633198",
          900: "#582c83",
          950: "#361259",
        },
        supernova: {
          50: "#fffee7",
          100: "#fffec1",
          200: "#fff986",
          300: "#ffee41",
          400: "#ffdd0d",
          500: "#ffce00",
          600: "#d19700",
          700: "#a66b02",
          800: "#89540a",
          900: "#74440f",
          950: "#442304",
        },
        "big-stone": {
          50: "#f2f9fd",
          100: "#e3f0fb",
          200: "#c1e2f6",
          300: "#8acaef",
          400: "#4bb0e5",
          500: "#2496d3",
          600: "#1678b3",
          700: "#135f91",
          800: "#145178",
          900: "#164464",
          950: "#0e2a40",
        },
        lavender: "#EADEF7",
      },
      backgroundImage: {
        "raising-the-stakes": "url('/images/raising-the-stakes.png')",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("flowbite/plugin")],
};
