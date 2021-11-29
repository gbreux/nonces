import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { nanoid } from "nanoid";

import { Nonce } from "models/nonce";
import Dialog from "components/Dialog";
import Button from "components/Button";
import { getRandomId } from "lib/utils";
import EyeOn from "components/Icons/EyeOn";
import EyeOff from "components/Icons/EyeOff";

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
	const { control, register, reset, handleSubmit, watch, setValue } = useForm({
		defaultValues: {
			title: "",
			item: [
				{
					label: i18n.labels.login,
					value: "",
					secret: false,
					hide: "••••••••",
					placeholder: "hello@gmail.com",
				},
				{
					label: i18n.labels.password,
					value: nanoid(),
					secret: true,
					hide: "••••••••",
				},
				{
					label: i18n.labels.website,
					value: "",
					secret: false,
					hide: "••••••••",
					placeholder: "https://",
				},
			],
		},
	});
	const { fields, append } = useFieldArray({
		control,
		name: "item",
	});
	const item = watch("item");
	const lastItem = item?.[item?.length - 1];

	useEffect(() => {
		if (defaultValues) {
			reset({
				title: defaultValues.title || "",
				item: Object.keys(defaultValues.meta).map((key) => {
					const item = defaultValues.meta[key];
					return {
						label: key,
						value: item.value || "",
						secret: item.secret || false,
						hide: "••••••••",
						placeholder: "...",
					};
				}),
			});
		}
	}, [defaultValues]);

	useEffect(() => {
		if (lastItem.label || lastItem.value) {
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
	}, [lastItem.label, lastItem.value]);

	return (
		<Dialog isOpen={isOpen} close={close}>
			<form data-rel="add-nonce-dialog-form" onSubmit={handleSubmit(submit)}>
				<input
					className=" p-2 font-black text-3xl md:text-4xl w-full mb-4 rounded-md outline-none bg-gray-900 bg-opacity-0 hover:bg-opacity-5 focus:bg-opacity-5"
					placeholder={i18n.placeholders.title}
					{...register("title")}
				/>
				{fields.map((field, index) => {
					return (
						<fieldset
							className="relative flex flex-col border p-2 mb-4 pr-14 rounded-md outline-none bg-gray-900 bg-opacity-0 hover:bg-opacity-5 focus:bg-opacity-5"
							key={field.id}
						>
							<input
								className="p-1 text-sm text-gray-500 rounded-md outline-none bg-gray-900 bg-opacity-0 hover:bg-opacity-5 focus:bg-opacity-5"
								placeholder="Other"
								autoComplete="off"
								{...register(`item.${index}.label`)}
							/>
							<div className="relative rounded-md bg-gray-900 bg-opacity-0 hover:bg-opacity-5">
								<input
									tabIndex={-1}
									className={`p-1 w-full absolute left-0 top-0 bg-transparent font-mono ${
										item[index].secret && item[index].hide && item[index].value
											? "pointer-events-none"
											: "hidden"
									}`}
									{...register(`item.${index}.hide`)}
								/>
								<input
									className={`p-1 w-full rounded-md outline-none bg-transparent bg-opacity-0 ${
										item[index].secret && item[index].hide && item[index].value
											? "opacity-0"
											: ""
									}`}
									autoComplete="off"
									placeholder={item[index].placeholder}
									onFocus={() => setValue(`item.${index}.hide`, "")}
									{...register(`item.${index}.value`, {
										onBlur: () => setValue(`item.${index}.hide`, "••••••••"),
									})}
								/>
							</div>
							<label className="absolute text-gray-600 top-1/2 transform -translate-y-1/2 cursor-pointer right-4 w-8 h-8 flex items-center justify-center rounded-full outline-none bg-gray-900 bg-opacity-0 hover:bg-opacity-5 focus-within:bg-opacity-5">
								<input
									className="absolute w-0 h-0"
									type="checkbox"
									onKeyPress={(e) => {
										e.preventDefault();
									}}
									{...register(`item.${index}.secret`, {
										onChange: (e) => {
											setValue(
												`item.${index}.hide`,
												e.target.checked ? "••••••••" : ""
											);
										},
									})}
								/>
								{item[index].secret ? (
									<EyeOff className="w-5 h-5" />
								) : (
									<EyeOn className="w-5 h-5" />
								)}
							</label>
						</fieldset>
					);
				})}
				<footer className="mt-7">
					<Button>{i18n.submit}</Button>
				</footer>
			</form>
		</Dialog>
	);
	async function submit({ title, item }) {
		const meta = {};
		item.forEach((i: { label: string; value: string; secret: boolean }) => {
			if (i.value) {
				meta[i.label || getRandomId()] = {
					secret: i.secret,
					value: i.value,
				};
			}
		});
		onSubmit({
			uid: defaultValues?.uid || getRandomId(),
			title,
			meta,
		});
		close();
		reset();
	}
}
