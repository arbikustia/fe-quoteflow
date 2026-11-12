import type { ChangeEvent } from "react";
import { z } from "zod";

import { formatIndonesianDateTime } from "@/utils/date.helpers";

import type { ApiEnvelope, PaginatedResponse } from "@/types/api.type";

import { PIC_ACTIVE_STATUS, PIC_EMPTY_VALUE } from "./MasterPic.config";

/** PIC status as shown in the UI. */
export type PicStatus = "active" | "inactive";

/** API status code (`1` = active) mapped to the UI status. */
const PicStatusSchema = z
  .number()
  .catch(0)
  .transform((status): PicStatus => (status === PIC_ACTIVE_STATUS ? "active" : "inactive"));

/** API timestamp formatted for display, with a placeholder when absent. */
const PicDateSchema = z
  .string()
  .nullish()
  .transform((value): string => (value ? formatIndonesianDateTime(value) : PIC_EMPTY_VALUE));

/** PIC row from `GET /api/pic/paged`, normalized for display. */
export const PicListItemSchema = z
  .object({
    id: z.string(),
    name: z.string().nullish().transform((value): string => value || PIC_EMPTY_VALUE),
    status: PicStatusSchema,
    created_at: PicDateSchema,
  })
  .transform((pic) => ({
    id: pic.id,
    name: pic.name,
    status: pic.status,
    createdAt: pic.created_at,
  }));

/** Raw PIC record as returned by the API. */
export type ApiPic = z.input<typeof PicListItemSchema> & {
  updated_at?: string | null;
  created_by?: string | null;
};

/** PIC row ready for the list view. */
export type PicData = z.output<typeof PicListItemSchema>;

/** Paged PIC list response. */
export type PicListResponse = PaginatedResponse<ApiPic>;

/** Create / update response for a single PIC. */
export type PicMutationResponse = ApiEnvelope<ApiPic | null>;

/** PIC lookup item from `GET /api/pic/get-all-pic`. */
export type PicOption = {
  id: string;
  name: string;
};

/** PIC lookup response (consumed by the order form). */
export type PicAllResponse = ApiEnvelope<PicOption[]>;

/** Create PIC request body. */
export type PicCreatePayload = {
  name: string;
  status: number;
};

/** Update PIC request body. */
export type PicUpdatePayload = PicCreatePayload & {
  id: string;
};

/** Paged PIC list query params. */
export type PicListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

/** Which part of the list view is rendered. */
export type PicListStatus = "loading" | "error" | "missing" | "empty" | "ready";

/** List statuses that render a message instead of rows. */
export type PicListMessageStatus = Exclude<PicListStatus, "loading" | "ready">;

/** Normalized paged list data. */
export type PicListView = {
  listStatus: PicListStatus;
  pics: PicData[];
  totalPages: number;
  totalCount: number;
};

/** Raw RTK Query state consumed by the list normalizer. */
export type PicListQueryState = {
  data?: PicListResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Router state the list page receives after a create / update. */
export type PicRouteState = {
  successMessage?: string;
} | null;

/** Router state the edit page receives from the list (no GET-by-id endpoint exists). */
export type PicEditRouteState = {
  pic?: PicData;
} | null;

/** Paging and search state of the PIC list. */
export type PicListPaging = {
  queryParams: PicListParams;
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** Navigation handlers of the PIC list. */
export type PicNavigation = {
  handleBack: () => void;
  handleCreate: () => void;
  handleEdit: (pic: PicData) => void;
};

/** PIC list state and handlers owned by the module hook. */
export type MasterPicController = PicListPaging & PicNavigation;

/** Props of the PIC mobile card. */
export type PicMobileCardProps = {
  pic: PicData;
  canEdit: boolean;
  onEdit: (pic: PicData) => void;
};

/** Props of the PIC list view. */
export type MasterPicProps = PicListView & {
  currentPage: number;
  pageSize: number;
  canCreate: boolean;
  canEdit: boolean;
  successMessage?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onCreate: () => void;
  onEdit: (pic: PicData) => void;
};
