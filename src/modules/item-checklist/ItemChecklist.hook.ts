import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import { useGetRentalChecklistsQuery, useLazyGetRentalChecklistByIdQuery } from "@/services/rental-checklist.service";
import { useGetRentalOrderOptionsQuery } from "@/services/rental-order.service";

import { downloadChecklistPdf } from "./ItemChecklist.pdf";
import type { ApiChecklist, ChecklistListState, ChecklistRow } from "./ItemChecklist.type";
import type { ApiRentalOrder } from "@/modules/report/Report.type";
import { getOrderCustomerName } from "./ItemChecklist.helpers";

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

export const useItemChecklistNavigation = (): Pick<ChecklistListState, "onBack" | "onCreate" | "onRowClick" | "onEdit" | "onDownload" | "isDownloadingId"> => {
  const navigate = useNavigate();
  const [getChecklist] = useLazyGetRentalChecklistByIdQuery();
  const ordersQuery = useGetRentalOrderOptionsQuery();
  const [isDownloadingId, setIsDownloadingId] = useState<string | null>(null);
  const onBack = (): void => { void navigate("/home"); };
  const onCreate = (): void => { void navigate("/item-checklist/create"); };
  const onRowClick = (row: ChecklistRow): void => { void navigate(`/item-checklist/${row.id}`); };
  const onEdit = (row: ChecklistRow): void => { void navigate(`/item-checklist/create/${row.id}`); };
  const onDownload = (row: ChecklistRow): void => {
    if (isDownloadingId) return;
    setIsDownloadingId(row.id);
    void getChecklist(row.id).unwrap().then((response) => {
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

export const useItemChecklistList = (): Omit<ChecklistListState, "onBack" | "onCreate" | "onRowClick" | "onEdit" | "onDownload" | "isDownloadingId"> => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTermState] = useState("");
  const { logView } = useMasterActivityLog("Item Checklist");

  useEffect(() => {
    let active = true;
    void logView().then(() => {
      if (!active) return;
    });

    return () => {
      active = false;
    };
  }, [logView]);

  const query = useGetRentalChecklistsQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const ordersQuery = useGetRentalOrderOptionsQuery();
  const orderMap = useMemo(() => {
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
  const setSearchTerm = (value: string): void => { setSearchTermState(value); setCurrentPage(1); };
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, totalPages || 1)));
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };

  return { currentPage, totalPages, pageSize, totalCount: query.data?.total_count ?? 0, rows, isLoading: query.isLoading, errorMessage, isEmpty: !query.isLoading && !errorMessage && rows.length === 0, setSearchTerm, goToPage, changePageSize };
};

export const useItemChecklistState = (): ChecklistListState => ({ ...useItemChecklistList(), ...useItemChecklistNavigation() });
