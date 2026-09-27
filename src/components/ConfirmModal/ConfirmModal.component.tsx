import * as React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import type { ConfirmModalProps } from "./ConfirmModal.type";

export const ConfirmModalComponent = (props: ConfirmModalProps): React.ReactElement | null => {
  const { 
    isOpen, onClose, onConfirm, title, message, 
    confirmText = "Confirm", cancelText = "Cancel", isDestructive = true 
  } = props;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brand-text-dark/60 backdrop-blur-sm transition-opacity">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-transparent" onClick={onClose}></div>

      {/* Modal Box */}
      <div
        className="relative bg-brand-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            {isDestructive && (
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-orange-light flex items-center justify-center">
                <FiAlertTriangle className="w-6 h-6 text-brand-orange" />
              </div>
            )}
            <div className="flex-1 mt-1">
              <h3 className="text-lg font-bold text-brand-text-dark mb-2">{title}</h3>
              <p className="text-sm text-brand-text-medium leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-brand-gray-light flex justify-end gap-3 rounded-b-2xl border-t border-brand-gray-light">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-brand-text-dark bg-brand-white border border-gray-300 hover:bg-brand-gray-light rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gray-light"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className={`px-4 py-2 text-sm font-semibold text-brand-white rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              isDestructive 
                ? "bg-brand-orange hover:bg-brand-orange-dark focus:ring-brand-orange-light0" 
                : "bg-brand-blue hover:bg-brand-blue-dark focus:ring-brand-blue"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
