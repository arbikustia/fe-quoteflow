import type { ItemFormMode, ItemFormModeText, ItemFormStatus, ItemFormValues } from "./MasterItemCreate.type";

export const ITEM_FORM_MESSAGE = {
  NAME_REQUIRED: "Item name is required.",
  CATEGORY_REQUIRED: "Category is required.",
  PRICE_REQUIRED: "Price is required.",
  STOCK_REQUIRED: "Stock is required.",
  DURATION_REQUIRED: "Duration is required.",
  IMAGE_UPLOAD_FAILED: "Unable to upload image. Please try again.",
  REQUEST_FAILED: "Item request failed.",
} as const;

/** Values of an empty create form. */
export const ITEM_FORM_DEFAULT_VALUES: ItemFormValues = {
  name: "",
  categoryId: "",
  price: "",
  stock: "",
  duration: "",
  image: "",
  remark: "",
  isActive: true,
};

/** Copy per form mode. */
export const ITEM_FORM_MODE_TEXT: Record<ItemFormMode, ItemFormModeText> = {
  create: {
    title: "New Item",
    subtitle: "Fill in the item details below.",
    submitLabel: "Create Item",
    submittingLabel: "Creating…",
    successMessage: "Item created successfully.",
    failureMessage: "Unable to create item. Please try again.",
  },
  edit: {
    title: "Edit Item",
    subtitle: "Update the item details below.",
    submitLabel: "Update Item",
    submittingLabel: "Updating…",
    successMessage: "Item updated successfully.",
    failureMessage: "Unable to update item. Please try again.",
  },
};

/** Message shown in place of the form while it cannot be edited. */
export const ITEM_FORM_STATUS_MESSAGE: Record<Exclude<ItemFormStatus, "ready">, string> = {
  error: "Item data is unavailable. Open the item from the item list to edit it.",
};

/** Multipart field name of the uploaded image. */
export const ITEM_IMAGE_FORM_FIELD = "file";
