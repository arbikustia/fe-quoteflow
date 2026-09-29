import { useNavigate } from "react-router-dom";

import { MOCK_QUOTES } from "../../../fixture/quotes";

import type { MobileReturnProps } from "./MobileReturn.type";

/**
 * Hook for Mobile Return
 * @returns {MobileReturnProps} hook values
 */
export const useMobileReturn = (): MobileReturnProps => {
  const navigate = useNavigate();
  const quotes = MOCK_QUOTES.filter((quote) => quote.status === "On Rental");

  /**
   * Handle navigate to detail
   * @param {string} id - quote id
   * @returns {void} void
   */
  const onNavigateDetail = (id: string): void => {
    navigate(`/return/detail/${id}`);
  };

  return {
    quotes,
    onNavigateDetail,
  };
};
