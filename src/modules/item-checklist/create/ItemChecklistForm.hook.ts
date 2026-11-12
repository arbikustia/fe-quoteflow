import { useMemo, useState } from "react";

import type {
  ChecklistControls,
  ChecklistDataState,
  ChecklistFocusAt,
  ChecklistHandlers,
  ChecklistOrderItemRow,
  UseItemChecklistDataInput,
} from "./ItemChecklistCreate.type";
import { getChecklistData } from "./ItemChecklistCreate.util";

/**
 * Manage checklist form state.
 * @returns {ChecklistControls} - State and setters
 */
export const useItemChecklistFormState = (): ChecklistControls => {
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [focusAt, setFocusAt] = useState<ChecklistFocusAt>("moveOut");
  const [moveOutItemIds, setMoveOutItemIds] = useState<string[]>([]);
  const [moveInItemIds, setMoveInItemIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [highlightedRowId, setHighlightedRowId] = useState("");
  const [notFoundItemCode, setNotFoundItemCode] = useState("");

  return { selectedOrderId, setSelectedOrderId, focusAt, setFocusAt, moveOutItemIds, setMoveOutItemIds, moveInItemIds, setMoveInItemIds, searchTerm, setSearchTerm, saveErrorMessage, setSaveErrorMessage, highlightedRowId, setHighlightedRowId, notFoundItemCode, setNotFoundItemCode };
};

/**
 * Build checklist handlers.
 * @param {ChecklistControls} form - form controls
 * @returns {ChecklistHandlers} - handlers
 */
export const useChecklistHandlers = (form: ChecklistControls): ChecklistHandlers => {
  /**
   * Handle order change.
   * @param {string} value - value
   * @returns {void} No return value
   */
  const handleOrderChange = (value: string): void => {
    form.setSelectedOrderId(value);
    form.setMoveOutItemIds([]);
    form.setMoveInItemIds([]);
    form.setSearchTerm("");
    form.setNotFoundItemCode("");
    form.setSaveErrorMessage(null);
  };

  /**
   * Handle focus at change.
   * @param {string} value - value
   * @returns {void} No return value
   */
  const handleFocusAtChange = (value: string): void => {
    if (value === "moveIn" || value === "moveOut") form.setFocusAt(value);
  };

  /**
   * Handle search change.
   * @param {string} value - value
   * @returns {void} No return value
   */
  const handleSearchChange = (value: string): void => form.setSearchTerm(value);

  return { handleOrderChange, handleFocusAtChange, handleSearchChange };
};

/**
 * Manage filtered order items.
 * @param {ChecklistOrderItemRow[]} orderItems - order items
 * @param {string} searchTerm - search term
 * @returns {ChecklistOrderItemRow[]} - filtered items
 */
export const useFilteredOrderItems = (orderItems: ChecklistOrderItemRow[], searchTerm: string): ChecklistOrderItemRow[] =>
  useMemo(() => {
    if (!searchTerm.trim()) return orderItems;

    const lower = searchTerm.toLowerCase();

    return orderItems.filter((item) => item.itemId.toLowerCase().includes(lower) || item.itemName.toLowerCase().includes(lower) || item.category.toLowerCase().includes(lower) || item.sign.toLowerCase().includes(lower));
  }, [orderItems, searchTerm]);

/**
 * Manage selected order and its items.
 * @param {UseItemChecklistDataInput} input - checklist data input
 * @returns {ChecklistDataState} - checklist data state
 */
export const useItemChecklistData = (input: UseItemChecklistDataInput): ChecklistDataState =>
  useMemo(
    (): ChecklistDataState => getChecklistData(input),
    [input.isEditMode, input.selectedOrderId, input.detailData, input.ordersData,
      input.ordersStatus, input.itemsData, input.itemsStatus],
  );
