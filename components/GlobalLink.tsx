import { forwardRef, useEffect, useState } from "react";

export default forwardRef(function Link(
	{ children, component = "a", hideFocus, ...props }: any,
	_
) {
	const [selecting, setselecting] = useState(false);

	useEffect(() => {
		window.addEventListener("keydown", enableSelection);
		window.addEventListener("keyup", disableSelection);
		return () => {
			window.removeEventListener("keydown", enableSelection);
			window.removeEventListener("keyup", disableSelection);
		};
		function enableSelection(event) {
			if (event.altKey) {
				setselecting(true);
			}
		}
		function disableSelection() {
			setselecting((selecting) => (selecting ? !selecting : selecting));
		}
	}, []);
	const Component = component;

	return (
		<Component
			className={`before:absolute before:inset-0 before:z-0 before:content-[''] outline-none ${
				hideFocus ? "" : "focus:before:outline-black"
			}`}
			{...props}
		>
			{children}
		</Component>
	);
});
