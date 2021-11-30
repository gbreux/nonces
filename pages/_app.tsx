import Head from "next/head";
import { useEffect } from "react";
import { setAppElement } from "react-modal";

import "public/styles/global.css";

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		setAppElement("#Nonce");
	});

	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
