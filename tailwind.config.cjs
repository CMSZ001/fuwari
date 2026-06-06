/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
	darkMode: "class", // allows toggling dark mode manually
	theme: {
		extend: {
			fontFamily: {
				sans: [
					"var(--font-inter)",
					"system-ui",
					"-apple-system",
					"BlinkMacSystemFont",
					"sans-serif",
					...defaultTheme.fontFamily.sans,
				],
				code: [
					"var(--font-cascadia)",
					"monospace",
					...defaultTheme.fontFamily.mono,
				],
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
