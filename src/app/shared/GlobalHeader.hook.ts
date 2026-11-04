import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUsername } from "@/components/Sidebar/Sidebar.helpers";

import { useCreateActivityLogMutation } from "@/services/activity-log.service";

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

  const [createActivityLog] = useCreateActivityLogMutation();

  const onOpenLogoutConfirm = useCallback((): void => {
    setIsDrawerOpen(false);
    setIsLogoutConfirmOpen(true);
  }, []);

  const onCloseLogoutConfirm = useCallback((): void => {
    setIsLogoutConfirmOpen(false);
  }, []);

  const onConfirmLogout = useCallback((): void => {
    const username = getUsername();
    if (username) {
      void createActivityLog({
        user_name: username,
        action: "view",
        page: "Logout",
        description: "User logged out.",
      }).unwrap().catch(() => {});
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    document.cookie = "quoteflow_username=; path=/; max-age=0";
    navigate("/login", { replace: true });
  }, [createActivityLog, navigate]);

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
