export default function Copy({
	title = "Copy",
	titleId = "SvgCopy",
	...props
}) {
	return (
		<svg
			aria-labelledby={titleId}
			{...props}
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			{title ? <title id={titleId}>{title}</title> : null}
			<path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
			<path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
		</svg>
	);
}
