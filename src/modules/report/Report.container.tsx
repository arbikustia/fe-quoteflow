import * as React from "react";

import { ReportOrderComponent } from "./Report.component";
import { useReportOrderNavigation, useReportOrderPagination } from "./Report.hook";

/**
 * Report Order Container.
 * @returns {React.ReactElement} Container element
 */
const ReportOrderContainer = (): React.ReactElement => {
  const { goBack, goToDetail } = useReportOrderNavigation();
  const pagination = useReportOrderPagination();

  return (
    <ReportOrderComponent
      {...pagination}
      onBack={goBack}
      onRowClick={goToDetail}
    />
  );
};

export default ReportOrderContainer;
