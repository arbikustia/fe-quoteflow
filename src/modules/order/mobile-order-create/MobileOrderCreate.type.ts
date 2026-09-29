import type React from "react";
import type { ReactNode,RefObject } from "react";

import type { QuoteData } from "../desktop-order/DesktopOrder.type";

export type InputFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  icon?: ReactNode;
  defaultValue?: string | number;
}

export type MobileOrderCreateProps = {
  isEdit: boolean;
  existingOrder: QuoteData | null;
  selectedCategories: string[];
  selectedItems: string[];
  itemDetails: Record<string, { qty: number; remark: string }>;
  categoryRemarks: Record<string, string>;
  isCategoryOpen: boolean;
  categoryRef: RefObject<HTMLDivElement>;
  
  onNavigateBack: () => void;
  onToggleCategory: (cat: string) => void;
  onToggleItem: (item: string) => void;
  onUpdateQty: (item: string, delta: number) => void;
  onUpdateRemark: (item: string, remark: string) => void;
  onUpdateCategoryRemark: (cat: string, remark: string) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
  onToggleCategoryOpen: () => void;
};

export type CategoryStateReturn = {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  categoryRemarks: Record<string, string>;
  setCategoryRemarks: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isCategoryOpen: boolean;
  setIsCategoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categoryRef: React.RefObject<HTMLDivElement>;
};

export type ItemStateReturn = {
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  itemDetails: Record<string, {qty: number, remark: string}>;
  setItemDetails: React.Dispatch<React.SetStateAction<Record<string, {qty: number, remark: string}>>>;
};
