import type {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  SyntheticEvent,
} from "react";
import { useState } from "react";

import { MOCK_QUOTES } from "../../../fixture/quotes";
import type { QuoteData } from "../../order/desktop-order/DesktopOrder.type";

import type {
  DesktopReturnItemsData,
  DesktopReturnProps,
  OnSearchOptions,
} from "./DesktopReturn.type";



/**
 * Handle search event
 * @param {SyntheticEvent} e - event
 * @param {OnSearchOptions} options - options
 * @returns {void}
 */
const onSearch = (
  e: SyntheticEvent,
  options: OnSearchOptions,
): void => {
  e.preventDefault();
  options.setIsSubmitted(false);
  options.setError("");

  if (!options.searchCode.trim()) {
    options.setError("Please enter a quotation code.");

    return;
  }

  const found = MOCK_QUOTES.find(
    (q) => q.id.toLowerCase() === options.searchCode.toLowerCase(),
  );

  if (found) {
    options.setQuote(found);
    const initialItems: DesktopReturnItemsData = {};

    found.selectedItems.forEach((item: string) => {
      initialItems[item] = { photo: null, remarks: "" };
    });
    options.setReturnItems(initialItems);
  } else {
    options.setQuote(null);
    options.setError("Quotation not found.");
  }
};

/**
 * Handle photo upload
 * @param {string} item - item name
 * @param {ChangeEvent<HTMLInputElement>} e - event
 * @param {Function} setReturnItems - setter
 * @returns {void}
 */
const onPhotoUpload = (
  item: string,
  e: ChangeEvent<HTMLInputElement>,
  setReturnItems: Dispatch<SetStateAction<DesktopReturnItemsData>>,
): void => {
  const file = e.target.files?.[0];

  if (file) {
    setReturnItems((p) => ({
      ...p,
      [item]: { ...p[item], photo: URL.createObjectURL(file) },
    }));
  }
};

/**
 * Handle remarks change
 * @param {string} item - item name
 * @param {string} text - text
 * @param {Function} setReturnItems - setter
 * @returns {void}
 */
const onRemarksChange = (
  item: string,
  text: string,
  setReturnItems: Dispatch<SetStateAction<DesktopReturnItemsData>>,
): void => {
  setReturnItems((p) => ({ ...p, [item]: { ...p[item], remarks: text } }));
};

/**
 * Handle submit
 * @param {SyntheticEvent} e - event
 * @param {DesktopReturnItemsData} items - items
 * @param {Function} setIsSubmitted - setter
 * @returns {void}
 */
const onSubmit = (
  e: SyntheticEvent,
  items: DesktopReturnItemsData,
  setIsSubmitted: Dispatch<SetStateAction<boolean>>,
): void => {
  e.preventDefault();
  let isValid = true;

  for (const item of Object.keys(items)) {
    if (!items[item].photo && !items[item].remarks.trim()) {
      isValid = false;
      break;
    }
  }

  if (!isValid) {
    alert(
      "Please ensure all items have either a photo uploaded or remarks filled in.",
    );

    return;
  }

  setIsSubmitted(true);
};

/**
 * useDesktopReturnState hook
 * @returns {DesktopReturnProps} state and handlers
 */
export const useDesktopReturnState = (): DesktopReturnProps => {
  const [searchCode, setSearchCode] = useState("");
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [error, setError] = useState("");
  const [returnItems, setReturnItems] = useState<DesktopReturnItemsData>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  return {
    searchCode,
    setSearchCode,
    quote,
    error,
    returnItems,
    isSubmitted,
    /**
     * Handle search
     * @param {SyntheticEvent} e - event
     * @returns {void}
     */
    handleSearch: (e: SyntheticEvent): void =>
      onSearch(e, {
        searchCode,
        setQuote,
        setReturnItems,
        setError,
        setIsSubmitted,
      }),
    /**
     * Handle photo upload
     * @param {string} item - item
     * @param {ChangeEvent<HTMLInputElement>} e - event
     * @returns {void}
     */
    handlePhotoUpload: (item: string, e: ChangeEvent<HTMLInputElement>): void =>
      onPhotoUpload(item, e, setReturnItems),
    /**
     * Handle remarks change
     * @param {string} item - item
     * @param {string} text - text
     * @returns {void}
     */
    handleRemarksChange: (item: string, text: string): void =>
      onRemarksChange(item, text, setReturnItems),
    /**
     * Handle submit
     * @param {SyntheticEvent} e - event
     * @returns {void}
     */
    handleSubmit: (e: SyntheticEvent): void =>
      onSubmit(e, returnItems, setIsSubmitted),
  };
};
