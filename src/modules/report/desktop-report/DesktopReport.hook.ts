import { useMemo } from "react";

import { usePagination } from "@/hooks/usePagination";

import { MOCK_QUOTES } from "@/fixture/quotes";

import type { DesktopReportProps } from "./DesktopReport.type";

/**
 * Hook for managing desktop report state
 * @returns {DesktopReportProps} - desktop report state and handlers
 */
export const useDesktopReportState = (): DesktopReportProps => {
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
