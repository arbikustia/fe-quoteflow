import { useEffect, useRef, useState } from "react";

import type { SelectProps, SelectState } from "./Select.type";

/**
 * Manage select dropdown state and outside-click behavior.
 * @param {SelectProps["onChange"]} onChange - Value change handler
 * @returns {SelectState} Select state and handlers
 */
export const useSelect = (onChange: SelectProps["onChange"]): SelectState => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return (): void => { document.removeEventListener("mousedown", handleOutsideClick); };
  }, []);

  const toggleOpen = (): void => { setIsOpen((currentIsOpen) => !currentIsOpen); };
  const getOptionHandler = (value: string): (() => void) => (): void => {
    onChange(value);
    setIsOpen(false);
  };

  return { isOpen, rootRef, toggleOpen, getOptionHandler };
};
