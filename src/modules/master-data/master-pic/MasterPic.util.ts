import { z } from "zod";

import type { PicListQueryState, PicListStatus, PicListView } from "./MasterPic.type";
import { PicListItemSchema } from "./MasterPic.type";

const PicListSchema = z.array(PicListItemSchema);

/**
 * Build an empty list view for a state without rows.
 * @param {PicListStatus} listStatus - List state to render
 * @returns {PicListView} - List view without rows
 */
const _createEmptyListView = (listStatus: PicListStatus): PicListView => ({
  listStatus,
  pics: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Normalize the paged PIC query into list view data (single upstream fallback).
 * @param {PicListQueryState} queryState - RTK Query data and flags
 * @returns {PicListView} - Normalized list view data
 */
export const normalizePicList = (queryState: PicListQueryState): PicListView => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return _createEmptyListView("loading");
  }

  if (isError) {
    return _createEmptyListView("error");
  }

  const parsedPics = PicListSchema.safeParse(data?.data);

  if (!data || !parsedPics.success) {
    return _createEmptyListView("missing");
  }

  return {
    listStatus: parsedPics.data.length === 0 ? "empty" : "ready",
    pics: parsedPics.data,
    totalPages: data.total_pages,
    totalCount: data.total_count,
  };
};

/**
 * Calculate the display row number of an PIC table row.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} - One-based row number across pages
 */
export const getPicRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => {
  return (currentPage - 1) * pageSize + rowIndex + 1;
};
