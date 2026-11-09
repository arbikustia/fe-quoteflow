import { useEffect, useMemo, useRef, useState } from "react";

import type {
  ApiChecklist,
  ChecklistControls,
  ChecklistFocusAt,
  ChecklistHandlers,
  ChecklistOrderItemRow,
} from "./ItemChecklistCreate.type";

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

  /**
   * Toggle an item id.
   * @param {string[]} itemIds - item ids
   * @param {string} itemId - item id
   * @returns {string[]} - updated item ids
   */
  const toggleItemId = (itemIds: string[], itemId: string): string[] =>
    itemIds.includes(itemId) ? itemIds.filter((id) => id !== itemId) : [...itemIds, itemId];

  return { selectedOrderId, setSelectedOrderId, focusAt, setFocusAt, moveOutItemIds, setMoveOutItemIds, moveInItemIds, setMoveInItemIds, searchTerm, setSearchTerm, saveErrorMessage, setSaveErrorMessage, toggleItemId };
};

/**
 * Initialize edit state.
 * @param {ChecklistControls} form - form controls
 * @param {string} [id] - checklist id
 * @param {ApiChecklist} [checklist] - checklist
 * @returns {void}
 */
export const useChecklistInitialization = (form: ChecklistControls, id?: string, checklist?: ApiChecklist): void => {
  const initializedId = useRef<string | undefined>(undefined);

  useEffect((): void => {
    if (!id || !checklist || initializedId.current === id) return;

    initializedId.current = id;
    form.setSelectedOrderId(checklist.order_id);
    form.setMoveOutItemIds(checklist.items.filter((item) => item.move_out).map((item) => item.id));
    form.setMoveInItemIds(checklist.items.filter((item) => item.move_in).map((item) => item.id));
  }, [id, checklist, form]);
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
   */
  const handleOrderChange = (value: string): void => {
    form.setSelectedOrderId(value);
    form.setMoveOutItemIds([]);
    form.setMoveInItemIds([]);
    form.setSearchTerm("");
    form.setSaveErrorMessage(null);
  };

  /**
   * Handle focus at change.
   * @param {string} value - value
   */
  const handleFocusAtChange = (value: string): void => {
    if (value === "moveIn" || value === "moveOut") form.setFocusAt(value as ChecklistFocusAt);
  };

  /**
   * Handle search change.
   * @param {string} value - value
   * @returns {void}
   */
  const handleSearchChange = (value: string): void => form.setSearchTerm(value);

  /**
   * Toggle move out.
   * @param {string} value - value
   * @returns {void}
   */
  const onToggleMoveOut = (value: string): void => form.setMoveOutItemIds((current) => form.toggleItemId(current, value));

  /**
   * Toggle move in.
   * @param {string} value - value
   * @returns {void}
   */
  const onToggleMoveIn = (value: string): void => form.setMoveInItemIds((current) => form.toggleItemId(current, value));

  return { handleOrderChange, handleFocusAtChange, handleSearchChange, onToggleMoveOut, onToggleMoveIn };
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
