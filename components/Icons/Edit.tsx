export default function Edit({
	title = "Edit",
	titleId = "SvgEdit",
	...props
}) {
	return (
		<svg
			aria-labelledby={titleId}
			{...props}
			viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
		>
			{title ? <title id={titleId}>{title}</title> : null}
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
			/>
		</svg>
	);
}