import * as React from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle } from "react-icons/fi";

import type { ConfirmModalProps } from "./ConfirmModal.type";

/**
 * Render confirmation message.
 * @param {ConfirmModalProps} props - Confirmation modal props
 * @returns {React.ReactElement} Confirmation message
 */
const _renderMessage = (props: ConfirmModalProps): React.ReactElement => {
  const { isDestructive = true, message, title } = props;

  return (
    <div className="p-6">
      <div className="flex items-start gap-4">
        {isDestructive && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-danger-subtle">
            <FiAlertTriangle className="h-6 w-6 text-danger-strong" aria-hidden="true" />
          </div>
        )}
        <div className="mt-1 flex-1">
          <h2 id="confirm-modal-title" className="mb-2 text-lg font-bold text-text-primary">{title}</h2>
          <p id="confirm-modal-message" className="text-sm leading-relaxed text-text-secondary">{message}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Render confirmation actions.
 * @param {ConfirmModalProps} props - Confirmation modal props
 * @param {() => void} handleConfirm - Confirm handler
 * @returns {React.ReactElement} Confirmation actions
 */
const _renderActions = (props: ConfirmModalProps, handleConfirm: () => void): React.ReactElement => {
  const { cancelText = "Cancel", confirmText = "Confirm", isDestructive = true, onClose } = props;
  const confirmClassName = isDestructive
    ? "bg-danger-default hover:bg-danger-strong focus-visible:ring-danger-default"
    : "bg-action-primary hover:bg-action-primary-hover focus-visible:ring-focus-ring";

  return (
    <div className="flex justify-end gap-3 rounded-b-xl border-t border-border-default bg-background-subtle px-6 py-4">
      <button type="button" onClick={onClose} className="rounded-lg border border-border-default bg-background-surface px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-background-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
        {cancelText}
      </button>
      <button type="button" onClick={handleConfirm} className={`rounded-lg px-4 py-2 text-sm font-semibold text-text-inverse transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${confirmClassName}`}>
        {confirmText}
      </button>
    </div>
  );
};

/**
 * Render confirmation modal.
 * @param {ConfirmModalProps} props - Confirmation modal props
 * @returns {React.ReactElement | null} Confirmation modal or null
 */
export const ConfirmModalComponent = (props: ConfirmModalProps): React.ReactElement | null => {
  const { isOpen, onClose, onConfirm } = props;
  /** Confirm action and close modal. @returns {void} No return value */
  const handleConfirm = (): void => {
    onConfirm();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/75 p-4 backdrop-blur-xs sm:p-6">
      <button type="button" aria-label="Close confirmation modal" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-modal-title" aria-describedby="confirm-modal-message" className="relative flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-medium">
        {_renderMessage(props)}
        {_renderActions(props, handleConfirm)}
      </div>
    </div>,
    document.body,
  );
};
