import { useEffect, useRef, useState } from "react";
import type { NavigateFunction } from "react-router-dom";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import type { CategoryStateReturn, ItemStateReturn, MobileOrderCreateProps } from "./MobileOrderCreate.type";
import type { QuoteData } from "../desktop-order/DesktopOrder.type";
import { MOCK_QUOTES } from "../../../fixture/quotes";

/**
 * Helper to initialize item details
 * @param {QuoteData | null} existingOrder - existing order data
 * @returns {Record<string, {qty: number, remark: string}>} init state
 */
const getInitialItemDetails = (existingOrder: QuoteData | null): Record<string, {qty: number, remark: string}> => {
  if (existingOrder?.selectedItems) {
    const newDetails: Record<string, {qty: number, remark: string}> = {};

    existingOrder.selectedItems.forEach((item: string) => {
      newDetails[item] = { qty: existingOrder.qty || 1, remark: "" };
    });

    return newDetails;
  }

  return {};
};

/**
 * Hook for basic order state
 * @returns {{ existingOrder: QuoteData | null, isEdit: boolean }} Hook state
 */
const useOrderState = (): { existingOrder: QuoteData | null, isEdit: boolean } => {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const id = paramId || searchParams.get("id");
  const existingOrder = id ? MOCK_QUOTES.find(q => q.id === id) || null : null;
  const isEdit = !!existingOrder;

  return { existingOrder, isEdit };
};

/**
 * Hook for categories state
 * @param {QuoteData | null} existingOrder - existing order
 * @returns {CategoryStateReturn} categories state
 */
const useCategoryState = (existingOrder: QuoteData | null): CategoryStateReturn => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => 
    existingOrder?.category ? existingOrder.category.split(",").map(c => c.trim()) : []
  );
  const [categoryRemarks, setCategoryRemarks] = useState<Record<string, string>>({});
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  return {
    selectedCategories, setSelectedCategories,
    categoryRemarks, setCategoryRemarks,
    isCategoryOpen, setIsCategoryOpen,
    categoryRef
  };
};

/**
 * Hook for items state
 * @param {QuoteData | null} existingOrder - existing order
 * @returns {ItemStateReturn} items state
 */
const useItemState = (existingOrder: QuoteData | null): ItemStateReturn => {
  const [selectedItems, setSelectedItems] = useState<string[]>(() => 
    existingOrder?.selectedItems || []
  );
  const [itemDetails, setItemDetails] = useState<Record<string, {qty: number, remark: string}>>(() => 
    getInitialItemDetails(existingOrder)
  );

  return {
    selectedItems, setSelectedItems,
    itemDetails, setItemDetails
  };
};

/**
 * Navigation handlers
 * @param {NavigateFunction} navigate - router navigate
 * @returns {{ onNavigateBack: () => void, onSubmit: (e: React.SyntheticEvent) => void }} handlers
 */
const useNavHandlers = (navigate: NavigateFunction): { onNavigateBack: () => void, onSubmit: (e: React.SyntheticEvent) => void } => {
  /**
   * Navigate back
   * @returns {void} void
   */
  const handleNavigateBack = (): void => {
    navigate(-1);
  };
  /**
   * Handle submit
   * @param {React.SyntheticEvent} e - event
   * @returns {void} void
   */
  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    navigate("/order");
  };

  return { onNavigateBack: handleNavigateBack, onSubmit: handleSubmit };
};

/**
 * Category handlers
 * @param {CategoryStateReturn} cats - categories state
 * @returns {{ onToggleCategory: (cat: string) => void, onUpdateCategoryRemark: (cat: string, text: string) => void, onToggleCategoryOpen: () => void }} handlers
 */
const useCategoryHandlers = (cats: CategoryStateReturn): { onToggleCategory: (cat: string) => void, onUpdateCategoryRemark: (cat: string, text: string) => void, onToggleCategoryOpen: () => void } => {
  /**
   * Toggle category
   * @param {string} cat - cat
   * @returns {void} void
   */
  const handleToggleCategory = (cat: string): void => {
    cats.setSelectedCategories((p: string[]) => p.includes(cat) ? p.filter(c => c !== cat) : [...p, cat]);
  };
  /**
   * Update category remark
   * @param {string} cat - cat
   * @param {string} text - text
   * @returns {void} void
   */
  const handleUpdateCategoryRemark = (cat: string, text: string): void => {
    cats.setCategoryRemarks((p: Record<string, string>) => ({...p, [cat]: text}));
  };
  /**
   * Toggle category open
   * @returns {void} void
   */
  const handleToggleCategoryOpen = (): void => {
    cats.setIsCategoryOpen(!cats.isCategoryOpen);
  };

  return { onToggleCategory: handleToggleCategory, onUpdateCategoryRemark: handleUpdateCategoryRemark, onToggleCategoryOpen: handleToggleCategoryOpen };
};

/**
 * Item handlers
 * @param {ItemStateReturn} items - items state
 * @returns {{ onToggleItem: (item: string) => void, onUpdateQty: (item: string, delta: number) => void, onUpdateRemark: (item: string, remark: string) => void }} handlers
 */
const useItemHandlers = (items: ItemStateReturn): { onToggleItem: (item: string) => void, onUpdateQty: (item: string, delta: number) => void, onUpdateRemark: (item: string, remark: string) => void } => {
  /**
   * Toggle item
   * @param {string} item - item
   * @returns {void} void
   */
  const handleToggleItem = (item: string): void => {
    items.setSelectedItems((p: string[]) => p.includes(item) ? p.filter(i => i !== item) : [...p, item]);

    if (!items.selectedItems.includes(item)) items.setItemDetails((p: Record<string, {qty: number, remark: string}>) => ({...p, [item]: {qty: 1, remark: ""}}));
  };
  /**
   * Update qty
   * @param {string} item - item
   * @param {number} delta - delta
   * @returns {void} void
   */
  const handleUpdateQty = (item: string, delta: number): void => {
    items.setItemDetails((p: Record<string, {qty: number, remark: string}>) => ({...p, [item]: {...(p[item] || {qty: 1, remark: ""}), qty: Math.max(1, (p[item]?.qty || 1) + delta)}}));
  };
  /**
   * Update remark
   * @param {string} item - item
   * @param {string} remark - remark
   * @returns {void} void
   */
  const handleUpdateRemark = (item: string, remark: string): void => {
    items.setItemDetails((p: Record<string, {qty: number, remark: string}>) => ({...p, [item]: {...(p[item] || {qty: 1, remark: ""}), remark}}));
  };

  return { onToggleItem: handleToggleItem, onUpdateQty: handleUpdateQty, onUpdateRemark: handleUpdateRemark };
};

/**
 * Custom hook for mobile order create logic
 * @returns {MobileOrderCreateProps} Hook state and handlers
 */
export const useMobileOrderCreateLogic = (): MobileOrderCreateProps => {
  const navigate = useNavigate();
  const { existingOrder, isEdit } = useOrderState();
  const cats = useCategoryState(existingOrder);
  const items = useItemState(existingOrder);

  useEffect(() => {
    /**
     * Handle click outside
     * @param {MouseEvent | TouchEvent} event - dom event
     * @returns {void} void
     */
    const handleClickOutside = (event: MouseEvent | TouchEvent): void => {
      if (cats.categoryRef.current && !cats.categoryRef.current.contains(event.target as Node)) {
        cats.setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [cats]);

  const navH = useNavHandlers(navigate);
  const catH = useCategoryHandlers(cats);
  const itemH = useItemHandlers(items);

  return {
    isEdit,
    existingOrder,
    selectedCategories: cats.selectedCategories,
    selectedItems: items.selectedItems,
    itemDetails: items.itemDetails,
    categoryRemarks: cats.categoryRemarks,
    isCategoryOpen: cats.isCategoryOpen,
    categoryRef: cats.categoryRef,
    ...navH,
    ...catH,
    ...itemH,
  };
};
