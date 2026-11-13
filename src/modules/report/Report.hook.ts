import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import { mapRentalOrder, useExportRentalOrdersMutation, useGetRentalOrdersQuery, useUpdateRentalOrderMutation } from "@/services/rental-order.service";

import { REPORT_CONFIG } from "./Report.config";
import type {
  ReportOrderConfirm,
  ReportOrderData,
  ReportOrderExport,
  ReportOrderListState,
  ReportOrderNavigation,
  ReportOrderPagination,
} from "./Report.type";
import { buildConfirmMessage, buildOrderUpdateRequest, sortReportOrders } from "./Report.util";

/**
 * Hook for report order navigation.
 * @returns {ReportOrderNavigation} - Navigation functions
 */
export const useReportOrderNavigation = (): ReportOrderNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back.
   * @returns {void} - Nothing
   */
  const goBack = (): void => {
    navigate(-1);
  };

  return { goBack };
};

/**
 * Create report order list state without rows.
 * @param {boolean} isLoading - Whether the list is loading
 * @param {boolean} isMissingData - Whether the API response data is missing
 * @param {string | null} errorMessage - List error message
 * @returns {ReportOrderListState} - Empty list state
 */
const _createListState = (isLoading: boolean, isMissingData: boolean, errorMessage: string | null): ReportOrderListState => ({
  isLoading,
  errorMessage,
  isMissingData,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Derive list state from the API response envelope.
 * @param {ReturnType<typeof useGetRentalOrdersQuery>} queryResult - RTK Query result
 * @returns {ReportOrderListState} - Derived state
 */
const _deriveReportOrderListState = (queryResult: ReturnType<typeof useGetRentalOrdersQuery>): ReportOrderListState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) return _createListState(true, false, null);

  if (error) return _createListState(false, false, "Unable to load orders.");

  if (!data) return _createListState(false, true, "No response received from server.");

  if (!data.data) return _createListState(false, true, "Response is missing data payload.");

  return {
    isLoading: false,
    errorMessage: null,
    isMissingData: false,
    paginatedData: sortReportOrders(data.data.map(mapRentalOrder)),
    totalPages: data.total_pages,
    totalCount: data.total_count,
  };
};

/**
 * Trigger a browser download for a blob object URL, then release it.
 * @param {string} objectUrl - Blob object URL
 * @returns {void} - Nothing
 */
const _downloadFile = (objectUrl: string): void => {
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = REPORT_CONFIG.EXPORT_FILE_NAME;
  link.click();
  URL.revokeObjectURL(objectUrl);
};

/**
 * Hook for exporting the rental order report.
 * @returns {ReportOrderExport} - Export state and handler
 */
export const useReportOrderExport = (): ReportOrderExport => {
  const [exportRentalOrders, { isLoading: isExporting }] = useExportRentalOrdersMutation();

  /**
   * Download the order report from the export endpoint.
   * @returns {void} - Nothing
   */
  const onExport = (): void => {
    if (isExporting) return;

    void exportRentalOrders().unwrap().then(_downloadFile).catch(() => {
      window.alert("Unable to export order report. Please try again.");
    });
  };

  return { isExporting, onExport };
};

/**
 * Hook for confirming an order as done.
 * @returns {ReportOrderConfirm} - Confirmation state and handlers
 */
export const useReportOrderConfirm = (): ReportOrderConfirm => {
  const [confirmOrder, setConfirmOrder] = useState<ReportOrderData | null>(null);
  const [updateRentalOrder, { isLoading: isSubmitting }] = useUpdateRentalOrderMutation();
  const { logEdit } = useMasterActivityLog(REPORT_CONFIG.ACTIVITY_PAGE);

  /**
   * Close the confirmation modal.
   * @returns {void} - Nothing
   */
  const onCancelConfirm = (): void => setConfirmOrder(null);

  /**
   * Mark the selected order as done and log the edit.
   * @returns {void} - Nothing
   */
  const onConfirm = (): void => {
    if (!confirmOrder) return;

    void updateRentalOrder(buildOrderUpdateRequest(confirmOrder, REPORT_CONFIG.STATUS_DONE))
      .unwrap()
      .then(() => logEdit(confirmOrder.orderNo))
      .catch(() => undefined);
  };

  return {
    confirmOrder,
    confirmMessage: buildConfirmMessage(confirmOrder?.orderNo ?? ""),
    isSubmitting,
    onEditStatus: setConfirmOrder,
    onConfirm,
    onCancelConfirm,
  };
};

/**
 * Hook for API-backed report order pagination.
 * @returns {ReportOrderPagination} - Report order pagination state and handlers
 */
export const useReportOrderPagination = (): ReportOrderPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(REPORT_CONFIG.DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState("");
  const { logView } = useMasterActivityLog(REPORT_CONFIG.ACTIVITY_PAGE);

  useEffect(() => {
    void logView();
  }, [logView]);

  const queryResult = useGetRentalOrdersQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _deriveReportOrderListState(queryResult);

  /**
   * Handle page change.
   * @param {number} page - New page number
   * @returns {void} - Nothing
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, derived.totalPages)));

  /**
   * Handle page size change.
   * @param {number} size - New page size
   * @returns {void} - Nothing
   */
  const changePageSize = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };

  /**
   * Handle search term change.
   * @param {string} value - Search term
   * @returns {void} - Nothing
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
    changePageSize,
    setSearchTerm: handleSearchTerm,
  };
};
