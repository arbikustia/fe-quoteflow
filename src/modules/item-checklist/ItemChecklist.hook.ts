import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import { getOrderCustomerName } from "./ItemChecklist.helpers";
import { downloadChecklistPdf } from "./ItemChecklist.pdf";
import type { ApiChecklist, ChecklistListState, ChecklistRow } from "./ItemChecklist.type";

import type { ApiRentalOrder } from "@/modules/report/Report.type";
import { useGetRentalChecklistsQuery, useLazyGetRentalChecklistByIdQuery } from "@/services/rental-checklist.service";
import { useGetRentalOrderOptionsQuery } from "@/services/rental-order.service";

/**
 * Map API checklist to row data.
 * @param {ApiChecklist} checklist - API checklist response
 * @param {string} customerName - Associated customer name
 * @returns {ChecklistRow} - Mapped checklist row
 */
const _mapChecklist = (checklist: ApiChecklist, customerName: string): ChecklistRow => {
  let status: ChecklistRow["status"] = "unavailable";

  if (checklist.status === 1) {
    status = "inactive";
  } else if (checklist.status === 2) {
    status = "active";
  }

  return {
    id: checklist.id,
    checklistNo: checklist.checklist_no,
    customerName,
    checklistDate: checklist.checklist_date,
    itemCount: checklist.items.length,
    status,
    orderId: checklist.order_id,
  };
};

/**
 * Hook for checklist navigation handlers.
 * @returns {Pick<ChecklistListState, "onBack" | "onCreate" | "onRowClick" | "onEdit" | "onDownload" | "isDownloadingId">} - Navigation handlers
 */
export const useItemChecklistNavigation = (): Pick<ChecklistListState, "onBack" | "onCreate" | "onRowClick" | "onEdit" | "onDownload" | "isDownloadingId"> => {
  const navigate = useNavigate();
  const [getChecklist] = useLazyGetRentalChecklistByIdQuery();
  const ordersQuery = useGetRentalOrderOptionsQuery();
  const [isDownloadingId, setIsDownloadingId] = useState<string | null>(null);

  /**
   * Navigate back.
   * @returns {void}
   */
  const onBack = (): void => { navigate("/home"); };
  /**
   * Create checklist.
   * @returns {void}
   */
  const onCreate = (): void => { navigate("/item-checklist/create"); };
  /**
   * Navigate to row details.
   * @param {ChecklistRow} row - Checklist row
   * @returns {void}
   */
  const onRowClick = (row: ChecklistRow): void => { navigate(`/item-checklist/${row.id}`); };
  /**
   * Navigate to edit mode.
   * @param {ChecklistRow} row - Checklist row
   * @returns {void}
   */
  const onEdit = (row: ChecklistRow): void => { navigate(`/item-checklist/create/${row.id}`); };

  /**
   * Handle PDF download.
   * @param {ChecklistRow} row - Checklist row
   * @returns {void}
   */
  const onDownload = (row: ChecklistRow): void => {
    if (isDownloadingId) return;

    setIsDownloadingId(row.id);
    getChecklist(row.id).unwrap().then((response) => {
      if (!response.status || !response.data) throw new Error(response.messages.join(" ") || "Checklist detail unavailable.");

      const order = ordersQuery.data?.status
        ? ordersQuery.data.data.find((entry) => entry.id === response.data?.order_id)
        : undefined;

      if (!order) throw new Error("Rental order data unavailable.");

      downloadChecklistPdf(response.data, order);
    }).catch(() => {
      window.alert("Unable to download item checklist. Please try again.");
    }).finally(() => setIsDownloadingId(null));
  };

  return { onBack, onCreate, onRowClick, onEdit, onDownload, isDownloadingId };
};

/**
 * Hook for checklist list state.
 * @returns {Omit<ChecklistListState, "onBack" | "onCreate" | "onRowClick" | "onEdit" | "onDownload" | "isDownloadingId">} - List state and handlers
 */
export const useItemChecklistList = (): Omit<ChecklistListState, "onBack" | "onCreate" | "onRowClick" | "onEdit" | "onDownload" | "isDownloadingId"> => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTermState] = useState("");
  const { logView } = useMasterActivityLog("Item Checklist");

  useEffect(() => {
    let active = true;

    logView().then((): void => { if (!active) return; });

    return (): void => { active = false; };
  }, [logView]);

  const query = useGetRentalChecklistsQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const ordersQuery = useGetRentalOrderOptionsQuery();
  const orderMap: Map<string, ApiRentalOrder> = useMemo((): Map<string, ApiRentalOrder> => {
    const map = new Map<string, ApiRentalOrder>();

    if (ordersQuery.data?.status && ordersQuery.data.data) {
      ordersQuery.data.data.forEach((order) => map.set(order.id, order));
    }

    return map;
  }, [ordersQuery.data]);

  const rows = query.data?.status
    ? query.data.data.map((checklist) => _mapChecklist(checklist, getOrderCustomerName(orderMap.get(checklist.order_id))))
    : [];
  let errorMessage: string | null = null;

  if (query.error) {
    errorMessage = "Unable to load item checklists.";
  } else if (query.data && !query.data.status) {
    errorMessage = query.data.messages.join(" ");
  }

  const totalPages = query.data?.total_pages ?? 0;
  /**
   * Set search term.
   * @param {string} value - Search term value
   * @returns {void}
   */
  const setSearchTerm = (value: string): void => { setSearchTermState(value); setCurrentPage(1); };
  /**
   * Go to specific page.
   * @param {number} page - Page number
   * @returns {void}
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, totalPages || 1)));
  /**
   * Change page size.
   * @param {number} size - Page size
   * @returns {void}
   */
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };

  return { currentPage, totalPages, pageSize, totalCount: query.data?.total_count ?? 0, rows, isLoading: query.isLoading, errorMessage, isEmpty: !query.isLoading && !errorMessage && rows.length === 0, setSearchTerm, goToPage, changePageSize };
};

/**
 * Composed hook for checklist state.
 * @returns {ChecklistListState} - Full checklist list state
 */
export const useItemChecklistState = (): ChecklistListState => ({ ...useItemChecklistList(), ...useItemChecklistNavigation() });
