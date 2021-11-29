export const languagesDefaults = {
	en: {
		lang: "en",
	},
	fr: {
		lang: "fr",
	},
};
export const regions = ["us", "fr", "de", "gb", "ie", "es", "ch"];
export const currencies = [
	{ currency: "$", currency_code: "USD" },
	{ currency: "€", currency_code: "EUR" },
	{ currency: "£", currency_code: "GBP" },
	{ currency: "Fr", currency_code: "CHF" },
];
export const supportedLanguages = Object.keys(languagesDefaults);
