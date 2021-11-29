export default function Button({
	component = "button",
	...props
}: {
	component?: string;
	[key: string]: any;
}) {
	const Component: any = component;
	return (
		<Component
			className="rounded-full py-2 px-4 text-center bg-blue-400 cursor-pointer hover:bg-blue-500"
			{...props}
		/>
	);
}
