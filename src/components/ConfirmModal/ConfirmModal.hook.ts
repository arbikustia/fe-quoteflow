import { useEffect, useRef, useState } from "react";

import type { ConfirmModalProps, ConfirmModalState } from "./ConfirmModal.type";

/**
 * Convert confirmation failures into visible recovery state.
 * @param {Error} error - confirmation error
 * @returns {string} - user-facing error message
 */
const _getErrorMessage = (error: Error): string => {
  if (error.message) {
    return error.message;
  }

  return "Confirmation failed. Try again.";
};

/**
 * Manage confirmation submission and recovery.
 * @param {ConfirmModalProps} props - confirmation props
 * @returns {ConfirmModalState} - confirmation state and handlers
 */
export const useConfirmModal = (props: ConfirmModalProps): ConfirmModalState => {
  const { disabled = false, isLoading = false, isOpen, onClose, onConfirm, onConfirmError } = props;
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSubmitting = useRef(false);

  useEffect((): void => {
    if (!isOpen) {
      isSubmitting.current = false;
    }
  }, [isOpen]);

  const handleClose = (): void => {
    if (!isSubmitting.current && !isLoading && !disabled) {
      setErrorMessage(null);
      onClose();
    }
  };

  const handleConfirm = (): void => {
    if (isSubmitting.current || isLoading || disabled) {
      return;
    }

    isSubmitting.current = true;
    setErrorMessage(null);

    try {
      const result = onConfirm();
      if (result instanceof Promise) {
        setIsPending(true);
        void result.then((): void => {
          isSubmitting.current = false;
          setIsPending(false);
          onClose();
        }).catch((error: Error): void => {
          isSubmitting.current = false;
          setIsPending(false);
          setErrorMessage(_getErrorMessage(error));
          onConfirmError?.(error);
        });
      } else {
        isSubmitting.current = false;
        onClose();
      }
    } catch (error) {
      isSubmitting.current = false;
      setErrorMessage(_getErrorMessage(error instanceof Error ? error : new Error("Confirmation failed. Try again.")));
      if (error instanceof Error) {
        onConfirmError?.(error);
      }
    }
  };

  return {
    errorMessage,
    isBusy: isLoading || isPending,
    handleClose,
    handleConfirm,
  };
};
