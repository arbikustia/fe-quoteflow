import { useMemo } from "react";

import { MOCK_QUOTES } from "@/fixture/quotes";

import type { MobileReportProps } from "./MobileReport.type";

/**
 * Hook for managing mobile report state
 * @returns {Omit<MobileReportProps, "onNavigate">} - mobile report state without navigation
 */
export const useMobileReportState = (): Omit<MobileReportProps, "onNavigate"> => {
  const orders = useMemo(
    () => MOCK_QUOTES.filter((order) => order.status === "Completed"),
    []
  );

  return {
    orders,
  };
};
