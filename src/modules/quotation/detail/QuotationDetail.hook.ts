import { useNavigate, useParams } from "react-router-dom";

import type { QuotationDetailState } from "../Quotation.type";

import { useGetQuotationByIdQuery } from "@/services/quotation.service";

/**
 * _resolveErrorMessage.
 * @param {boolean} hasError - hasError value.
 * @param {boolean} isMissingData - isMissingData value.
 * @returns {string | null} - result.
 */
const _resolveErrorMessage = (hasError: boolean, isMissingData: boolean): string | null => {
  if (hasError) {
    return "Unable to load quotation detail.";
  }

  if (isMissingData) {
    return "Quotation detail is unavailable.";
  }

  return null;
};

/**
 * useQuotationDetail.
 * @returns {QuotationDetailState} - result.
 */
export const useQuotationDetail = (): QuotationDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetQuotationByIdQuery(id ?? "", { skip: !id });
  const quotation = data?.status && data.data ? data.data : null;
  const errorMessage = _resolveErrorMessage(Boolean(error), Boolean(data && !data.status));
  /**
 * goBack.
 * @returns {void} - result.
 */
const goBack = (): void => { void navigate(-1); };

  return { quotation, isLoading, errorMessage, goBack };
};
