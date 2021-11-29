import Head from "next/head";

export default function Home({ i18n }) {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<Head>
				<title>{i18n.meta.title}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
		</div>
	);
}

export async function getStaticProps({ params }) {
	const i18n = await import(`public/static/i18n/${params.lang}/home.json`);
	return {
		props: {
			i18n: i18n.default,
			lang: params.lang,
		},
	};
}

export { getStaticPaths } from "lib/nextjs";
