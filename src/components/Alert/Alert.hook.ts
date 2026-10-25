import { useEffect, useState } from "react";

import type { AlertToastState } from "./Alert.type";

/**
 * Manage toast visibility and automatic dismissal.
 * @param {boolean} toast - Toast display mode
 * @param {() => void | undefined} onClose - Optional close callback
 * @returns {AlertToastState} Toast visibility state
 */
export const useAlertToast = (toast: boolean, onClose: (() => void) | undefined): AlertToastState => {
  const [isVisible, setIsVisible] = useState(true);

  /**
   * Close toast and notify caller.
   * @returns {void} No return value
   */
  const closeToast = (): void => {
    setIsVisible(false);
    onClose?.();
  };

  useEffect((): (() => void) | undefined => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(closeToast, 3000);

    return (): void => window.clearTimeout(timeout);
  }, [toast]);

  return { isVisible, closeToast };
};
