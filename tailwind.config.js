module.exports = {
	mode: "jit",
	purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			fontFamily: {
				sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
			},
			maxWidth: {
				container: "87.5rem",
			},
			height: {
				fullScreen: "100vh",
			},
			colors: {
				brand: {
					DEFAULT: "#FF0065",
				},
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
