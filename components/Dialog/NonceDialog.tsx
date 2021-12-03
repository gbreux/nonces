import { useCallback, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import { Nonce } from "models/nonce";
import Dialog from "components/Dialog";
import Button from "components/Button";
import GeneratePassword from "components/GeneratePassword";
import EyeOn from "components/Icons/EyeOn";
import EyeOff from "components/Icons/EyeOff";
import { getRandomId } from "lib/utils";
import Trash from "components/Icons/Trash";

export default function AddNonceDialog({
	isOpen,
	close,
	onSubmit,
	i18n,
	defaultValues,
}: {
	isOpen: boolean;
	close: () => void;
	onSubmit: (item: Nonce) => void;
	i18n: { [key: string]: any };
	defaultValues?: {
		uid: string;
		title: string;
		meta: {
			[key: string]: { secret?: boolean; value?: string };
		};
	};
}) {
	const defaultMeta = useMemo(
		() => [
			{
				label: i18n.labels.login,
				value: "",
				secret: false,
				hide: "••••••••",
				placeholder: "hello@gmail.com",
			},
			{
				label: i18n.labels.password,
				value: "",
				secret: true,
				hide: "••••••••",
				placeholder: i18n.placeholders.password,
			},
			{
				label: i18n.labels.website,
				value: "",
				secret: false,
				hide: "••••••••",
				placeholder: "https://",
			},
		],
		[i18n.labels, i18n.placeholders]
	);
	const { control, register, reset, handleSubmit, watch, setValue } = useForm({
		defaultValues: {
			title: "",
			meta: defaultMeta,
		},
	});
	const resetToDefault = useCallback(() => {
		const meta = Object.keys(defaultValues?.meta || {});
		reset({
			title: defaultValues?.title || "",
			meta: meta.length
				? meta.map((key) => {
						const { value = "", secret = false } =
							defaultValues?.meta?.[key] || {};
						return {
							label: key,
							value: value,
							secret: secret,
							hide: "••••••••",
							placeholder: "...",
						};
				  })
				: defaultMeta,
		});
	}, [defaultMeta, defaultValues, reset]);
	const { fields, append, remove } = useFieldArray({
		control,
		name: "meta",
	});
	const meta = watch("meta");
	const lastMeta = meta?.[meta?.length - 1];

	useEffect(() => resetToDefault(), [resetToDefault]);

	useEffect(() => {
		if (lastMeta?.label || lastMeta?.value) {
			let currentActive = document.activeElement;
			append([
				{
					label: "",
					value: "",
					placeholder: i18n.placeholders.other,
				},
			]);
			setTimeout(() => {
				(currentActive as HTMLElement)?.focus();
			});
		}
	}, [append, i18n.placeholders.other, lastMeta?.label, lastMeta?.value]);

	return (
		<Dialog isOpen={isOpen} close={close}>
			<form data-rel="add-nonce-dialog-form" onSubmit={handleSubmit(submit)}>
				<div className="pr-10">
					<input
						autoFocus
						className=" p-2 font-bold text-3xl md:text-4xl w-full mb-4 rounded-md outline-none bg-transparent hover:bg-gray-100 focus:bg-gray-100"
						placeholder={i18n.placeholders.title}
						{...register("title")}
					/>
				</div>
				{fields.map((field, index) => {
					return (
						<div
							className="flex justify-between items-center border p-2 mb-4 rounded-md outline-none hover:bg-gray-50 focus:bg-gray-50"
							key={field.id}
						>
							<div className="flex flex-col w-full">
								<input
									className="p-1 text-sm text-gray-500 rounded-md outline-none bg-transparent hover:bg-gray-100 focus:bg-gray-100"
									placeholder={i18n.labels.other}
									autoComplete="off"
									{...register(`meta.${index}.label`)}
								/>
								<div className="relative rounded-md bg-transparent hover:bg-gray-100">
									<input
										tabIndex={-1}
										className={`p-1 w-full absolute left-0 top-0 bg-transparent font-mono ${
											meta[index].secret &&
											meta[index].hide &&
											meta[index].value
												? "pointer-events-none"
												: "hidden"
										}`}
										{...register(`meta.${index}.hide`)}
									/>
									<input
										className={`p-1 w-full rounded-md outline-none bg-transparent hover:bg-gray-100 focus:bg-gray-100 ${
											meta[index].secret &&
											meta[index].hide &&
											meta[index].value
												? "opacity-0"
												: ""
										}`}
										autoComplete="off"
										placeholder={meta[index].placeholder}
										onFocus={() => setValue(`meta.${index}.hide`, "")}
										{...register(`meta.${index}.value`, {
											onBlur: () => setValue(`meta.${index}.hide`, "••••••••"),
										})}
									/>
								</div>
							</div>
							<aside className="flex space-x-2 items-center pl-2">
								<label className="text-gray-600 cursor-pointer w-10 h-10 flex items-center justify-center focus-within:outline-black rounded-full bg-transparent hover:bg-gray-100 focus-within:bg-gray-100">
									<input
										className="absolute opacity-0"
										type="checkbox"
										onKeyPress={(e) => {
											e.preventDefault();
										}}
										{...register(`meta.${index}.secret`, {
											onChange: (e) => {
												setValue(
													`meta.${index}.hide`,
													e.target.checked ? "••••••••" : ""
												);
											},
										})}
									/>
									{meta[index].secret ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<EyeOn className="w-5 h-5" />
									)}
								</label>
								<GeneratePassword
									i18n={i18n.Components.GeneratePassword}
									defaultValue={meta[index].value || ""}
									onClose={() => {
										setValue(`meta.${index}.hide`, "••••••••");
									}}
									onSelect={(val) => {
										setValue(`meta.${index}.value`, val || "");
										setValue(`meta.${index}.hide`, "");
										setValue(`meta.${index}.secret`, true);
									}}
								/>
								<button
									className="text-gray-600 cursor-pointer w-10 h-10 flex items-center justify-center focus:outline-black rounded-full bg-transparent hover:bg-gray-100 focus:bg-gray-100"
									type="button"
									onClick={() => {
										remove(index);
									}}
								>
									<Trash className="w-5 h-5" />
								</button>
							</aside>
						</div>
					);
				})}
				<footer className="flex justify-between mt-12">
					<div className="space-x-4">
						<Button
							type="button"
							onClick={() => {
								close();
								resetToDefault();
							}}
						>
							{i18n.cancel}
						</Button>
						<Button
							ghost
							type="button"
							onClick={() => {
								resetToDefault();
							}}
						>
							{i18n.reset}
						</Button>
					</div>
					<Button>{i18n.submit}</Button>
				</footer>
			</form>
		</Dialog>
	);
	async function submit({ title, meta }) {
		const newMeta = {};
		meta.forEach((i: { label: string; value: string; secret: boolean }) => {
			if (i.value) {
				newMeta[i.label || getRandomId()] = {
					secret: i.secret,
					value: i.value,
				};
			}
		});
		onSubmit({
			uid: defaultValues?.uid || getRandomId(),
			title,
			meta: newMeta,
		});
		close();
		reset();
	}
}
