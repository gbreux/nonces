import { useState } from "react";
import { useRouter } from "next/router";
import { useLiveQuery } from "dexie-react-hooks";

import NonceDialog from "components/Dialog/NonceDialog";
import Copy from "components/Icons/Copy";
import Link from "components/Icons/Link";
import Edit from "components/Icons/Edit";
import Button from "components/Button";
import Typography from "components/Typography";
import { stringToColour } from "lib/utils";
import { db } from "models/db";

export default function ListItem({ i18n }) {
	const [openNonceDialog, setopenNonceDialog] = useState(false);
	const [copied, setcopied] = useState("");
	const router = useRouter();

	const item = useLiveQuery(() => {
		return db?.nonce
			?.filter(({ uid }) => {
				return uid === router?.query?.id;
			})
			.toArray();
	}, [router.query.id])?.[0];

	return (
		<div className="flex flex-col overflow-auto h-screen">
			<header className="p-4 flex items-center">
				<svg width="40" viewBox="0 0 40 40">
					<rect
						width="40"
						height="40"
						rx="10"
						fill={stringToColour(item?.title || "")}
					/>
					<circle cx="7" cy="7" r="2" fill="white" />
					<circle cx="33" cy="7" r="2" fill="white" />
					<circle cx="7" cy="33" r="2" fill="white" />
					<circle cx="33" cy="33" r="2" fill="white" />
				</svg>
				<div className="ml-2">
					<Typography variant="h5" className="font-bold text-gray-900">
						{item?.title}
					</Typography>
					{Object.keys(item?.meta || {})
						.filter(
							(key) => (item?.meta[key]?.value || "")?.indexOf("http") >= 0
						)
						.map((key) => {
							return (
								<Typography key={key} variant="sp" className="text-gray-600">
									{item?.meta[key]?.value}
								</Typography>
							);
						})}
				</div>
				<Button
					className="ml-auto flex items-center text-sm"
					rounded
					small
					onClick={() => setopenNonceDialog(true)}
				>
					<Edit className="w-4 h-4 mr-2" />Edit 
				</Button>
			</header>
			<section className="px-4">
				<ul className="rounded-lg border overflow-hidden">
					{Object.keys(item?.meta || {}).map((key, index) => {
						const { value = "", secret = false } = item?.meta[key] || {};
						return (
							<li
								className="relative p-2 border-b last:border-none cursor-pointer bg-gray-600 bg-opacity-0 hover:bg-opacity-10 focus:bg-opacity-5"
								key={key}
								onClick={() => {
									navigator.clipboard.writeText(value);
									setcopied(key);
									setTimeout(() => setcopied(""), 3000);
								}}
							>
								<Typography variant="h5" className="font-bold">
									{key}
								</Typography>
								{/^http/.test(value) && !secret ? (
									<Typography
										component="a"
										variant="sp"
										className="inline-flex items-center underline hover:text-blue-600"
										href={value}
										target="_blank"
										rel="noopener noreferrer"
									>
										{value}
										<Link className="w-4 h-4 ml-1" />
									</Typography>
								) : (
									<Typography variant="sp" className="text-gray-500">
										{secret ? "••••••••" : value}
									</Typography>
								)}
								<aside className="absolute right-2 top-1/2 transform -translate-y-1/2">
									{copied === key ? (
										<Typography className=" text-green-500 font-bold">
											{i18n.copied}
										</Typography>
									) : (
										<button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 bg-opacity-0 hover:bg-opacity-10 focus:bg-opacity-5">
											<Copy className="w-5 h-5 text-gray-700" titleId={`Copy${index}`} title={`Copy ${key}`}/>
										</button>
									)}
								</aside>
							</li>
						);
					})}
				</ul>
			</section>
			<NonceDialog
				i18n={i18n.Components.NonceDialog}
				isOpen={openNonceDialog}
				close={() => setopenNonceDialog(false)}
				defaultValues={item}
				onSubmit={async (item) => {
					await db.nonce
						.where("uid")
						.equals(router.query.id || "")
						.modify({ ...item });
				}}
			/>
		</div>
	);
}
