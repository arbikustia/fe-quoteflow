import type { SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import apiClient from "@/libs/api/ApiClient/ApiClient";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import { mapRentalOrder, useGetRentalOrdersQuery, useUpdateRentalOrderMutation } from "@/services/rental-order.service";

import { sortReportOrders } from "./Report.helpers";
import type {
  RentalOrderListResponse,
  ReportOrderApiState,
  ReportOrderData,
  ReportOrderPagination,
  ReportOrderStatusFormProps,
} from "./Report.type";

import ENDPOINT from "@/constants/endpoint.constant";

/**
 * Hook for report order navigation.
 * @returns {{ goBack: () => void; goToStatus: (order: ReportOrderData) => void }} Navigation functions
 */
export const useReportOrderNavigation = (): { goBack: () => void; goToStatus: (order: ReportOrderData) => void } => {
  const navigate = useNavigate();

  /**
   * Navigate back.
   * @returns {void}
   */
  const goBack = (): void => { navigate(-1); };

  /**
   * Navigate to order status form.
   * @param {ReportOrderData} order - Report order
   * @returns {void}
   */
  const goToStatus = (order: ReportOrderData): void => {
    navigate(`/report/order/${order.id}/status`, { state: order });
  };

  return { goBack, goToStatus };
};

/**
 * Create loading state.
 * @returns {ReportOrderApiState} Loading state
 */
const _createLoadingState = (): ReportOrderApiState => ({
  isLoading: true,
  errorMessage: null,
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create HTTP error state.
 * @returns {ReportOrderApiState} Error state
 */
const _createErrorState = (): ReportOrderApiState => ({
  isLoading: false,
  errorMessage: "Unable to load orders.",
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create missing response state.
 * @returns {ReportOrderApiState} Missing response state
 */
const _createMissingResponseState = (): ReportOrderApiState => ({
  isLoading: false,
  errorMessage: "No response received from server.",
  isEnvelopeError: false,
  isMissingData: true,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create missing payload state.
 * @returns {ReportOrderApiState} Missing payload state
 */
const _createMissingPayloadState = (): ReportOrderApiState => ({
  isLoading: false,
  errorMessage: "Response is missing data payload.",
  isEnvelopeError: false,
  isMissingData: true,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create success state.
 * @param {ReportOrderData[]} orders - Mapped order data
 * @param {number} totalPages - Total pages from API
 * @param {number} totalCount - Total count from API
 * @returns {ReportOrderApiState} Success state
 */
const _createSuccessState = (orders: ReportOrderData[], totalPages: number, totalCount: number): ReportOrderApiState => ({
  isLoading: false,
  errorMessage: null,
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: orders,
  totalPages,
  totalCount,
});

/**
 * Derive paginated state from API response envelope.
 * @param {ReturnType<typeof useGetRentalOrdersQuery>} queryResult - RTK Query result
 * @returns {ReportOrderApiState} Derived state
 */
const _deriveReportOrderListState = (queryResult: ReturnType<typeof useGetRentalOrdersQuery>): ReportOrderApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) return _createLoadingState();

  if (error) return _createErrorState();

  const response: RentalOrderListResponse | undefined = data;

  if (!response) return _createMissingResponseState();

  const orderList = response.data;

  if (!orderList) return _createMissingPayloadState();

  const orders = sortReportOrders(orderList.map(mapRentalOrder));

  return _createSuccessState(orders, response.total_pages, response.total_count);
};

/**
 * Hook for exporting the rental order report PDF.
 * @returns {{ isExporting: boolean; onExport: () => void }} Export state and handler
 */
export const useReportOrderExport = (): { isExporting: boolean; onExport: () => void } => {
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Download order report PDF from the export endpoint.
   * @returns {void}
   */
  const onExport = (): void => {
    if (isExporting) return;

    setIsExporting(true);

    void apiClient.get<Blob>(ENDPOINT.RENTAL_ORDER.EXPORT, { responseType: "blob" }).then((response) => {
      const objectUrl = URL.createObjectURL(response.data);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = "rental-order-report.xlsx";
      link.click();
      URL.revokeObjectURL(objectUrl);
    }).catch(() => {
      window.alert("Unable to export order report. Please try again.");
    }).finally(() => setIsExporting(false));
  };

  return { isExporting, onExport };
};

/**
 * Hook for API-backed report order pagination.
 * @returns {ReportOrderPagination} Report order pagination state and handlers
 */
/**
 * Hook for report order status form.
 * @returns {ReportOrderStatusFormProps} Status form state
 */
export const useReportOrderStatusForm = (): ReportOrderStatusFormProps => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state as ReportOrderData | null;
  const [isActive, setIsActive] = useState(order?.status === 2);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [updateRentalOrder, { isLoading: isSubmitting }] = useUpdateRentalOrderMutation();
  const { logEdit } = useMasterActivityLog("Report Order");

  /**
   * Update selected status.
   * @param {boolean} checked - Active status
   * @returns {void} No return value
   */
  const handleStatusChange = (checked: boolean): void => setIsActive(checked);

  /**
   * Return to report list.
   * @returns {void} No return value
   */
  const goBack = (): void => { void navigate("/report"); };

  /**
   * Submit complete rental-order payload with updated status.
   * @param {SyntheticEvent<HTMLFormElement>} event - Form submit event
   * @returns {Promise<void>} Completion promise
   */
  const handleSubmit = async (event?: SyntheticEvent): Promise<void> => {
    event?.preventDefault();

    if (!order) {
      setSubmissionError("Order data is unavailable.");

      return;
    }

    setSubmissionError(null);

    try {
      const response = await updateRentalOrder({
        id: order.id,
        transaction_id: order.transactionId,
        invoice_id: order.invoiceId,
        quotation_id: order.quotationId,
        order_no: order.orderNo,
        order_date: order.rawOrderDate,
        notes: order.notes,
        status: isActive ? 2 : 1,
      }).unwrap();

      if (!response.status) {
        setSubmissionError(response.messages?.join(" ") || "Unable to update order status.");

        return;
      }

      await logEdit(order.orderNo);

      void navigate("/report", { state: { successMessage: "Order status updated successfully." } });
    } catch {
      setSubmissionError("Unable to update order status.");
    }
  };

  return {
    orderNo: order?.orderNo ?? null,
    isActive,
    isSubmitting,
    errorMessage: submissionError ?? (!order ? "Order data is unavailable." : null),
    handleStatusChange,
    handleSubmit,
    goBack,
  };
};

export const useReportOrderPagination = (): ReportOrderPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { logView } = useMasterActivityLog("Report Order");

  useEffect(() => {
    let active = true;
    void logView().then(() => {
      if (!active) return;
    });

    return () => {
      active = false;
    };
  }, [logView]);

  const queryResult = useGetRentalOrdersQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _deriveReportOrderListState(queryResult);

  /**
   * Handle page change.
   * @param {number} page - New page number
   * @returns {void}
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, derived.totalPages)));

  /**
   * Handle next page.
   * @returns {void}
   */
  const nextPage = (): void => {
    if (!derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0 && queryResult.data?.has_next) {
      goToPage(currentPage + 1);
    }
  };

  /**
   * Handle prev page.
   * @returns {void}
   */
  const prevPage = (): void => {
    if (!derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0 && queryResult.data?.has_previous) {
      goToPage(currentPage - 1);
    }
  };

  /**
   * Handle page size change.
   * @param {number} size - New page size
   * @returns {void}
   */
  const changePageSize = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };

  /**
   * Handle search term change.
   * @param {string} value - Search term
   * @returns {void}
   */
  const handleSearchTerm = (value: string): void => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages: derived.totalPages,
    pageSize,
    paginatedData: derived.paginatedData,
    totalCount: derived.totalCount,
    isLoading: derived.isLoading,
    errorMessage: derived.errorMessage,
    isEmpty: !derived.isLoading && !derived.errorMessage && !derived.isMissingData && derived.paginatedData.length === 0,
    isMissingData: derived.isMissingData,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    setSearchTerm: handleSearchTerm,
  };
};
