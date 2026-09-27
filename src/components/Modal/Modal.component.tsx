import * as React from "react";

import type { ModalProps } from "./Modal.type";

/**
 * Generic Modal Component
 * @param {ModalProps} props - modal component props
 * @returns {React.ReactElement | null} - ModalComponent
 */
export const ModalComponent = (props: ModalProps): React.ReactElement | null => {
  const { isOpen, onClose, title, children, maxWidth = "max-w-2xl" } = props;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brand-text-dark/40 backdrop-blur-sm transition-opacity">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-transparent" onClick={onClose}></div>

      {/* Modal Box */}
      <div
        className={`relative bg-brand-white rounded-2xl shadow-xl w-full ${maxWidth} overflow-hidden flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-200`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-gray-light shrink-0">
          <h3 className="text-lg font-bold text-brand-text-dark">{title}</h3>
          <button
            onClick={onClose}
            className="text-brand-text-medium hover:text-brand-text-medium hover:bg-brand-gray-light p-2 rounded-xl transition-colors focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
};
