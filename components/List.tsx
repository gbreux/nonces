import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "models/db";
import Typography from "components/Typography";
import Link from "components/Link";
import Trash from "components/Icons/Trash";
import NonceDialog from "components/Dialog/NonceDialog";
import { goToRoute, stringToColour } from "lib/utils";

export default function List({ i18n }) {
	const router = useRouter();
	const [search, setsearch] = useState("");
	const [openModal, setopenModal] = useState(false);

	const items = useLiveQuery(() => {
		if (search) {
			return db?.nonce
				?.filter(({ title, meta }) => {
					return (
						title.toLowerCase().indexOf(search) >= 0 ||
						Object.keys(meta).filter((key) => {
							return (
								!meta[key]?.secret &&
								meta[key]?.value?.toLowerCase().indexOf(search) >= 0
							);
						}).length > 0
					);
				})
				?.toArray();
		} else {
			return db?.nonce?.orderBy("title")?.toArray();
		}
	}, [search]);

	useEffect(() => {
		const $active = document.querySelector(`[href="${router.asPath}"]`);
		if ($active && !isElementInViewport($active)) {
			$active?.scrollIntoView({ block: "center" });
		}
	}, [router.asPath]);

	useEffect(() => {
		console.log(items?.length)
		if (items && !items?.length) {
			setopenModal(true);
		}
	}, [items?.length]);

	return (
		<div className="flex flex-col overflow-auto h-screen">
			<form className="p-4 sticky top-0 bg-white">
				<input
					className="rounded-lg bg-gray-200 focus:bg-gray-100 w-full py-2 px-4 focus:outline-none"
					placeholder="i.e Google"
					onChange={(e) => {
						setsearch(e.target.value);
					}}
				/>
			</form>
			<ul className="pl-2 pr-4 space-y-1">
				{items?.map(({ title, uid, id, meta }) => {
					const path = `/[lang]/nonce/[id]`;
					const value = meta[Object.keys(meta)[0]]?.value;
					return (
						<li key={id}>
							<Link href={path} params={{ id: uid }}>
								<a
									className={`group p-2 hover:bg-gray-100 rounded-md flex items-center ${
										router.query.id == uid ? "bg-gray-100" : ""
									}`}
								>
									<svg width="40" viewBox="0 0 40 40">
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
										<Typography variant="h5" className="font-bold">
											{title}
										</Typography>
										<Typography variant="sp" className="text-gray-500">
											{value}
										</Typography>
									</div>
									<button
										className={`ml-auto w-10 h-10 rounded-full items-center text-gray-700 justify-center hover:bg-gray-200 ${
											router.query.id == uid
												? "flex"
												: "hidden group-hover:flex"
										}`}
										onClick={() => {
											db.nonce
												.where("uid")
												.equals(uid)
												.delete()
												.then(() => {
													goToRoute("/[lang]/nonce", router.query.lang);
												});
										}}
									>
										<Trash className="w-5 h-5" />
									</button>
								</a>
							</Link>
						</li>
					);
				})}
			</ul>
			<footer className="bg-white sticky bottom-0 p-4 mt-auto">
				<button
					className="flex w-full justify-center rounded-lg p-2 bg-blue-400 hover:bg-blue-500"
					onClick={() => setopenModal(true)}
				>
					{i18n.cta}
				</button>
				<NonceDialog
					i18n={i18n.Components.NonceDialog}
					isOpen={openModal}
					close={() => setopenModal(false)}
					onSubmit={(item) => {
						db.nonce.add(item);
						goToRoute("/[lang]/nonce/[id]", router.query.lang, {
							id: item.uid,
						});
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
