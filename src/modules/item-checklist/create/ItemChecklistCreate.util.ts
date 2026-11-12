import type { MouseEvent } from "react";

import type { SelectOption } from "@/components/Select";

import type { ApiChecklist } from "../ItemChecklist.type";
import { getOrderCustomerName } from "../ItemChecklist.util";

import type {
  ChecklistDataState,
  ChecklistOrderItemRow,
  OrderItemSource,
  UseItemChecklistDataInput,
} from "./ItemChecklistCreate.type";

import type { ApiRentalOrder } from "@/modules/report/Report.type";

/**
 * Map rental orders to select options.
 * @param {ApiRentalOrder[]} orders - rental orders
 * @returns {SelectOption[]} - order select options
 */
export const getOrderOptions = (orders: ApiRentalOrder[]): SelectOption[] =>
  orders.map((order) => ({
    value: order.id,
    label: `${getOrderCustomerName(order)} — ${order.order_no}`,
  }));

/**
 * Map an existing checklist to form rows.
 * @param {ApiChecklist} checklist - existing checklist
 * @param {Map<string, string>} categories - category lookup
 * @returns {ChecklistOrderItemRow[]} - mapped checklist items
 */
export const getChecklistItems = (
  checklist: ApiChecklist,
  categories: Map<string, string>,
): ChecklistOrderItemRow[] => checklist.items.map((item) => ({
  id: item.id,
  itemId: item.item_id,
  itemName: item.item_name || item.description,
  category: categories.get(item.item_id) ?? "-",
  qty: item.qty,
  unit: item.qty === 1 ? "unit" : "units",
  moveOut: "",
  moveIn: "",
  sign: item.sign,
}));

/**
 * Map one order item to a form row.
 * @param {OrderItemSource} item - order item
 * @param {string} id - row id
 * @param {string} picName - person in charge name
 * @returns {ChecklistOrderItemRow} - mapped checklist item
 */
const _getOrderItem = (
  item: OrderItemSource,
  id: string,
  picName: string,
): ChecklistOrderItemRow => ({
  id,
  itemId: item.item_id,
  itemName: item.item_name ?? "",
  category: item.category_name ?? "-",
  qty: item.qty,
  unit: item.qty === 1 ? "unit" : "units",
  moveOut: "",
  moveIn: "",
  sign: picName,
});

/**
 * Map a rental order to form rows.
 * @param {ApiRentalOrder} [order] - rental order
 * @returns {ChecklistOrderItemRow[]} - order items rows
 */
export const getOrderItems = (order?: ApiRentalOrder): ChecklistOrderItemRow[] => {
  if (!order) return [];

  const transaction = order.invoice?.quotation?.transaction;
  const picName = transaction?.pic?.name ?? "-";
  const rows = (transaction?.rental_transaction_items ?? []).map((item, index) =>
    _getOrderItem({ ...item, item_id: item.item_id ?? "" }, `${item.item_id ?? ""}-${index}`, picName));

  (transaction?.rental_transaction_project ?? []).forEach((project, projectIndex) => {
    project.items?.forEach((item, itemIndex) => {
      rows.push(_getOrderItem({ ...item, item_id: item.item_id ?? "" }, `${item.item_id ?? ""}-proj-${projectIndex}-${itemIndex}`, picName));
    });
  });

  return rows;
};

/**
 * Build the item category lookup.
 * @param {UseItemChecklistDataInput} input - checklist data input
 * @returns {Map<string, string>} - item category lookup map
 */
const _getCategories = (input: UseItemChecklistDataInput): Map<string, string> => {
  const categories = new Map<string, string>();

  if (input.itemsStatus && input.itemsData) {
    input.itemsData.forEach((item) => {
      if (item.category_name) categories.set(item.id, item.category_name);
    });
  }

  return categories;
};

/**
 * Resolve checklist form data from API query results.
 * @param {UseItemChecklistDataInput} input - checklist data input
 * @returns {ChecklistDataState} - checklist form state
 */
export const getChecklistData = (input: UseItemChecklistDataInput): ChecklistDataState => {
  const orders = input.ordersStatus ? input.ordersData : undefined;
  const selectedOrder = orders?.find((order) => order.id === input.selectedOrderId);
  const checklist = input.detailData ?? null;
  const orderItems = input.isEditMode && checklist
    ? getChecklistItems(checklist, _getCategories(input))
    : getOrderItems(selectedOrder);

  return {
    orderOptions: orders ? getOrderOptions(orders) : [],
    selectedOrder,
    checklist,
    orderItems,
  };
};

/**
 * Get the table row key of an order item.
 * @param {ChecklistOrderItemRow} row - Order item row
 * @returns {string} Row key
 */
export const getOrderItemRowKey = (row: ChecklistOrderItemRow): string => row.id;

/**
 * Get the empty-state text for the items list.
 * @param {string} searchTerm - Active search term
 * @returns {string} Empty-state text
 */
export const getOrderItemsEmptyText = (searchTerm: string): string => searchTerm ? "No items matching search." : "No items found for this order.";

/**
 * Stop a click from bubbling to the table row.
 * @param {MouseEvent} event - Click event
 * @returns {void} No return value
 */
export const stopClickPropagation = (event: MouseEvent): void => event.stopPropagation();

/**
 * Ignore manual checkbox changes; move status is set only by barcode scan.
 * @returns {void} No return value
 */
export const ignoreManualChange = (): void => undefined;
