import * as React from "react";

import { ReportOrderComponent } from "./Report.component";
import { useReportOrderExport, useReportOrderNavigation, useReportOrderPagination } from "./Report.hook";

/**
 * Report Order Container.
 * @returns {React.ReactElement} Container element
 */
const ReportOrderContainer = (): React.ReactElement => {
  const { goBack, goToStatus } = useReportOrderNavigation();
  const pagination = useReportOrderPagination();
  const { isExporting, onExport } = useReportOrderExport();

  return (
    <ReportOrderComponent
      {...pagination}
      onBack={goBack}
      onEditStatus={goToStatus}
      onExport={onExport}
      isExporting={isExporting}
    />
  );
};

export default ReportOrderContainer;
