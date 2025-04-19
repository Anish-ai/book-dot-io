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
    <div className="modal-overlay">
      <div className="modal-content relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-[var(--card-hover)] rounded-full"
        >
          <XMarkIcon className="h-6 w-6 text-[var(--foreground)]" />
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

export default Modal;