import React from "react";
import Dialog from "components/Dialog";
import Trash from "components/Icons/Trash";

function ConfirmationDialog({
    isOpen,
    close,
    onSubmit,
    i18n,
}: {
    isOpen: boolean;
    close: () => void;
    onSubmit: () => void;
    i18n: { [key: string]: any };
}) {
    return (
        <div>
            <Dialog isOpen={isOpen} close={close}>
                <div className="text-center h-full flex flex-col items-center justify-center">
                    <Trash className="w-10 h-10 text-red-500" />

                    <h1 className=" my-4 p-2 font-bold text-3xl md:text-4xl w-full ">
                        {i18n.placeholders.title}
                    </h1>
                    <p className="text-gray-500 max-w-md">
                        {i18n.placeholders.subtitle}
                    </p>

                    <div className="mt-12 flex items-center gap-x-6">
                        <button
                            type="button"
                            className="text-center cursor-pointer focus:outline-black hover:bg-gray-50 py-2 px-4 rounded-lg text-gray-500"
                            onClick={close}
                        >
                            {i18n.cancel}
                        </button>
                        <button
                            type="button"
                            className="text-center cursor-pointer hover:bg-red-600 text-white py-2 px-4 rounded-lg bg-red-500"
                            onClick={onSubmit}
                        >
                            {i18n.delete}
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default ConfirmationDialog;
