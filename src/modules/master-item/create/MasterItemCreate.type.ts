import type { ChangeEvent, SyntheticEvent } from "react";
import type { FieldErrors } from "react-hook-form";

import type { CategoryAllItem } from "@/modules/master-category/MasterCategory.type";
import type { ImageUploadResponse, ItemCreatePayload, ItemCreateResponse, ItemData, ItemUpdatePayload } from "@/modules/master-item/MasterItem.type";

export type ItemFormFieldsState = {
  name: string;
  categoryId: string;
  price: string;
  stock: string;
  image: string;
  isImageUploading: boolean;
  imageUploadError: string | null;
  duration: string;
  remark: string;
  isActive: boolean;
  errors?: FieldErrors<ItemFormValues>;
  isSubmitted?: boolean;
  validateForm: () => Promise<boolean>;
  handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCategoryChange: (value: string) => void;
  handlePriceChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleStockChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDurationChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRemarkChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: () => void;
};

export type ImageUploadMutation = (file: FormData) => { unwrap: () => Promise<ImageUploadResponse> };

export type ItemTextFieldsState = Omit<ItemFormFieldsState,
  "image" | "isImageUploading" | "imageUploadError" | "handleImageChange"
>;

export type ItemImageFieldState = Pick<ItemFormFieldsState,
  "image" | "isImageUploading" | "imageUploadError" | "handleImageChange"
>;

export type ItemSubmissionParams = {
  id: string | undefined;
  isEditMode: boolean;
  fields: ItemFormFieldsState;
  createItem: (payload: ItemCreatePayload) => { unwrap: () => Promise<ItemCreateResponse> };
  updateItem: (payload: ItemUpdatePayload) => { unwrap: () => Promise<ItemCreateResponse> };
};

export type ItemSubmissionState = {
  errorMessage: string | null;
  successMessage: string | null;
  handleSubmit: (event: SyntheticEvent) => Promise<void>;
};

export type ItemRouteState = {
  item?: ItemData;
  successMessage?: string;
};

export type ItemFormContentProps = Pick<MasterItemCreateFormState,
  "name" | "categoryId" | "price" | "stock" | "image" | "isImageUploading" | "imageUploadError" | "duration" | "remark" |
  "categories" | "isCategoryLoading" | "categoryError" | "errors" | "isSubmitted" | "handleNameChange" |
  "handleCategoryChange" | "handlePriceChange" | "handleStockChange" |
  "handleImageChange" | "handleDurationChange" | "handleRemarkChange"
>;

export type ItemFormValues = {
  name: string;
  categoryId: string;
  price: string;
  stock: string;
  duration: string;
};

export type MasterItemCreateFormState = {
  name: string;
  categoryId: string;
  price: string;
  stock: string;
  image: string;
  isImageUploading: boolean;
  imageUploadError: string | null;
  duration: string;
  remark: string;
  isActive: boolean;
  isEditMode: boolean;
  isSubmitting: boolean;
  isCategoryLoading: boolean;
  categoryError: string | null;
  errorMessage: string | null;
  successMessage: string | null;
  errors?: FieldErrors<ItemFormValues>;
  isSubmitted?: boolean;
  categories: CategoryAllItem[];
  handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCategoryChange: (value: string) => void;
  handlePriceChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleStockChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDurationChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRemarkChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: () => void;
  handleSubmit: (event: SyntheticEvent) => Promise<void>;
  goBack: () => void;
};
