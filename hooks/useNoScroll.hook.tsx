import { useEffect } from "react";

function useNoScroll(disableScroll: boolean) {
	useEffect(() => {
		const $body = document.body;
		if (disableScroll) {
			$body.style.paddingRight = window.innerWidth - $body.offsetWidth + "px";
			$body.style.overflow = "hidden";
		} else {
			$body.style.overflow = "auto";
			$body.style.paddingRight = "0";
		}
		return () => {
			$body.style.overflow = "auto";
			$body.style.paddingRight = "0";
		};
	}, [disableScroll]);

	return null;
}

export default useNoScroll;
