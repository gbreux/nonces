import { supportedLanguages } from "public/static/languages";

export async function getStaticPaths() {
	const paths = supportedLanguages.map((lang) => ({ params: { lang } }));
	return {
		paths,
		fallback: false,
	};
}
