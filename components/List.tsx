import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLiveQuery } from "dexie-react-hooks";

import Typography from "components/Typography";
import Button from "components/Button";
import Link from "components/Link";
import Trash from "components/Icons/Trash";
import NonceDialog from "components/Dialog/NonceDialog";
import { goToRoute, stringToColour } from "lib/utils";
import GlobalLink from "./GlobalLink";

export default function List({ i18n, db }) {
	const router = useRouter();
	const [search, setsearch] = useState("");
	const [openModal, setopenModal] = useState(false);
	const items = useLiveQuery(async () => {
		const result = await db?.nonce?.toArray();
		if (search) {
			const searchResult = result.filter(({ title, meta }) => {
				if (meta) {
					return (
						title.toLowerCase().indexOf(search) >= 0 ||
						Object.keys(meta).filter((key) => {
							return (
								!meta[key]?.secret &&
								meta[key]?.value?.toLowerCase().indexOf(search) >= 0
							);
						}).length > 0
					);
				} else {
					return [];
				}
			});
			return [...(searchResult || [])];
		} else {
			return [...(result || [])].filter(({ meta }) => !!meta);
		}
	}, [search]);

	useEffect(() => {
		const $active = document.querySelector(`[href="${router.asPath}"]`);
		if ($active && !isElementInViewport($active)) {
			$active?.scrollIntoView({ block: "center" });
		}
	}, [router.asPath]);

	useEffect(() => {
		if (items && !items?.length) {
			setopenModal(true);
		}
	}, [items]);

	return (
		<div className="flex flex-col overflow-auto h-screen md:border-r">
			<form className="p-4 sticky top-0 bg-gray-100 border-b ">
				<input
					className="rounded-lg bg-white border w-full py-2 px-4 focus:outline-none"
					placeholder="i.e Google"
					onChange={(e) => {
						setsearch(e.target.value);
					}}
				/>
			</form>
			<ul className="p-4 space-y-1">
				{items?.map(({ title, uid, meta }) => {
					const path = `/[lang]/nonce?id=${uid}`;
					const value = Object.keys(meta || {})
						.filter((key) => !meta?.[key].secret)
						.map((key) => meta[key])[0]?.value;
					return (
						<li
							className={`relative group p-2 hover:bg-gray-100 rounded-md flex items-center focus-within:bg-gray-100 ${
								router.query.id == uid ? "bg-gray-100" : ""
							}`}
							key={uid}
						>
							<svg width="40" viewBox="0 0 40 40" style={{ minWidth: 40 }}>
								<rect
									width="40"
									height="40"
									rx="10"
									fill={stringToColour(title)}
								/>
								<circle cx="7" cy="7" r="2" fill="white" />
								<circle cx="33" cy="7" r="2" fill="white" />
								<circle cx="7" cy="33" r="2" fill="white" />
								<circle cx="33" cy="33" r="2" fill="white" />
							</svg>
							<div className="ml-2">
								<Link href={path}>
									<GlobalLink hideFocus>
										<Typography variant="h5" className="font-bold">
											{title}
										</Typography>
									</GlobalLink>
								</Link>
								<Typography variant="sp" className="text-gray-600">
									{value}
								</Typography>
							</div>
							<button
								className={`relative z-10 ml-auto w-10 h-10 rounded-full items-center text-gray-700 justify-center hover:bg-gray-200 ${
									router.query.id == uid ? "flex" : "hidden group-hover:flex"
								}`}
								onClick={() => {
									if (router.query.id === uid) {
										goToRoute("/[lang]/nonce", router.query.lang);
									}
									db.nonce.where("uid").equals(uid).delete();
								}}
							>
								<Trash className="w-5 h-5" />
							</button>
						</li>
					);
				})}
			</ul>
			<footer className="bg-white sticky bottom-0 p-4 mt-auto">
				<Button className="w-full" onClick={() => setopenModal(true)}>
					{i18n.cta}
				</Button>
				<NonceDialog
					i18n={i18n.Components.NonceDialog}
					isOpen={openModal}
					close={() => setopenModal(false)}
					onSubmit={(item) => {
						db.nonce.add({ ...item });
						goToRoute(`/[lang]/nonce?id=${item.uid}`, router.query.lang);
					}}
				/>
			</footer>
		</div>
	);
}

function isElementInViewport(el) {
	var rect = el.getBoundingClientRect();

	return (
		rect.bottom > 0 &&
		rect.right > 0 &&
		rect.left <
			(window.innerWidth ||
				document.documentElement.clientWidth) /* or $(window).width() */ &&
		rect.top <
			(window.innerHeight ||
				document.documentElement.clientHeight) /* or $(window).height() */
	);
}
