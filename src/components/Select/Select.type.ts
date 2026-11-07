import type * as React from "react";

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectState = {
  isOpen: boolean;
  rootRef: React.RefObject<HTMLDivElement | null>;
  toggleOpen: () => void;
  getOptionHandler: (value: string) => () => void;
};

export type SelectProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  isClearable?: boolean;
  errorMessage?: string | null;
  isLoadingOptions?: boolean;
  className?: string;
  selectClassName?: string;
  labelClassName?: string;
  popupClassName?: string;
  onSearch?: (value: string) => void;
  onPopupScroll?: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  isRemoteSearch?: boolean;
};
