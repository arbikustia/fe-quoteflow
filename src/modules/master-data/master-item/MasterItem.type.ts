import type { ChangeEvent } from "react";
import { z } from "zod";

import type { ApiEnvelope, ApiMessages, PaginatedResponse } from "@/types/api.type";

import { ITEM_ACTIVE_STATUS, ITEM_EMPTY_VALUE } from "./MasterItem.config";

/** Item status as shown in the UI. */
export type ItemStatus = "active" | "inactive";

/** QR label download format. */
export type ItemDownloadFormat = "image" | "pdf";

/** Raw item record as returned by `GET /api/item/paged`. */
export const ApiItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category_id: z.string().nullable(),
  category_name: z.string().nullish(),
  price: z.number().nullable(),
  stock: z.number().nullable(),
  image: z.string().nullable(),
  duration: z.number().nullable(),
  remark: z.string().nullable(),
  status: z.number(),
  created_at: z.string().nullable(),
  created_by: z.string().nullable(),
});

/** Raw item record as returned by the API (also consumed by other modules). */
export type ApiItem = z.input<typeof ApiItemSchema>;

/** Item row normalized for the list view; `source` keeps the raw record for the edit page. */
export const ItemListItemSchema = ApiItemSchema.transform((item) => {
  const status: ItemStatus = item.status === ITEM_ACTIVE_STATUS ? "active" : "inactive";

  return {
    id: item.id,
    name: item.name,
    categoryName: item.category_name || ITEM_EMPTY_VALUE,
    price: item.price ?? 0,
    stock: item.stock ?? 0,
    duration: item.duration ?? 0,
    image: item.image,
    remark: item.remark || ITEM_EMPTY_VALUE,
    status,
    source: item,
  };
});

/** Item row ready for the list view. */
export type ItemData = z.output<typeof ItemListItemSchema>;

/** Paged item list response. */
export type ItemListResponse = PaginatedResponse<ApiItem> & {
  status: boolean;
  messages: ApiMessages;
};

/** Item lookup response from `GET /api/item/get-all-item`. */
export type ItemAllResponse = ApiEnvelope<ApiItem[]>;

/** Create / update response for a single item. */
export type ItemMutationResponse = ApiEnvelope<ApiItem | null>;

/** Image upload response. */
export type ImageUploadResponse = {
  file_name: string;
  content_type: string;
  size: number;
  url: string;
};

/** Create item request body. */
export type ItemCreatePayload = {
  name: string;
  category_id: string;
  price: number;
  stock: number;
  image: string;
  duration: number;
  remark: string;
  status: number;
};

/** Update item request body. */
export type ItemUpdatePayload = ItemCreatePayload & {
  id: string;
};

/** Paged item list query params. */
export type ItemListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

/** Which part of the list view is rendered. */
export type ItemListStatus = "loading" | "error" | "missing" | "empty" | "ready";

/** List statuses that render a message instead of rows. */
export type ItemListMessageStatus = Exclude<ItemListStatus, "loading" | "ready">;

/** Normalized paged list data. */
export type ItemListView = {
  listStatus: ItemListStatus;
  items: ItemData[];
  totalPages: number;
  totalCount: number;
};

/** Raw RTK Query state consumed by the list normalizer. */
export type ItemListQueryState = {
  data?: ItemListResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Router state the list page receives after a create / update. */
export type ItemRouteState = {
  successMessage?: string;
} | null;

/** Item fields printed on a QR label. */
export type ItemLabel = Pick<ItemData, "id" | "name" | "categoryName">;

/** Position and width of one QR label on a PDF page. */
export type ItemLabelPosition = {
  page: number;
  x: number;
  y: number;
  width: number;
};

/** Paging and search state of the item list. */
export type ItemListPaging = {
  queryParams: ItemListParams;
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** Navigation handlers of the item list. */
export type ItemNavigation = {
  handleBack: () => void;
  handleCreate: () => void;
  handleEdit: (item: ItemData) => void;
};

/** QR download state and handlers of the item list. */
export type ItemDownloadState = {
  selectedItemIds: string[];
  isMultiDownloadMode: boolean;
  handleToggleItem: (item: ItemData) => void;
  handleStartMultiDownload: () => void;
  handleCancelMultiDownload: () => void;
  handleDownload: (item: ItemData, format: ItemDownloadFormat) => void;
  handleDownloadSelected: () => void;
};

/** Item list state and handlers owned by the module hook. */
export type MasterItemController = ItemListPaging & ItemNavigation & ItemDownloadState;

/** Inputs of the table column builder. */
export type ItemColumnParams = {
  currentPage: number;
  pageSize: number;
  canEdit: boolean;
  isMultiDownloadMode: boolean;
  selectedItemIds: string[];
  onToggleItem: (item: ItemData) => void;
  onEdit: (item: ItemData) => void;
  onDownload: (item: ItemData, format: ItemDownloadFormat) => void;
};

/** Props of the item mobile card. */
export type ItemMobileCardProps = {
  item: ItemData;
  canEdit: boolean;
  onEdit: (item: ItemData) => void;
};

/** Props of the item list view. */
export type MasterItemProps = ItemListView & {
  currentPage: number;
  pageSize: number;
  canCreate: boolean;
  canEdit: boolean;
  successMessage?: string;
  selectedItemIds: string[];
  isMultiDownloadMode: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onCreate: () => void;
  onEdit: (item: ItemData) => void;
  onToggleItem: (item: ItemData) => void;
  onStartMultiDownload: () => void;
  onCancelMultiDownload: () => void;
  onDownload: (item: ItemData, format: ItemDownloadFormat) => void;
  onDownloadSelected: () => void;
};
