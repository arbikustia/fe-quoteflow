import { useState } from "react";

import { toggleSelectedItem, updateSelectedQuantity } from "./MasterProjectCreate.helpers";

import type {
  ProjectItemOption,
  ProjectItemSelection,
  ProjectItemSelectionState,
} from "@/modules/master-project/MasterProject.type";

/**
 * Manage project item selections.
 * @returns {ProjectItemSelectionState} Item selection state
 */
export const useProjectItemSelection = (): ProjectItemSelectionState => {
  const [selectedItems, setSelectedItems] = useState<ProjectItemSelection[]>([]);

  /**
   * Toggle item selection status.
   * @param {ProjectItemOption} item - Item option
   * @returns {void} No return
   */
  const toggleItem = (item: ProjectItemOption): void => {
    setSelectedItems((current) => toggleSelectedItem(current, item));
  };

  /**
   * Update quantity for an item.
   * @param {string} itemId - Item ID
   * @param {number} quantity - Quantity
   * @returns {void} No return
   */
  const updateItemQuantity = (itemId: string, quantity: number): void => {
    setSelectedItems((current) => updateSelectedQuantity(current, itemId, quantity));
  };

  return { selectedItems, setSelectedItems, toggleItem, updateItemQuantity };
};
