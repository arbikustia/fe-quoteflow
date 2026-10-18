import type * as React from "react";
import { FiSearch } from "react-icons/fi";

import type { SearchFilterProps } from "./SearchFilter.type";

/**
 * Render reusable search filter
 * @param {SearchFilterProps} props - search filter props
 * @returns {React.ReactElement} search filter
 */
export const SearchFilter = ({
  placeholder,
  onChange,
  className = "",
  inputClassName = "",
  isRoundedFull = false,
  value,
}: SearchFilterProps): React.ReactElement => {
  const inputClassNames = [
    "h-14 w-full",
    isRoundedFull ? "rounded-full" : "rounded-xl",
    "border border-border-default bg-background-surface pl-12 pr-4 text-base font-medium text-text-primary outline-none transition-colors placeholder:font-normal placeholder:text-text-tertiary hover:border-border-strong focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30",
    inputClassName,
  ].filter(Boolean).join(" ");

  return (
  <label className={`relative block w-full sm:w-72 ${className}`}>
    <span className="sr-only">{placeholder}</span>
    <FiSearch
      aria-hidden="true"
      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary"
    />
    <input
      type="search"
      aria-label={placeholder}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={inputClassNames}
    />
  </label>
  );
};
