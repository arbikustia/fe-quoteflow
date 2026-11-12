import type { ChangeEvent, SubmitEvent } from "react";
import { z } from "zod";

import type { SelectOption } from "@/components/Select";

import { ITEM_ACTIVE_STATUS } from "../MasterItem.config";
import type { ApiItem, ImageUploadResponse, ItemCreatePayload, ItemMutationResponse, ItemUpdatePayload } from "../MasterItem.type";
import { ApiItemSchema } from "../MasterItem.type";

import { ITEM_FORM_MESSAGE } from "./MasterItemCreate.config";

/** Item form input, validated on submit; numbers are kept as digit strings while typing. */
export const ItemFormSchema = z.object({
  name: z.string().trim().min(1, ITEM_FORM_MESSAGE.NAME_REQUIRED),
  categoryId: z.string().trim().min(1, ITEM_FORM_MESSAGE.CATEGORY_REQUIRED),
  price: z.string().trim().min(1, ITEM_FORM_MESSAGE.PRICE_REQUIRED),
  stock: z.string().trim().min(1, ITEM_FORM_MESSAGE.STOCK_REQUIRED),
  duration: z.string().trim().min(1, ITEM_FORM_MESSAGE.DURATION_REQUIRED),
  image: z.string(),
  remark: z.string(),
  isActive: z.boolean(),
});

export type ItemFormValues = z.infer<typeof ItemFormSchema>;

/** Form field names. */
export type ItemFieldName = keyof ItemFormValues;

/** Fields edited through a text input. */
export type ItemTextField = "name" | "price" | "stock" | "duration";

/** Validation message per field. */
export type ItemFieldErrors = Partial<Record<ItemFieldName, string>>;

/** Raw item passed through router state from the list, normalized into form values. */
export const ItemRouteItemSchema = ApiItemSchema.transform((item): ItemFormValues => ({
  name: item.name,
  categoryId: item.category_id ?? "",
  price: item.price === null ? "" : String(item.price),
  stock: item.stock === null ? "" : String(item.stock),
  duration: item.duration === null ? "" : String(item.duration),
  image: item.image ?? "",
  remark: item.remark ?? "",
  isActive: item.status === ITEM_ACTIVE_STATUS,
}));

/** Router state the edit page receives from the list (the backend has no GET-by-id endpoint). */
export type ItemEditRouteState = {
  item?: ApiItem;
} | null;

/** Whether the form creates a new item or edits an existing one. */
export type ItemFormMode = "create" | "edit";

/** Whether the form can be shown. */
export type ItemFormStatus = "error" | "ready";

/** Copy that differs between create and edit mode. */
export type ItemFormModeText = {
  title: string;
  subtitle: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  failureMessage: string;
};

/** Inputs of the form source normalizer. */
export type ItemFormSourceParams = {
  id?: string;
  routeItem?: ApiItem;
};

/** Normalized router state used to seed the form. */
export type ItemFormSource = {
  formStatus: ItemFormStatus;
  initialValues: ItemFormValues;
};

/** Result of an RTK Query mutation trigger. */
export type ItemMutationResult<TResponse> = {
  unwrap: () => Promise<TResponse>;
};

/** Mutation triggers and target of an item submit. */
export type ItemSubmitTarget = {
  id?: string;
  createItem: (payload: ItemCreatePayload) => ItemMutationResult<ItemMutationResponse>;
  updateItem: (payload: ItemUpdatePayload) => ItemMutationResult<ItemMutationResponse>;
};

/** Inputs of the create / edit form hook. */
export type MasterItemCreateParams = ItemSubmitTarget & {
  mode: ItemFormMode;
  initialValues: ItemFormValues;
  uploadImage: (formData: FormData) => ItemMutationResult<ImageUploadResponse>;
};

/** Submit state and handlers of the form. */
export type ItemSubmission = {
  errorMessage?: string;
  submitItem: (values: ItemFormValues) => Promise<void>;
  handleBack: () => void;
};

/** Image upload state and handler. */
export type ItemImageUpload = {
  imageUploadError?: string;
  handleImageChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
};

/** Change handler per text field. */
export type ItemTextChangeHandlers = Record<ItemTextField, (event: ChangeEvent<HTMLInputElement>) => void>;

/** Form state and handlers owned by the module hook. */
export type MasterItemCreateController = {
  values: ItemFormValues;
  fieldErrors: ItemFieldErrors;
  errorMessage?: string;
  imageUploadError?: string;
  handleTextChange: ItemTextChangeHandlers;
  handleCategoryChange: (categoryId: string) => void;
  handleRemarkChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleImageChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleStatusChange: (isActive: boolean) => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  handleBack: () => void;
};

/** Handlers of the optional remark and status fields. */
export type ItemOptionalFieldHandlers = Pick<MasterItemCreateController, "handleRemarkChange" | "handleStatusChange">;

/** Props of the create / edit form view. */
export type MasterItemCreateProps = {
  mode: ItemFormMode;
  formStatus: ItemFormStatus;
  values: ItemFormValues;
  fieldErrors: ItemFieldErrors;
  categoryOptions: SelectOption[];
  isCategoryLoading: boolean;
  categoryErrorMessage?: string;
  isSubmitting: boolean;
  isImageUploading: boolean;
  imageUploadError?: string;
  errorMessage?: string;
  onTextChange: ItemTextChangeHandlers;
  onCategoryChange: (categoryId: string) => void;
  onRemarkChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onStatusChange: (isActive: boolean) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  onBack: () => void;
};
