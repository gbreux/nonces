export default function Button({
	component = "button",
	className = "",
	small = false,
	rounded = false,
	ghost = false,
	...props
}: {
	component?: string;
	className?: string;
	small?: boolean;
	rounded?: boolean;
	ghost?: boolean;
	[key: string]: any;
}) {
	const Component: any = component;
	const size = small ? "py-1 px-4" : "py-2 px-4";
	const round = rounded ? "rounded-full" : "rounded-lg";
	const border = ghost ? "" : "border border-gray-800";
	return (
		<Component
			className={`text-center cursor-pointer focus:outline-black hover:bg-gray-50 ${size} ${round} ${border} ${className}`}
			{...props}
		/>
	);
}
