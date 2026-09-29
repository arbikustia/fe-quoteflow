import type * as React from "react";

export type DesktopOrderCreateProps = {
  isEditing: boolean;
  selectedCategories: string[];
  selectedItems: string[];
  isCategoryDropdownOpen: boolean;
  itemSearchQuery: string;
  categoryDropdownRef: React.RefObject<HTMLDivElement>;
  toggleCategory: (cat: string) => void;
  toggleItem: (item: string) => void;
  setIsCategoryDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setItemSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.SyntheticEvent) => void;
  onCancel: () => void;
};
