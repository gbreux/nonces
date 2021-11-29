import Head from "next/head";
import dynamic from "next/dynamic";

const List = dynamic(() => import("components/List"), { ssr: false });

export default function NonceHome({ i18n }) {
	return (
		<main className="flex space-x-4 min-h-screen">
			<Head>
				<title>Nonces</title>
			</Head>
			<section className="w-3/12 overflow-auto h-screen">
				{typeof window !== "undefined" ? (
					<List i18n={i18n.Components.List} />
				) : null}
			</section>
		</main>
	);
}

export async function getStaticProps({ params }) {
	const i18n = await import(`public/static/i18n/${params.lang}/nonce.json`);
	return {
		props: {
			i18n: i18n.default,
			lang: params.lang,
		},
	};
}

export { getStaticPaths } from "lib/nextjs";