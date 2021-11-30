import ReactModal from "react-modal";

import SvgClose from "components/Icons/Close";
import useNoScroll from "hooks/useNoScroll.hook";

export default function Modal({
	isOpen,
	close,
	children,
	width = 750,
	hideCloseButton = false,
	...props
}) {
	useNoScroll(isOpen);

	return (
		<ReactModal
			isOpen={isOpen}
			onRequestClose={close}
			width={width}
			className="cursor-auto bg-white max-w-3xl my-auto w-full rounded-2xl shadow-2xl relative focus:outline-none"
			overlayClassName="fixed inset-0 items-start p-4 justify-center flex h-full overflow-auto z-50 cursor-pointer bg-white bg-opacity-80"
			{...props}
		>
			<div style={{ borderRadius: "inherit" }} className="p-4 md:p-7">
				{children}
				{close && !hideCloseButton ? (
					<button
						className="absolute focus:outline-black rounded-full p-2 right-2 top-2 flex hover:text-gray-500 text-gray-300 md:right-4 md:top-4 md:text-2xl"
						onClick={close}
					>
						<SvgClose className="w-6 h-6" />
					</button>
				) : null}
			</div>
		</ReactModal>
	);
}
