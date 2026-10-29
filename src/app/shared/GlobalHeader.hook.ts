import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { MobileProfileHeaderState } from "./GlobalHeader.type";

/**
 * Manage state for mobile profile drawer and logout confirmation.
 * @returns {MobileProfileHeaderState} Profile drawer state and handlers
 */
export const useMobileProfileHeaderState = (): MobileProfileHeaderState => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const onOpenDrawer = useCallback((): void => setIsDrawerOpen(true), []);
  const onCloseDrawer = useCallback((): void => setIsDrawerOpen(false), []);

  const onOpenLogoutConfirm = useCallback((): void => {
    setIsDrawerOpen(false);
    setIsLogoutConfirmOpen(true);
  }, []);

  const onCloseLogoutConfirm = useCallback((): void => {
    setIsLogoutConfirmOpen(false);
  }, []);

  const onConfirmLogout = useCallback((): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    document.cookie = "quoteflow_username=; path=/; max-age=0";
    navigate("/login", { replace: true });
  }, [navigate]);

  return {
    isDrawerOpen,
    isLogoutConfirmOpen,
    onCloseDrawer,
    onCloseLogoutConfirm,
    onConfirmLogout,
    onOpenDrawer,
    onOpenLogoutConfirm,
  };
};
