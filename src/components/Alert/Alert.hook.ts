import { useEffect, useState } from "react";

import type { AlertToastState } from "./Alert.type";

/**
 * Remove successMessage from browser history state to prevent reappearing on navigation.
 * @returns {void} No return value
 */
const _clearHistorySuccessMessage = (): void => {
  if (typeof window === "undefined" || !window.history?.replaceState) {
    return;
  }

  const currentState = window.history.state;

  if (currentState && currentState.usr && currentState.usr.successMessage) {
    const nextUsr = { ...currentState.usr };

    delete nextUsr.successMessage;

    window.history.replaceState({ ...currentState, usr: nextUsr }, document.title);
  }
};

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
    _clearHistorySuccessMessage();
    onClose?.();
  };

  useEffect((): (() => void) | undefined => {
    if (!toast) {
      return undefined;
    }

    _clearHistorySuccessMessage();

    const timeout = window.setTimeout(closeToast, 3000);

    return (): void => window.clearTimeout(timeout);
  }, [toast]);

  return { isVisible, closeToast };
};
