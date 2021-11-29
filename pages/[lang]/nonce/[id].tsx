import Head from "next/head";
import dynamic from "next/dynamic";

const List = dynamic(() => import("components/List"), { ssr: false });
const ListItem = dynamic(() => import("components/ListItem"), { ssr: false });

export default function Nonce({ i18n }) {
	return (
		<main className="flex min-h-screen">
			<Head>
				<title>{i18n?.meta?.title}</title>
			</Head>
			<section className="w-3/12 overflow-auto h-screen">
				{typeof window !== "undefined" ? (
					<List i18n={i18n.Components.List} />
				) : null}
			</section>
			<section className="w-4/12">
				{typeof window !== "undefined" ? <ListItem i18n={i18n.Components.ListItem} /> : null}
			</section>
			<section className="w-5/12"></section>
		</main>
	);
}

export async function getServerSideProps({ params }) {
	const i18n = await import(`public/static/i18n/${params.lang}/nonce.json`);
	return {
		props: {
			i18n: i18n.default,
			...params,
		},
	};
}
