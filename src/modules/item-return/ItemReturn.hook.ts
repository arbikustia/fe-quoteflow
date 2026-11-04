import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import { useGetRentalReturnsPagedQuery } from "@/services/rental-return.service";

import type { ApiReturn, ReturnListState, ReturnRow } from "./ItemReturn.type";

/**
 * Map API return record into table/card display row.
 * @param {ApiReturn} item - API return item
 * @returns {ReturnRow} Display row
 */
export const mapReturn = (item: ApiReturn): ReturnRow => {
  let status: ReturnRow["status"] = "unavailable";

  if (item.status !== null) {
    status = item.status === 1 ? "active" : "inactive";
  }

  return {
    id: item.id,
    orderId: item.order_id,
    returnDate: item.return_date,
    itemCount: Array.isArray(item.items) ? item.items.length : 0,
    notes: item.notes || "-",
    status,
  };
};

/**
 * Return navigation handlers for item return module.
 * @returns {Pick<ReturnListState, "onBack" | "onCreate" | "onEdit" | "onRowClick">} Navigation callbacks
 */
export const useItemReturnNavigation = (): Pick<ReturnListState, "onBack" | "onCreate" | "onEdit" | "onRowClick"> => {
  const navigate = useNavigate();

  const onBack = (): void => {
    void navigate("/home");
  };

  const onCreate = (): void => {
    void navigate("/item-return/create");
  };

  const onEdit = (row: ReturnRow): void => {
    void navigate(`/item-return/create/${row.id}`);
  };

  const onRowClick = (row: ReturnRow): void => {
    void navigate(`/item-return/create/${row.id}`);
  };

  return { onBack, onCreate, onEdit, onRowClick };
};

/**
 * Return data fetching and pagination state for item return list.
 * @returns {Omit<ReturnListState, "onBack" | "onCreate" | "onEdit" | "onRowClick">} List state
 */
export const useItemReturnList = (): Omit<ReturnListState, "onBack" | "onCreate" | "onEdit" | "onRowClick"> => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTermState] = useState("");
  const { logView } = useMasterActivityLog("Item Return");

  useEffect(() => {
    let active = true;
    void logView().then(() => {
      if (!active) return;
    });

    return () => {
      active = false;
    };
  }, [logView]);

  const query = useGetRentalReturnsPagedQuery({
    pageNumber: currentPage,
    pageSize,
    searchTerm,
  });

  const rows = query.data?.status && Array.isArray(query.data.data)
    ? query.data.data.map(mapReturn)
    : [];

  let errorMessage: string | null = null;
  if (query.error) {
    errorMessage = "Unable to load item returns.";
  } else if (query.data && !query.data.status) {
    errorMessage = query.data.messages?.join(" ") || "Error loading item returns.";
  }

  const totalPages = query.data?.total_pages ?? 0;
  const setSearchTerm = (value: string): void => {
    setSearchTermState(value);
    setCurrentPage(1);
  };
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, totalPages || 1)));
  const changePageSize = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    pageSize,
    totalCount: query.data?.total_count ?? 0,
    rows,
    isLoading: query.isLoading,
    errorMessage,
    isEmpty: !query.isLoading && !errorMessage && rows.length === 0,
    setSearchTerm,
    goToPage,
    changePageSize,
  };
};

/**
 * Return full combined state for item return page.
 * @returns {ReturnListState} Complete state
 */
export const useItemReturnState = (): ReturnListState => ({
  ...useItemReturnList(),
  ...useItemReturnNavigation(),
});
