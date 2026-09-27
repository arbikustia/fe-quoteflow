import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";

import { MOCK_QUOTES } from "../../fixture/quotes";
import type { QuoteData } from "../order-page/OrderPage.type";

import type { ReturnItemsData, ReturnProps } from "./Return.type";

/**
 * useReturnState hook
 * @returns {ReturnProps} state and handlers
 */
// eslint-disable-next-line max-lines-per-function
export const useReturnState = (): ReturnProps => {
  const [searchCode, setSearchCode] = useState("");
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [error, setError] = useState("");
  
  const [returnItems, setReturnItems] = useState<ReturnItemsData>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Handle search
   * @param {SyntheticEvent} e - event
   * @returns {void}
   */
  const handleSearch = (e: SyntheticEvent): void => {
    e.preventDefault();
    setIsSubmitted(false);
    setError("");
    
    if (!searchCode.trim()) {
      setError("Please enter a quotation code.");

      return;
    }

    const found = MOCK_QUOTES.find((q) => q.id.toLowerCase() === searchCode.toLowerCase());

    if (found) {
      setQuote(found);
      const initialItems: ReturnItemsData = {};

      found.selectedItems.forEach((item: string) => {
        initialItems[item] = { photo: null, remarks: "" };
      });
      setReturnItems(initialItems);
    } else {
      setQuote(null);
      setError("Quotation not found.");
    }
  };

  /**
   * Handle photo upload
   * @param {string} item - item name
   * @param {ChangeEvent<HTMLInputElement>} e - event
   * @returns {void}
   */
  const handlePhotoUpload = (item: string, e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      setReturnItems((prev) => ({
        ...prev,
        [item]: { ...prev[item], photo: imageUrl }
      }));
    }
  };

  /**
   * Handle remarks change
   * @param {string} item - item name
   * @param {string} text - remarks
   * @returns {void}
   */
  const handleRemarksChange = (item: string, text: string): void => {
    setReturnItems((prev) => ({
      ...prev,
      [item]: { ...prev[item], remarks: text }
    }));
  };

  /**
   * Handle submit
   * @param {SyntheticEvent} e - event
   * @returns {void}
   */
  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    
    let isValid = true;

    for (const item of Object.keys(returnItems)) {
      const { photo, remarks } = returnItems[item];

      if (!photo && !remarks.trim()) {
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      alert("Please ensure all items have either a photo uploaded or remarks filled in.");

      return;
    }

    setIsSubmitted(true);
  };

  return {
    searchCode,
    setSearchCode,
    quote,
    error,
    returnItems,
    isSubmitted,
    handleSearch,
    handlePhotoUpload,
    handleRemarksChange,
    handleSubmit,
  };
};
