import { useEffect, useRef, useState } from "react";

import type { ConfirmModalProps } from "./ConfirmModal.type";

/**
 * Guard confirmation while async action is pending
 * @param {ConfirmModalProps} props - confirmation props
 * @returns {ConfirmModalState} - handlers and pending state
 */
export const useConfirmModal = (props: ConfirmModalProps): {
  isBusy: boolean;
  handleConfirm: () => void;
  handleClose: () => void;
} => {
  const { isOpen, isLoading = false, onConfirm, onClose } = props;
  const [isPending, setIsPending] = useState(false);
  const isSubmitting = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      isSubmitting.current = false;
      setIsPending(false);
    }
  }, [isOpen]);

  const handleClose = (): void => {
    if (!isSubmitting.current && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = (): void => {
    if (isSubmitting.current || isLoading) {
      return;
    }

    isSubmitting.current = true;
    try {
      const result = onConfirm();
      if (result instanceof Promise) {
        setIsPending(true);
        void result.then(() => {
          isSubmitting.current = false;
          setIsPending(false);
          onClose();
        }, () => {
          isSubmitting.current = false;
          setIsPending(false);
        });
      } else {
        isSubmitting.current = false;
        onClose();
      }
    } catch {
      isSubmitting.current = false;
    }
  };

  return { isBusy: isLoading || isPending, handleConfirm, handleClose };
};
