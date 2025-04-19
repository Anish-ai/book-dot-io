// src/components/ui/Modal.js
import { XMarkIcon } from "@heroicons/react/24/outline";
import { forwardRef, useEffect } from "react";

const Modal = forwardRef(({ isOpen, onClose, children }, ref) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]); // Add onClose to dependency array

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

export default Modal;