import { useMemo } from "react";

import { MOCK_QUOTES } from "../../fixture/quotes";
import { usePagination } from "../../hooks/usePagination";

import type { ReportProps } from "./Report.type";

/**
 * useReportState hook
 * @returns {ReportProps} state
 */
export const useReportState = (): ReportProps => {
  const completedOrders = useMemo(
    () => MOCK_QUOTES.filter((quote) => quote.status === "Completed"),
    []
  );

  const pagination = usePagination(completedOrders);

  return {
    completedOrders,
    ...pagination,
  };
};
