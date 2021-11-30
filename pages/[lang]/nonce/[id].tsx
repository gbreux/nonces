import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const List = dynamic(() => import("components/List"), { ssr: false });
const ListItem = dynamic(() => import("components/ListItem"), { ssr: false });

export default function Nonce({ i18n }) {
	const container = useRef<any>();

	useEffect(() => {
		container.current?.scrollTo(window.innerWidth, 0);
	}, [container.current]);

	return (
		<main
			ref={container}
			className="flex min-h-screen overflow-auto"
			style={{ scrollSnapType: "x mandatory" }}
		>
			<Head>
				<title>{i18n?.meta?.title}</title>
			</Head>
			<section
				className="overflow-auto h-screen w-full max-w-xs min-w-full md:min-w-0"
				style={{ scrollSnapAlign: "center" }}
			>
				{typeof window !== "undefined" ? (
					<List i18n={i18n.Components.List} />
				) : null}
			</section>
			<section
				className="w-9/12 max-w-xl min-w-full md:min-w-0"
				style={{
					scrollSnapAlign: "center",
				}}
			>
				{typeof window !== "undefined" ? (
					<ListItem i18n={i18n.Components.ListItem} />
				) : null}
			</section>
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
