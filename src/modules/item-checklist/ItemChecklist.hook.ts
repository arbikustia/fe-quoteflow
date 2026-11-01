import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetRentalChecklistsQuery } from "@/services/rental-checklist.service";

import type { ApiChecklist, ChecklistListState, ChecklistRow } from "./ItemChecklist.type";

const _mapChecklist = (checklist: ApiChecklist): ChecklistRow => ({
  id: checklist.id,
  checklistNo: checklist.checklist_no,
  checklistDate: checklist.checklist_date,
  itemCount: checklist.items.length,
  status: checklist.status === 1 ? "active" : "inactive",
  orderId: checklist.order_id,
});

export const useItemChecklistNavigation = (): Pick<ChecklistListState, "onBack" | "onCreate" | "onRowClick" | "onEdit"> => {
  const navigate = useNavigate();
  const onBack = (): void => { void navigate("/home"); };
  const onCreate = (): void => { void navigate("/document/item-checklist/create"); };
  const onRowClick = (row: ChecklistRow): void => { void navigate(`/document/item-checklist/${row.id}`); };
  const onEdit = (row: ChecklistRow): void => { void navigate(`/document/item-checklist/create/${row.id}`); };

  return { onBack, onCreate, onRowClick, onEdit };
};

export const useItemChecklistList = (): Omit<ChecklistListState, "onBack" | "onCreate" | "onRowClick" | "onEdit"> => {
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
