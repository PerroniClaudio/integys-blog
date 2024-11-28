"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

function Dialog({ isOpen, onClose, title, children }: Props) {
  const [showDialog, setShowDialog] = useState<boolean>(isOpen);

  const closeDialog = () => {
    setShowDialog(false);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <dialog
          open={isOpen}
          className="bg-black bg-opacity-40 w-screen h-screen fixed top-0 right-0 z-30 flex flex-col items-center">
          <article
            className={`border rounded shadow-lg w-full lg:w-1/2 mt-40 bg-white p-2 relative text-black`}>
            {/* Close button */}
            <div
              className="absolute top-0 right-0 p-2 text-gray-300 cursor-pointer"
              onClick={closeDialog}>
              <X />
            </div>

            <nav className="border-b border-gray-100 p-2">
              <h3 className="text-xl font-semibold">{title}</h3>
            </nav>

            <div className="p-4">{children}</div>
          </article>
        </dialog>
      )}
    </>
  );
}

export default Dialog;
