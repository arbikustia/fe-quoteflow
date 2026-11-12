import type { ChangeEvent } from "react";
import type { FieldErrors, ResolverResult } from "react-hook-form";

import type { SelectOption } from "@/components/Select";

import { NON_DIGIT_PATTERN } from "@/constants/regex.constant";
import type { ApiMessages } from "@/types/api.type";

import { ITEM_ACTIVE_STATUS, ITEM_INACTIVE_STATUS } from "../MasterItem.config";
import type { ItemCreatePayload, ItemMutationResponse } from "../MasterItem.type";

import { ITEM_FORM_DEFAULT_VALUES, ITEM_FORM_MESSAGE, ITEM_IMAGE_FORM_FIELD } from "./MasterItemCreate.config";
import type {
  ItemFieldErrors,
  ItemFieldName,
  ItemFormSource,
  ItemFormSourceParams,
  ItemFormValues,
  ItemSubmitTarget,
  ItemTextChangeHandlers,
  ItemTextField,
} from "./MasterItemCreate.type";
import { ItemFormSchema, ItemRouteItemSchema } from "./MasterItemCreate.type";

import type { CategoryAllItem } from "@/modules/master-data/master-category/MasterCategory.type";

/** Text fields that only accept digits. */
const DIGIT_FIELDS: ReadonlySet<ItemTextField> = new Set<ItemTextField>(["price", "stock", "duration"]);

/**
 * Join backend messages into one display string.
 * @param {ApiMessages} [messages] - Backend response messages
 * @returns {string} - Display message
 */
export const formatApiMessages = (messages?: ApiMessages): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages || ITEM_FORM_MESSAGE.REQUEST_FAILED;
};

/**
 * Normalize the router state into the form source (single upstream fallback).
 * The backend has no GET-by-id endpoint, so edit mode uses the item passed from the list.
 * @param {ItemFormSourceParams} params - Route id and the item from router state
 * @returns {ItemFormSource} - Form status and initial values
 */
export const normalizeItemFormSource = (params: ItemFormSourceParams): ItemFormSource => {
  const { id, routeItem } = params;

  if (!id) {
    return { formStatus: "ready", initialValues: ITEM_FORM_DEFAULT_VALUES };
  }

  const parsedItem = ItemRouteItemSchema.safeParse(routeItem);

  if (!parsedItem.success || routeItem?.id !== id) {
    return { formStatus: "error", initialValues: ITEM_FORM_DEFAULT_VALUES };
  }

  return { formStatus: "ready", initialValues: parsedItem.data };
};

/**
 * Validate item form values for react-hook-form with the Zod schema.
 * @param {ItemFormValues} values - Current form values
 * @returns {ResolverResult<ItemFormValues>} - Parsed values, or the first error per field
 */
export const resolveItemForm = (values: ItemFormValues): ResolverResult<ItemFormValues> => {
  const result = ItemFormSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FieldErrors<ItemFormValues> = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as ItemFieldName;

    errors[field] = errors[field] ?? { type: issue.code, message: issue.message };
  });

  return { values: {}, errors };
};

/**
 * Pick the message of every field error.
 * @param {FieldErrors<ItemFormValues>} errors - react-hook-form errors
 * @returns {ItemFieldErrors} - Message per field
 */
export const getItemFieldErrors = (errors: FieldErrors<ItemFormValues>): ItemFieldErrors => {
  const fieldErrors: ItemFieldErrors = {};

  (Object.keys(errors) as ItemFieldName[]).forEach((field) => {
    fieldErrors[field] = errors[field]?.message;
  });

  return fieldErrors;
};

/**
 * Clean a typed value: digit-only for price, stock and duration.
 * @param {ItemTextField} field - Text field
 * @param {string} value - Raw input value
 * @returns {string} - Value to store
 */
export const sanitizeItemInput = (field: ItemTextField, value: string): string => {
  if (!DIGIT_FIELDS.has(field)) {
    return value;
  }

  return value.replace(NON_DIGIT_PATTERN, "");
};

/**
 * Create one input change handler per text field.
 * @param {(field: ItemTextField, value: string) => void} onFieldChange - Stores the new field value
 * @returns {ItemTextChangeHandlers} - Change handler per text field
 */
export const createTextChangeHandlers = (onFieldChange: (field: ItemTextField, value: string) => void): ItemTextChangeHandlers => {
  /**
   * Create the input change handler of a text field.
   * @param {ItemTextField} field - Text field
   * @returns {(event: ChangeEvent<HTMLInputElement>) => void} - Input change handler
   */
  const createHandler = (field: ItemTextField) => (event: ChangeEvent<HTMLInputElement>): void => {
    onFieldChange(field, sanitizeItemInput(field, event.target.value));
  };

  return {
    name: createHandler("name"),
    price: createHandler("price"),
    stock: createHandler("stock"),
    duration: createHandler("duration"),
  };
};

/**
 * Format a digit string as Indonesian Rupiah for the price input.
 * @param {string} value - Digit-only value
 * @returns {string} - Formatted value, or empty when no digits
 */
export const formatRupiahInput = (value: string): string => {
  if (value === "") {
    return "";
  }

  return `Rp ${Number(value).toLocaleString("id-ID")}`;
};

/**
 * Get the file name of an uploaded image URL.
 * @param {string} url - Image URL
 * @returns {string} - Last path segment
 */
export const getImageFileName = (url: string): string => url.split("/").pop() ?? url;

/**
 * Wrap a selected file in the multipart body of the upload endpoint.
 * @param {File} file - Selected image
 * @returns {FormData} - Upload request body
 */
export const buildImageFormData = (file: File): FormData => {
  const formData = new FormData();

  formData.append(ITEM_IMAGE_FORM_FIELD, file);

  return formData;
};

/**
 * Map categories to select options.
 * @param {CategoryAllItem[]} categories - Categories from the lookup endpoint
 * @returns {SelectOption[]} - Category options
 */
export const toCategoryOptions = (categories: CategoryAllItem[]): SelectOption[] => (
  categories.map((category) => ({ label: category.category_name, value: category.id }))
);

/**
 * Build the create / update request body from validated form values.
 * @param {ItemFormValues} values - Valid form values
 * @returns {ItemCreatePayload} - Request body
 */
export const buildItemPayload = (values: ItemFormValues): ItemCreatePayload => ({
  name: values.name,
  category_id: values.categoryId,
  price: Number(values.price),
  stock: Number(values.stock),
  image: values.image,
  duration: Number(values.duration),
  remark: values.remark,
  status: values.isActive ? ITEM_ACTIVE_STATUS : ITEM_INACTIVE_STATUS,
});

/**
 * Send the update request when editing, otherwise the create request.
 * @param {ItemFormValues} values - Valid form values
 * @param {ItemSubmitTarget} target - Mutation triggers and item id
 * @returns {Promise<ItemMutationResponse>} - Mutation response
 */
export const sendItemMutation = (values: ItemFormValues, target: ItemSubmitTarget): Promise<ItemMutationResponse> => {
  const payload = buildItemPayload(values);

  if (target.id) {
    return target.updateItem({ ...payload, id: target.id }).unwrap();
  }

  return target.createItem(payload).unwrap();
};
