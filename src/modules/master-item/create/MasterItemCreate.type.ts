import type { ChangeEvent, SyntheticEvent } from "react";

import type { CategoryAllItem } from "@/modules/master-category/MasterCategory.type";
import type { ItemCreatePayload, ItemCreateResponse, ItemData, ItemUpdatePayload } from "@/modules/master-item/MasterItem.type";

export type ItemFormFieldsState = {
  name: string;
  categoryId: string;
  price: string;
  stock: string;
  image: string;
  duration: string;
  remark: string;
  isActive: boolean;
  handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCategoryChange: (value: string) => void;
  handlePriceChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleStockChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDurationChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRemarkChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: () => void;
};

export type ItemSubmissionParams = {
  id: string | undefined;
  isEditMode: boolean;
  fields: ItemFormFieldsState;
  createItem: (payload: ItemCreatePayload) => { unwrap: () => Promise<ItemCreateResponse> };
  updateItem: (payload: ItemUpdatePayload) => { unwrap: () => Promise<ItemCreateResponse> };
};

export type ItemSubmissionState = {
  errorMessage: string | null;
  handleSubmit: (event: SyntheticEvent) => Promise<void>;
};

export type ItemRouteState = {
  item?: ItemData;
};

export type ItemFormContentProps = Pick<MasterItemCreateFormState,
  "name" | "categoryId" | "price" | "stock" | "image" | "duration" | "remark" |
  "categories" | "isCategoryLoading" | "categoryError" | "handleNameChange" |
  "handleCategoryChange" | "handlePriceChange" | "handleStockChange" |
  "handleImageChange" | "handleDurationChange" | "handleRemarkChange"
>;

export type MasterItemCreateFormState = {
  name: string;
  categoryId: string;
  price: string;
  stock: string;
  image: string;
  duration: string;
  remark: string;
  isActive: boolean;
  isEditMode: boolean;
  isSubmitting: boolean;
  isCategoryLoading: boolean;
  categoryError: string | null;
  errorMessage: string | null;
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
