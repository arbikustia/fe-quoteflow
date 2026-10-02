import * as React from "react";
import { useNavigate } from "react-router-dom";

import { MobileReportComponent } from "./MobileReport.component";
import { useMobileReportState } from "./MobileReport.hook";

/**
 * Mobile Report Container
 * @returns {React.ReactElement} - rendered mobile report container
 */
const MobileReportContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const { orders } = useMobileReportState();

  /**
   * Handle navigate
   * @param {string} path - navigation path
   * @returns {void} - void
   */
  const handleNavigate = (path: string): void => {
    navigate(path);
  };

  return <MobileReportComponent orders={orders} onNavigate={handleNavigate} />;
};

export default MobileReportContainer;
