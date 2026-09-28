import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { OrderPageCreateProps } from "./OrderPageCreate.type";

/**
 * useOrderPageCreate hook
 * @returns {OrderPageCreateProps} state
 */
// eslint-disable-next-line max-lines-per-function
export const useOrderPageCreate = (): OrderPageCreateProps => {
  const nav = useNavigate();
  const isEditing = Boolean(useParams<{ id: string }>().id);
  const [selectedCategories, setCat] = useState<string[]>([]);
  const [selectedItems, setItem] = useState<string[]>([]);
  const [isCategoryDropdownOpen, setCatOpen] = useState(false);
  const [itemSearchQuery, setQuery] = useState("");
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /**
     * Handle outside click
     * @param {MouseEvent} e - event
     * @returns {void} void
     */
    const click = (e: MouseEvent): void => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };

    document.addEventListener("mousedown", click);

    return (): void => document.removeEventListener("mousedown", click);
  }, []);

  /**
   * Toggle category
   * @param {string} c - category
   * @returns {void} void
   */
  const toggleCategory = (c: string): void => setCat((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  /**
   * Toggle item
   * @param {string} i - item
   * @returns {void} void
   */
  const toggleItem = (i: string): void => setItem((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  /**
   * On submit
   * @param {React.SyntheticEvent} e - event
   * @returns {void} void
   */
  const onSubmit = (e: React.SyntheticEvent): void => { e.preventDefault(); nav("/quotes"); };

  /**
   * On cancel
   * @returns {void} void
   */
  const onCancel = (): void => { nav("/quotes"); };

  return {
    isEditing,
    selectedCategories,
    selectedItems,
    isCategoryDropdownOpen,
    itemSearchQuery,
    categoryDropdownRef,
    toggleCategory,
    toggleItem,
    setIsCategoryDropdownOpen: setCatOpen,
    setItemSearchQuery: setQuery,
    onSubmit,
    onCancel,
  };
};
