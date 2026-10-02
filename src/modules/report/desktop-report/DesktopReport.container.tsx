import * as React from "react";

import { DesktopReportComponent } from "./DesktopReport.component";
import { useDesktopReportState } from "./DesktopReport.hook";

/**
 * Render DesktopReport Container
 * @returns {React.ReactElement} - rendered element
 */
const DesktopReportContainer = (): React.ReactElement => {
  const state = useDesktopReportState();

  return <DesktopReportComponent {...state} />;
};

export default DesktopReportContainer;
