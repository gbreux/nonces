type node = keyof JSX.IntrinsicElements;

const defaultVariantMapping: { [key: string]: node } = {
	h1: "h1",
	h2: "h2",
	h3: "h3",
	h4: "h4",
	h5: "h5",
	h6: "h6",
	subtitle1: "h6",
	subtitle2: "h6",
	p: "p",
	sp: "p",
};

const defaultStyle = {
	h1: "font-black text-3xl md:text-4xl",
	h2: "text-3xl",
	h3: "text-2xl",
	h4: "text-xl",
	h5: "text-base",
	h6: "text-sm",
	p: "text-base md:text-lg",
	sp: "text-sm",
};

export default function Typography({
	className,
	component,
	variant = "p",
	children,
	style = {},
	...props
}: {
	className?: string;
	component?: node;
	variant?: keyof typeof defaultVariantMapping;
	children: any;
	style?: anyObj;
	[key: string]: any;
}) {
	const Component = component || defaultVariantMapping[variant] || "p";
	const classes =
		(defaultStyle[variant] || "") + (className ? " " + className : "");

	return (
		<Component className={classes} style={{ ...style }} {...props}>
			{children}
		</Component>
	);
}
