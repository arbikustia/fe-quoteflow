import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const items = getItems(MOBILE_NAVIGATE_ITEMS);

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
