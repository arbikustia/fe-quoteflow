import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetRentalChecklistsQuery, useLazyGetRentalChecklistByIdQuery } from "@/services/rental-checklist.service";

import { downloadChecklistPdf } from "./ItemChecklist.pdf";
import type { ApiChecklist, ChecklistListState, ChecklistRow } from "./ItemChecklist.type";

const _mapChecklist = (checklist: ApiChecklist): ChecklistRow => {
  let status: ChecklistRow["status"] = "unavailable";

  if (checklist.status !== null) {
    status = checklist.status === 1 ? "active" : "inactive";
  }

  return {
    id: checklist.id,
    checklistNo: checklist.checklist_no,
    checklistDate: checklist.checklist_date,
    itemCount: checklist.items.length,
    status,
    orderId: checklist.order_id,
  };
};

export const useItemChecklistNavigation = (): Pick<ChecklistListState, "onBack" | "onCreate" | "onRowClick" | "onEdit" | "onDownload" | "isDownloadingId"> => {
  const navigate = useNavigate();
  const [getChecklist] = useLazyGetRentalChecklistByIdQuery();
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
      downloadChecklistPdf(response.data);
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
  const query = useGetRentalChecklistsQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const rows = query.data?.status ? query.data.data.map(_mapChecklist) : [];
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
