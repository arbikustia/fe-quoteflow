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
    /** Close menu when click occurs outside select root.
     * @param {MouseEvent} event - Document mouse event
     * @returns {void} No return value
     */
    const handleOutsideClick = (event: MouseEvent): void => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return (): void => { document.removeEventListener("mousedown", handleOutsideClick); };
  }, []);

  /**
   * Toggle select menu.
   * @returns {void} No return value
   */
  const toggleOpen = (): void => { setIsOpen((currentIsOpen) => !currentIsOpen); };
  /**
   * Create option selection handler.
   * @param {string} value - Option value
   * @returns {() => void} Selection handler
   */
  const getOptionHandler = (value: string): (() => void) => (): void => {
    onChange(value);
    setIsOpen(false);
  };

  return { isOpen, rootRef, toggleOpen, getOptionHandler };
};
