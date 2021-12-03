import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Typography from "components/Typography";
import Button from "components/Button";
import SvgCopy from "components/Icons/Copy";
import SvgBack from "components/Icons/ArrowLeft";
import { getMnemonic } from "lib/utils";

export default function AddDb({ createDb, onBack, i18n }) {
	const [copied, setcopied] = useState("");
	const { register, handleSubmit, reset, watch, setValue } = useForm({
		defaultValues: {
			title: "",
			password: "",
			secret: "",
		},
	});
	const { secret } = watch();

	useEffect(() => {
		reset({ secret: getMnemonic() });
	}, [reset]);

	return (
		<form onSubmit={handleSubmit(createDb)}>
			<header className="mb-7 space-x-4 flex items-center">
				{onBack ? (
					<button onClick={() => onBack()}>
						<SvgBack className="w-7 h-7" />
					</button>
				) : null}
				<Typography variant="h1">{i18n.title}</Typography>
			</header>
			<div className="mb-2">
				<Typography variant="h4" className="font-bold">
					{i18n.labels.name}
				</Typography>
				<Typography className="mb-2">{i18n.placeholders.name}</Typography>
				<input
					className="w-full rounded-md p-2 bg-gray-200"
					{...register("title", { required: true })}
				/>
			</div>
			<div className="mb-2">
				<Typography variant="h4" className="font-bold">
					{i18n.labels.secret}
				</Typography>
				<Typography className="mb-2">{i18n.placeholders.secret}</Typography>
				<div className="flex space-x-2">
					<div
						className="w-full relative whitespace-nowrap overflow-hidden overflow-ellipsis p-2 pr-10 rounded-md last:border-none cursor-pointer bg-gray-200 hover:bg-gray-300"
						onClick={() => {
							navigator.clipboard.writeText(secret);
							setcopied("mnemonic");
							setTimeout(() => setcopied(""), 3000);
						}}
					>
						{secret}
						<aside className="absolute flex items-center right-0 top-0 bottom-0">
							{copied === "mnemonic" ? (
								<Typography
									variant="sp"
									className=" text-green-500 font-bold px-2 bg-gray-200 h-full flex items-center"
								>
									{i18n.copied}
								</Typography>
							) : (
								<button
									type="button"
									className="w-10 h-full flex items-center justify-center hover:bg-gray-200 focus:bg-gray-200"
								>
									<SvgCopy
										className="w-5 h-full text-gray-700"
										titleId={`Copy`}
										title={`Copy secret`}
									/>
								</button>
							)}
						</aside>
					</div>
					<Button
						type="button"
						onClick={() => {
							setValue("secret", getMnemonic());
						}}
					>
						{i18n.change}
					</Button>
				</div>
			</div>
			<div className="mb-7">
				<Typography variant="h4" className="font-bold">
					{i18n.labels.password}
				</Typography>
				<Typography className="mb-2">{i18n.placeholders.password}</Typography>
				<input
					className="w-full rounded-md p-2 bg-gray-200"
					type="password"
					{...register("password")}
				/>
			</div>
			<footer>
				<Button onClick={() => {}}>{i18n.create}</Button>
			</footer>
		</form>
	);
}
