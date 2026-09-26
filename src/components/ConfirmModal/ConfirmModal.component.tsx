import * as React from "react";
import Modal from "../Modal";
import type { ConfirmModalProps } from "./ConfirmModal.type";

export const ConfirmModalComponent = (props: ConfirmModalProps): React.ReactElement => {
  const { 
    isOpen, onClose, onConfirm, title, message, 
    confirmText = "Confirm", cancelText = "Cancel", isDestructive = true 
  } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="pt-2 pb-6">
        <p className="text-brand-text-medium">{message}</p>
      </div>
      <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
        <button 
          onClick={onClose}
          className="px-4 py-2 text-brand-text-medium font-bold hover:bg-gray-100 rounded-xl transition-colors focus:outline-none"
        >
          {cancelText}
        </button>
        <button 
          onClick={() => { onConfirm(); onClose(); }}
          className={`px-6 py-2 text-white font-bold rounded-xl shadow-md transition-all focus:outline-none focus:ring-4 ${
            isDestructive 
              ? "bg-red-500 hover:bg-red-600 hover:shadow-lg focus:ring-red-500/20" 
              : "bg-brand-blue hover:bg-brand-blue-dark hover:shadow-lg focus:ring-brand-blue/20"
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
