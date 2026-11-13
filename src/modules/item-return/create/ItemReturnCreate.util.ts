import type { SelectOption } from "@/components/Select";

import type { ApiReturn, ReturnCreatePayload, ReturnItemPayload } from "../ItemReturn.type";

import type { ReturnItemOverrides, ReturnOrderItemRow, ReturnPayloadParams, ReturnPhotoOverrides, ReturnSaveError, ReturnSaveInput, ReturnSaveValidationInput, ReturnSourceItem } from "./ItemReturnCreate.type";

import type { ApiItem } from "@/modules/master-data/master-item/MasterItem.type";
import type { ApiRentalOrder } from "@/modules/report/Report.type";

/**
 * Get the customer name of a rental order.
 * @param {ApiRentalOrder} order - Rental order
 * @returns {string} Customer name or empty string
 */
const _getCustomerName = (order: ApiRentalOrder): string =>
  order.invoice?.quotation?.transaction?.customer_name ?? order.invoice?.quotation?.transaction?.customer?.name ?? "";

/**
 * Build rental order select options.
 * @param {ApiRentalOrder[]} orders - Rental orders
 * @returns {SelectOption[]} Select options
 */
export const getOrderOptions = (orders: ApiRentalOrder[]): SelectOption[] =>
  orders.map((order) => ({ value: order.id, label: `${_getCustomerName(order)} — ${order.order_no}` }));

/**
 * Get the unit label for a quantity.
 * @param {number} qty - Quantity
 * @returns {string} Unit label
 */
export const getQtyUnit = (qty: number): string => (qty === 1 ? "unit" : "units");

/**
 * Use the list when present, otherwise wrap the single value.
 * @param {string[]} [list] - Value list
 * @param {string} [single] - Single value
 * @returns {string[]} Values
 */
export const firstOrFallback = (list?: string[], single?: string): string[] => {
  if (list?.length) {
    return list;
  }

  return single ? [single] : [];
};

/**
 * Build item id to category name map.
 * @param {ApiItem[]} items - Master items
 * @returns {Map<string, string>} Category map
 */
export const buildItemCategoryMap = (items: ApiItem[]): Map<string, string> =>
  new Map(items.filter((item) => Boolean(item.category_name)).map((item): [string, string] => [item.id, item.category_name as string]));

/**
 * Map saved return items into form rows.
 * @param {ApiReturn} returnData - Saved return
 * @param {Map<string, string>} categories - Category map
 * @returns {ReturnOrderItemRow[]} Form rows
 */
export const getReturnItems = (returnData: ApiReturn, categories: Map<string, string>): ReturnOrderItemRow[] =>
  returnData.items.map((item): ReturnOrderItemRow => ({
    id: item.id,
    itemId: item.item_id,
    itemName: item.item_name || item.notes || `Item ${item.item_id.slice(0, 8)}`,
    category: item.category_name || categories.get(item.item_id) || "-",
    qty: item.qty,
    unit: getQtyUnit(item.qty),
    condition: item.condition || "Good",
    notes: item.notes || "",
    fileUrls: item.images ? item.images.map((img) => img.file_url) : firstOrFallback(item.file_urls, item.file_url),
    fileNames: item.images ? item.images.map((img) => img.file_name) : firstOrFallback(item.file_names, item.file_name),
  }));

/**
 * Build a fresh form row for an order item.
 * @param {string} id - Row id
 * @param {ReturnSourceItem} item - Order item
 * @param {Map<string, string>} categories - Category map
 * @returns {ReturnOrderItemRow} Form row
 */
const _toOrderRow = (id: string, item: ReturnSourceItem, categories: Map<string, string>): ReturnOrderItemRow => ({
  id,
  itemId: item.item_id,
  itemName: item.item_name ?? "",
  category: item.category_name || categories.get(item.item_id) || "-",
  qty: item.qty,
  unit: getQtyUnit(item.qty),
  condition: "Good",
  notes: "",
  fileUrls: [],
  fileNames: [],
});

/**
 * Map order transaction items into form rows.
 * @param {ApiRentalOrder | undefined} order - Selected order
 * @param {Map<string, string>} categories - Category map
 * @returns {ReturnOrderItemRow[]} Form rows
 */
export const getOrderItems = (order: ApiRentalOrder | undefined, categories: Map<string, string>): ReturnOrderItemRow[] => {
  const transaction = order?.invoice?.quotation?.transaction;

  if (!transaction) {
    return [];
  }

  const standardRows = (transaction.rental_transaction_items ?? []).map((item, index) =>
    _toOrderRow(`${item.item_id}-${index}`, item as ReturnSourceItem, categories));
  const projectRows = (transaction.rental_transaction_project ?? []).flatMap((project, projectIndex) =>
    (project.items ?? []).map((item, itemIndex) => _toOrderRow(`${item.item_id}-proj-${projectIndex}-${itemIndex}`, item, categories)));

  return [...standardRows, ...projectRows];
};

/**
 * Apply condition, notes and photo overrides to rows.
 * @param {ReturnOrderItemRow[]} rows - Base rows
 * @param {ReturnItemOverrides} overrides - Condition and notes overrides
 * @param {ReturnPhotoOverrides} photos - Photo overrides
 * @returns {ReturnOrderItemRow[]} Rows with overrides
 */
export const applyItemOverrides = (rows: ReturnOrderItemRow[], overrides: ReturnItemOverrides, photos: ReturnPhotoOverrides): ReturnOrderItemRow[] =>
  rows.map((item) => ({
    ...item,
    condition: overrides[item.id]?.condition ?? item.condition,
    notes: overrides[item.id]?.notes ?? item.notes,
    fileUrls: photos.get(item.id)?.fileUrls ?? item.fileUrls,
    fileNames: photos.get(item.id)?.fileNames ?? item.fileNames,
  }));

/**
 * Filter rows by name, category or condition.
 * @param {ReturnOrderItemRow[]} rows - Rows
 * @param {string} searchTerm - Search term
 * @returns {ReturnOrderItemRow[]} Matching rows
 */
export const filterReturnItems = (rows: ReturnOrderItemRow[], searchTerm: string): ReturnOrderItemRow[] => {
  const lower = searchTerm.trim().toLowerCase();

  if (!lower) {
    return rows;
  }

  return rows.filter((item) => [item.itemName, item.category, item.condition].some((value) => value.toLowerCase().includes(lower)));
};

/**
 * Format date to MM-DD-YYYY 12:00:00.
 * @param {Date} date - Date
 * @returns {string} Formatted date
 */
export const formatReturnDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${month}-${day}-${date.getFullYear()} 12:00:00`;
};

/**
 * Build one return item payload.
 * @param {ReturnOrderItemRow} row - Form row
 * @param {ReturnPayloadParams} params - Payload params
 * @returns {ReturnItemPayload} Item payload
 */
const _buildItemPayload = (row: ReturnOrderItemRow, params: ReturnPayloadParams): ReturnItemPayload => {
  const existing = params.isEditMode ? params.existingItems?.find((item) => item.item_id === row.itemId) : undefined;

  return {
    return_id: existing?.return_id,
    item_id: row.itemId,
    qty: row.qty,
    condition: row.condition,
    notes: row.notes,
    file_url: row.fileUrls[0] || "",
    file_name: row.fileNames[0] || "",
    images: row.fileUrls.map((url, index) => ({ file_url: url, file_name: row.fileNames[index] || "" })),
    status: existing?.status ?? 0,
  };
};

/**
 * Build the return create/update payload.
 * @param {ReturnPayloadParams} params - Payload params
 * @returns {ReturnCreatePayload} Payload
 */
export const buildReturnPayload = (params: ReturnPayloadParams): ReturnCreatePayload => ({
  order_id: params.orderId,
  return_date: formatReturnDate(params.returnDate ? new Date(params.returnDate) : new Date()),
  notes: params.returnNotes,
  status: params.status,
  items: params.rows.filter((row) => params.returnItemIds.includes(row.id)).map((row) => _buildItemPayload(row, params)),
});

/**
 * Validate save preconditions.
 * @param {ReturnSaveValidationInput} input - Validation input
 * @returns {string | null} Validation error
 */
export const getSaveValidationError = (input: ReturnSaveValidationInput): string | null => {
  if (input.isEditMode && (!input.hasReturnData || !input.hasId)) {
    return "Unable to load item return.";
  }

  if (!input.isEditMode && !input.hasSelectedOrder) {
    return "Please select a rental order first.";
  }

  if (input.isUploading) {
    return "Wait for photo upload to finish.";
  }

  if (input.hasPreview) {
    return "Confirm or discard photo before saving.";
  }

  return input.itemCount === 0 ? "No items available to return for this order." : null;
};

/**
 * Read a user-facing mutation error message.
 * @param {ReturnSaveError} error - Mutation error
 * @returns {string} User-facing message
 */
export const getSaveErrorMessage = (error: ReturnSaveError): string => {
  let message: string | string[] | undefined;

  if ("data" in error) {
    message = error.data as string | string[];
  }
  else if ("message" in error) {
    message = error.message;
  }

  if (Array.isArray(message)) {
    return message.join(" ");
  }

  return typeof message === "string" ? message : "Unable to save item return.";
};

/**
 * Read an error message from a thrown value.
 * @param {Error | string | null | undefined} error - Thrown value
 * @param {string} fallback - Fallback message
 * @returns {string} Message
 */
export const getThrownMessage = (error: Error | string | null | undefined, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

/**
 * Remove an index from a list.
 * @param {string[]} list - List
 * @param {number} index - Index to remove
 * @returns {string[]} List without the index
 */
export const removeAt = (list: string[], index: number): string[] => list.filter((_value, position) => position !== index);

/**
 * Build the save payload from the form state and the rows with uploaded photos.
 * @param {ReturnSaveInput} input - Save dependencies
 * @param {ReturnOrderItemRow[]} rows - Rows with uploaded photos
 * @returns {ReturnCreatePayload} - Return payload
 */
export const buildSubmitPayload = (input: ReturnSaveInput, rows: ReturnOrderItemRow[]): ReturnCreatePayload => {
  const { source, fields } = input;

  return buildReturnPayload({
    orderId: source.returnData?.order_id ?? fields.selectedOrderId,
    returnDate: fields.returnDate,
    returnNotes: fields.returnNotes,
    status: source.isEditMode ? (source.returnData?.status ?? 1) : 1,
    rows,
    returnItemIds: source.returnItemIds,
    isEditMode: source.isEditMode,
    existingItems: source.returnData?.items,
  });
};

/**
 * Validate the form before saving.
 * @param {ReturnSaveInput} input - Save dependencies
 * @returns {string | null} - Validation message, or null when valid
 */
export const getReturnSaveError = (input: ReturnSaveInput): string | null => {
  const { source, photos } = input;

  return getSaveValidationError({
    isEditMode: source.isEditMode,
    hasId: Boolean(input.id),
    hasReturnData: Boolean(source.returnData),
    hasSelectedOrder: Boolean(source.selectedOrder),
    isUploading: photos.guards.upload.current,
    hasPreview: Boolean(photos.view.photoPreview),
    itemCount: source.returnItemIds.length,
  });
};

/**
 * Pick the id/name used for the activity log entry.
 * @param {ReturnSaveInput} input - Save dependencies
 * @returns {string} - Activity log name
 */
export const getActivityName = (input: ReturnSaveInput): string =>
  input.source.returnData?.id ?? input.source.selectedOrder?.id ?? input.id ?? "Item Return";
