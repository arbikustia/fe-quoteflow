import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { MOCK_QUOTES } from "../../fixture/quotes";
import type { QuoteData } from "../order-page/OrderPage.type";
import type { ReturnProps, ReturnItemsData } from "./Return.type";

export const useReturnState = (): ReturnProps => {
  const [searchCode, setSearchCode] = useState("");
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [error, setError] = useState("");
  
  const [returnItems, setReturnItems] = useState<ReturnItemsData>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(false);
    setError("");
    
    if (!searchCode.trim()) {
      setError("Please enter a quotation code.");
      return;
    }

    const found = MOCK_QUOTES.find(q => q.id.toLowerCase() === searchCode.toLowerCase());
    if (found) {
      setQuote(found);
      const initialItems: ReturnItemsData = {};
      found.selectedItems.forEach(item => {
        initialItems[item] = { photo: null, remarks: "" };
      });
      setReturnItems(initialItems);
    } else {
      setQuote(null);
      setError("Quotation not found.");
    }
  };

  const handlePhotoUpload = (item: string, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setReturnItems(prev => ({
        ...prev,
        [item]: { ...prev[item], photo: imageUrl }
      }));
    }
  };

  const handleRemarksChange = (item: string, text: string) => {
    setReturnItems(prev => ({
      ...prev,
      [item]: { ...prev[item], remarks: text }
    }));
  };

  const handleSubmit = (e: FormEvent) => {
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
