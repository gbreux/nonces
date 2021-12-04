import { useForm } from "react-hook-form";

import Typography from "components/Typography";
import Button from "components/Button";
import SvgBack from "components/Icons/ArrowLeft";

export default function Credential({ onBack, name, error, onLogin, i18n }) {
	const { register, handleSubmit } = useForm({
		defaultValues: {
			password: "",
		},
	});

	return (
		<section>
			<header className="mb-7 space-x-4 flex items-center">
				{onBack ? (
					<button onClick={() => onBack()}>
						<SvgBack className="w-7 h-7" />
					</button>
				) : null}
				<Typography variant="h1">
					{i18n.title.replace("{name}", name)}
				</Typography>
			</header>
			<form onSubmit={handleSubmit(login)}>
				<div className="mb-7">
					<Typography variant="h4" className="font-bold">
						{i18n.labels.password}
					</Typography>
					{error ? (
						<Typography variant="sp" className="text-red-500 mb-2">
							{i18n.errors[error]}
						</Typography>
					) : null}
					<input
						className="w-full rounded-md p-2 bg-gray-200"
						type="password"
						autoFocus
						{...register("password", { required: true })}
					/>
				</div>
				<footer>
					<Button>{i18n.login}</Button>
				</footer>
			</form>
		</section>
	);
	function login({ password }) {
		onLogin({
			name,
			password,
		});
	}
}
