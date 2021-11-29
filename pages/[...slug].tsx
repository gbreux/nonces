import { supportedLanguages } from "public/static/languages";

export default function DefaultRoute() {
	return <>qsdf</>;
}

export async function getServerSideProps({ req }) {
	const urlLang = req.url.split("/")[1];
	const isValidLang = supportedLanguages.indexOf(urlLang) >= 0;
	const lang =
		req.headers?.["accept-language"].split(",")[0].substring(0, 2) || "en";

	if (isValidLang) {
		console.log(urlLang, req.url, req.url.split("/")[1], supportedLanguages);
		return {
			redirect: {
				statusCode: 307,
				destination: `/${lang}/nonce`,
			},
		};
	} else {
		return {
			redirect: {
				statusCode: 307,
				destination: `/${lang}${req.url}`,
			},
		};
	}
}
