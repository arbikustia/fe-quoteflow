import * as React from "react";

import { ButtonComponent } from "../Button";
import Modal from "../Modal";
import { useConfirmModal } from "./ConfirmModal.hook";
import type { ConfirmModalProps } from "./ConfirmModal.type";

/**
 * Render confirmation dialog
 * @param {ConfirmModalProps} props - confirmation component props
 * @returns {React.ReactElement | null} - confirmation dialog
 */
export const ConfirmModalComponent = (props: ConfirmModalProps): React.ReactElement | null => {
  const {
    isOpen,
    title,
    message,
    recordName,
    consequence,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = true,
    triggerRef,
  } = props;
  const { isBusy, handleConfirm, handleClose } = useConfirmModal(props);

  return (
    <Modal
      closeOnBackdrop={!isBusy}
      isCloseDisabled={isBusy}
      isOpen={isOpen}
      maxWidth="max-w-md"
      onClose={handleClose}
      title={title}
      triggerRef={triggerRef}
    >
      <div className="space-y-6">
        <div className="space-y-2 text-sm leading-5 text-text-secondary">
          {message && <div>{message}</div>}
          {recordName && <p><strong className="font-semibold text-text-primary">{recordName}</strong></p>}
          {consequence && <p>{consequence}</p>}
        </div>
        <div className="flex justify-end gap-3">
          <ButtonComponent disabled={isBusy} onClick={handleClose} variant="secondary">{cancelText}</ButtonComponent>
          <ButtonComponent isLoading={isBusy} onClick={handleConfirm} variant={isDestructive ? "danger" : "primary"}>{confirmText}</ButtonComponent>
        </div>
      </div>
    </Modal>
  );
};
