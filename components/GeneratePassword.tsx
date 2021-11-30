import { useState, useEffect, useCallback } from "react";
import { customAlphabet } from "nanoid";
import { useForm } from "react-hook-form";

import Lightning from "components/Icons/Lightning";
import { getPasswordStrength } from "lib/utils";
import Button from "components/Button";

const alphabet = "abcdefghijklmlnopqrsuvwxyz";
const number = "0123456789";
const special = `@&é"'(§è!çà)-{}[]°_#`;
const defaultPreferences = {
	size: 21,
	number: true,
	uppercase: true,
	special: true,
};

export default function GeneratePassword({
	onSelect,
	onClose,
	defaultValue,
	i18n,
}: {
	onSelect: (pass: string) => void;
	onClose: () => void;
	defaultValue: string;
	i18n: { [key: string]: any };
}) {
	const { register, watch } = useForm({
		defaultValues: defaultPreferences,
	});
	const nanoid = useCallback((p = defaultPreferences) => {
		const custom = `${p.alphabet}${p.number ? number : ""}${
			p.uppercase ? alphabet.toUpperCase() : ""
		}${p.special ? special : ""}`;
		return customAlphabet(custom || "abc", +p.size);
	}, []);
	const [pass, setpass] = useState(defaultValue || nanoid());
	const [isOpen, setisOpen] = useState(false);
	const strength = getPasswordStrength(pass);

	const preferences = watch();
	useEffect(() => {
		setpass(nanoid(preferences)());
	}, [
		preferences.size,
		preferences.number,
		preferences.special,
		preferences.uppercase,
	]);

	useEffect(() => {
		if (!isOpen) {
			onClose();
		}
	}, [isOpen]);

	useEffect(() => {
		if (isOpen) {
			onSelect(defaultValue || pass);
			window.addEventListener("click", handleOutsideClick);
		}
		return () => {
			window.removeEventListener("click", handleOutsideClick);
		};
		function handleOutsideClick(e) {
			if (!e.target.closest('[data-rel="generate-password"]')) {
				setisOpen(false);
			}
		}
	}, [isOpen, pass]);

	return (
		<article className="relative">
			<button
				type="button"
				className="text-gray-700 w-10 h-10 flex items-center justify-center bg-opacity-0 focus:outline-black bg-gray-800 hover:bg-opacity-5 focus:bg-opacity-5 rounded-full"
				onClick={() => setisOpen((isOpen) => !isOpen)}
			>
				<Lightning className="w-5 h-5" />
			</button>
			{isOpen ? (
				<aside
					data-rel="generate-password"
					className="bg-white bg-opacity-100 shadow-xl p-4 rounded-lg absolute z-10 top-full right-0 w-screen max-w-md"
				>
					<header
						className={`relative bg-gray-800 text-center p-4 flex items-center justify-center rounded-lg font-bold tracking-widest break-all text-sm mb-4 ${
							/strong/.test(strength)
								? "text-green-500"
								: /medium/.test(strength)
								? "text-yellow-500"
								: "text-red-500"
						}`}
						style={{ minHeight: 72 }}
					>
						{pass}
						<span className="absolute bottom-1 right-1 text-xs">
							{pass.length}
						</span>
					</header>
					<section className="space-y-2">
						<input
							className="w-full focus:outline-black rounded-full"
							style={{ cursor: "grab" }}
							type="range"
							min={3}
							max={64}
							defaultValue={pass.length}
							{...register("size")}
						/>
						<label className="flex items-center cursor-pointer">
							<input type="checkbox" {...register("uppercase")} />
							<span className="inline-flex ml-2">{i18n.uppercase}</span>
						</label>
						<label className="flex items-center cursor-pointer">
							<input type="checkbox" {...register("number")} />
							<span className="inline-flex ml-2">{i18n.number}</span>
						</label>
						<label className="flex items-center cursor-pointer">
							<input type="checkbox" {...register("special")} />
							<span className="inline-flex ml-2">{i18n.special}</span>
						</label>
					</section>
					<footer className="flex items-center mt-6">
						<Button
							ghost
							className="w-1/2"
							small
							type="button"
							onClick={() => {
								setpass(nanoid(preferences)());
							}}
						>
							{i18n.regen}
						</Button>
						<Button
							type="button"
							className="w-1/2"
							small
							onClick={() => {
								onSelect(pass);
								setisOpen(false);
							}}
						>
							{i18n.validate}
						</Button>
					</footer>
				</aside>
			) : null}
		</article>
	);
}
