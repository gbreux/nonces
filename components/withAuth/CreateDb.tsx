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
					<button type="button" onClick={() => onBack()}>
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
				<Button>{i18n.create}</Button>
			</footer>
		</form>
	);
}
