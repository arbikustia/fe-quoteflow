import { useMemo } from "react";
import { MOCK_QUOTES } from "../../fixture/quotes";
import type { ReportProps } from "./Report.type";

export const useReportState = (): ReportProps => {
  const completedOrders = useMemo(
    () => MOCK_QUOTES.filter((quote) => quote.status === "Completed"),
    []
  );

  return {
    completedOrders,
  };
};
