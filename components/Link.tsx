import React, { Children } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { routeWithParams } from "lib/utils";

export default function CustomLink({ href, params = {}, children }: any) {
	const { query } = useRouter();
	const url = routeWithParams(href, { lang: query.lang, ...params });
	return (
		<Link href={url} passHref>
			{children}
		</Link>
	);
}
