import type { ApiItem } from "@/modules/master-item/MasterItem.type";
import type {
  ApiProject,
  ProjectFormStep,
  ProjectItemOption,
  ProjectItemSelection,
} from "@/modules/master-project/MasterProject.type";
import type { useGetAllItemsQuery } from "@/services/master-item.service";

/**
 * Format backend messages into a display string.
 * @param {string[] | string | null} messages - Backend response messages
 * @returns {string} Display message
 */
export const formatProjectMessages = (messages: string[] | string | null): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages ?? "Project request failed.";
};

/**
 * Map API items to project item options.
 * @param {ReturnType<typeof useGetAllItemsQuery>["data"]} response - Item response
 * @returns {ProjectItemOption[]} Item options
 */
export const mapProjectItemOptions = (
  response: ReturnType<typeof useGetAllItemsQuery>["data"],
): ProjectItemOption[] =>
  response?.status
    ? response.data.map((item: ApiItem) => ({
        id: item.id,
        name: item.name,
        image: item.image ?? "",
        price: item.price ?? 0,
        stock: item.stock ?? 0,
      }))
    : [];

/**
 * Calculate updated item list when toggling an item selection.
 * @param {ProjectItemSelection[]} current - Currently selected items
 * @param {ProjectItemOption} item - Item option to toggle
 * @returns {ProjectItemSelection[]} Updated selected items
 */
export const toggleSelectedItem = (
  current: ProjectItemSelection[],
  item: ProjectItemOption,
): ProjectItemSelection[] =>
  current.some((selected) => selected.id === item.id)
    ? current.filter((selected) => selected.id !== item.id)
    : [...current, { ...item, qty: 1 }];

/**
 * Calculate updated item list when changing quantity.
 * @param {ProjectItemSelection[]} current - Currently selected items
 * @param {string} itemId - Target item ID
 * @param {number} quantity - New quantity
 * @returns {ProjectItemSelection[]} Updated selected items
 */
export const updateSelectedQuantity = (
  current: ProjectItemSelection[],
  itemId: string,
  quantity: number,
): ProjectItemSelection[] =>
  current.map((item) =>
    item.id === itemId
      ? { ...item, qty: Math.max(1, Math.min(quantity, item.stock)) }
      : item,
  );

/**
 * Validate current step before advancing.
 * @param {ProjectFormStep} step - Current step
 * @param {number} selectedItemsCount - Count of selected items
 * @param {string} name - Project name
 * @returns {string | null} Validation error message or null
 */
export const validateProjectStep = (
  step: ProjectFormStep,
  selectedItemsCount: number,
  name: string,
): string | null => {
  if (step === 1 && selectedItemsCount === 0) {
    return "Select at least one item.";
  }

  if (step === 2 && !name.trim()) {
    return "Project name is required.";
  }

  return null;
};

/**
 * Map project response items to selected items.
 * @param {ApiProject | null | undefined} project - Project details
 * @param {ProjectItemOption[]} items - Item options
 * @returns {ProjectItemSelection[]} Mapped selected items
 */
export const mapProjectSelectedItems = (
  project: ApiProject | null | undefined,
  items: ProjectItemOption[],
): ProjectItemSelection[] => {
  if (!project || items.length === 0) {
    return [];
  }

  return (project.items ?? [])
    .map((projectItem) => {
      const option = items.find((item) => item.id === projectItem.item_id);

      return option
        ? {
            ...option,
            qty: Math.max(1, Math.min(projectItem.qty, option.stock)),
          }
        : null;
    })
    .filter((item): item is ProjectItemSelection => item !== null);
};

