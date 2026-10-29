import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import type { DashboardRoute } from "./Dashboard.type";

export type DashboardNavigation = {
  navigateTo: (route: DashboardRoute) => void;
};

/**
 * Manage dashboard menu navigation.
 * @returns {DashboardNavigation} Navigation handler
 */
export const useDashboardNavigation = (): DashboardNavigation => {
  const navigate = useNavigate();
  const navigateTo = useCallback((route: DashboardRoute): void => {
    navigate(route);
  }, [navigate]);

  return { navigateTo };
};
