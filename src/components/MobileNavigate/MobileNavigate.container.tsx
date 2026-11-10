import * as React from "react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { usePagePermission } from "@/hooks/usePagePermission";

import { MobileNavigateComponent } from "./MobileNavigate.component";
import { MOBILE_NAVIGATE_ITEMS } from "./MobileNavigate.config";
import { useMobileNavigate } from "./MobileNavigate.hook";

/**
 * Render MobileNavigate Container — handles routing and navigation logic.
 * @returns {React.ReactElement} MobileNavigate Container
 */
const MobileNavigateContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMasterSubRoute = pathname.startsWith("/master-") && pathname !== "/master-main";

  const { getItems } = useMobileNavigate(pathname);
  
  const { canView: canViewCalendar } = usePagePermission("/calendar");
  const { canView: canViewNote } = usePagePermission("/note");

  const itemsWithPermission = useMemo(() => MOBILE_NAVIGATE_ITEMS.filter((item) => {
    if (item.id === "/home" || item.id === "/profile") return true;
    if (item.id === "/calendar") return canViewCalendar;
    if (item.id === "/note") return canViewNote;
    return false;
  }), [canViewCalendar, canViewNote]);
  
  const items = getItems(itemsWithPermission);

  /**
   * Navigate to valid route.
   * @param {string} path - selected route path
   * @returns {void} No return value
   */
  const handleNavigate = (path: string): void => {
    if (path.startsWith("/")) {
      navigate(path);
    }
  };

  return (
    <MobileNavigateComponent
      items={items}
      onNavigate={handleNavigate}
      isHidden={isMasterSubRoute}
    />
  );
};

export default MobileNavigateContainer;
