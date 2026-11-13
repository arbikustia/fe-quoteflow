import type { ReactElement } from "react";

import { usePagePermission } from "@/hooks/usePagePermission";

import { ReportOrderComponent } from "./Report.component";
import { useReportOrderConfirm, useReportOrderExport, useReportOrderNavigation, useReportOrderPagination } from "./Report.hook";

/**
 * Report Order Container.
 * @returns {ReactElement | null} - Container element
 */
const ReportOrderContainer = (): ReactElement | null => {
  const { goBack } = useReportOrderNavigation();
  const pagination = useReportOrderPagination();
  const exportState = useReportOrderExport();
  const confirmState = useReportOrderConfirm();
  const { canView } = usePagePermission("/report");

  if (!canView) return null;

  return <ReportOrderComponent {...pagination} {...exportState} {...confirmState} onBack={goBack} />;
};

export default ReportOrderContainer;
