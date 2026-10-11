import * as React from "react";

import type { ConfirmModalComponentProps } from "./ConfirmModal.type";
import { ButtonComponent } from "../Button";
import Modal from "../Modal";

/**
 * Render confirmation error message
 * @param {string | null} errorMessage - error message
 * @returns {React.ReactElement | null} - confirmation error element
 */
const _renderErrorMessage = (errorMessage: string | null): React.ReactElement | null => {
  if (!errorMessage) {
    return null;
  }

  return <p className="rounded-medium bg-danger-subtle px-3 py-2 text-sm text-danger-strong" role="alert">{errorMessage}</p>;
};

/**
 * Render confirmation body
 * @param {ConfirmModalComponentProps} props - confirmation component props
 * @returns {React.ReactElement} - confirmation body
 */
const _renderConfirmationBody = (props: ConfirmModalComponentProps): React.ReactElement => {
  const { consequence, errorMessage, message, recordName } = props;

  return (
    <div className="space-y-3 text-sm leading-5 text-text-secondary">
      {message && <div>{message}</div>}
      {recordName && <p><strong className="font-semibold text-text-primary">{recordName}</strong></p>}
      {consequence && <p>{consequence}</p>}
      {_renderErrorMessage(errorMessage)}
    </div>
  );
};

/**
 * Render confirmation actions
 * @param {ConfirmModalComponentProps} props - confirmation component props
 * @returns {React.ReactElement} - confirmation action row
 */
const _renderConfirmationActions = (props: ConfirmModalComponentProps): React.ReactElement => {
  const {
    cancelText = "Cancel",
    confirmText = "Confirm",
    disabled = false,
    handleClose,
    handleConfirm,
    isBusy,
    isDestructive = true,
  } = props;
  const isActionDisabled = isBusy || disabled;

  return (
    <div className="flex justify-end gap-3">
      <ButtonComponent disabled={isActionDisabled} onClick={handleClose} variant="secondary">{cancelText}</ButtonComponent>
      <ButtonComponent disabled={disabled} isLoading={isBusy} onClick={handleConfirm} variant={isDestructive ? "danger" : "primary"}>{confirmText}</ButtonComponent>
    </div>
  );
};

/**
 * Render confirmation dialog
 * @param {ConfirmModalComponentProps} props - confirmation component props
 * @returns {React.ReactElement | null} - confirmation dialog
 */
export const ConfirmModalComponent = (props: ConfirmModalComponentProps): React.ReactElement | null => {
  const { disabled = false, handleClose, isBusy, isOpen, title, triggerRef } = props;
  const isCloseDisabled = isBusy || disabled;

  return (
    <Modal
      closeOnBackdrop={!isCloseDisabled}
      closeOnEscape={!isCloseDisabled}
      isCloseDisabled={isCloseDisabled}
      isOpen={isOpen}
      maxWidth="max-w-md"
      onClose={handleClose}
      title={title}
      triggerRef={triggerRef}
    >
      <div className="space-y-6">
        {_renderConfirmationBody(props)}
        {_renderConfirmationActions(props)}
      </div>
    </Modal>
  );
};
