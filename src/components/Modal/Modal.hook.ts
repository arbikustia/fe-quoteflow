import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect, useId, useRef } from "react";

import type { ModalAccessibility, ModalProps } from "./Modal.type";

const getFocusableElements = (dialog: HTMLDivElement | null): HTMLElement[] => {
  if (!dialog) {
    return [];
  }

  return Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
};

/**
 * Manage modal focus and keyboard behavior
 * @param {ModalProps} props - modal props
 * @returns {ModalAccessibility} - modal accessibility handlers
 */
export const useModal = (props: ModalProps): ModalAccessibility => {
  const { closeOnEscape = true, isCloseDisabled = false, isOpen, onClose, triggerRef } = props;
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Escape" && closeOnEscape && !isCloseDisabled) {
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableElements(dialogRef.current);
    if (focusableElements.length === 0) {
      event.preventDefault();
      dialogRef.current?.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const firstFocusable = getFocusableElements(dialogRef.current)[0];
    (firstFocusable ?? dialogRef.current)?.focus();

    return () => {
      (triggerRef?.current ?? previousFocus)?.focus();
    };
  }, [isOpen, triggerRef]);

  return { dialogRef, handleDialogKeyDown, titleId };
};
