import Document, { Html, Head, Main, NextScript } from "next/document";

interface MyDocumentProps {
	__NEXT_DATA__: {
		query: {
			lang: string;
		};
	};
}

export default class MyDocument extends Document<{
	__NEXT_DATA__: {
		query: {
			lang: string;
		};
	};
}> {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}
	render() {
		const { __NEXT_DATA__ }: MyDocumentProps = this.props;
		return (
			<Html lang={__NEXT_DATA__.query.lang}>
				<Head />
				<body id="Nonce">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
