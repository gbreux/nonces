import Head from "next/head";
import dynamic from "next/dynamic";
import Router from "next/router";
import { useEffect, useRef } from "react";

import withAuth from "hoc/withAuth";

const List = dynamic(() => import("components/List"), { ssr: false });
const ListItem = dynamic(() => import("components/ListItem"), { ssr: false });

export default withAuth(function Nonce({ i18n, db }) {
	const container = useRef<any>();

	useEffect(() => {
		const routeChangeComplete = (page: string) => {
			container.current?.scrollTo({
				left: window.innerWidth,
				behavior: "smooth",
			});
		};

		Router.events.on("routeChangeComplete", routeChangeComplete);
		return () => {
			Router.events.off("routeChangeComplete", routeChangeComplete);
		};
	}, []);

	return (
		<main
			ref={container}
			className="flex min-h-screen overflow-auto"
			style={{ scrollSnapType: "x mandatory" }}
		>
			<Head>
				<title>{i18n?.meta?.title}</title>
				<meta name="description" content={i18n?.meta?.description} />
			</Head>
			<section
				className="overflow-auto h-screen w-full max-w-xs min-w-full md:min-w-0"
				style={{ scrollSnapAlign: "center" }}
			>
				{typeof window !== "undefined" ? (
					<List db={db} i18n={i18n.Components.List} />
				) : null}
			</section>
			<section
				className="w-9/12 max-w-xl min-w-full md:min-w-0"
				style={{
					scrollSnapAlign: "center",
				}}
			>
				{typeof window !== "undefined" ? (
					<ListItem db={db} i18n={i18n.Components.ListItem} />
				) : null}
			</section>
		</main>
	);
});

export async function getServerSideProps({ params, ...rest }) {
	const i18n = await import(`public/static/i18n/${params.lang}/nonce.json`);
	return {
		props: {
			i18n: i18n.default,
			...params,
		},
	};
}
