import type { QuoteData } from "../order-page/OrderPage.type";
import type { ChangeEvent, FormEvent } from "react";

export type ReturnItemsData = Record<
  string,
  { photo: string | null; remarks: string }
>;

export type ReturnProps = {
  searchCode: string;
  setSearchCode: (code: string) => void;
  quote: QuoteData | null;
  error: string;
  returnItems: ReturnItemsData;
  isSubmitted: boolean;
  handleSearch: (e: FormEvent) => void;
  handlePhotoUpload: (item: string, e: ChangeEvent<HTMLInputElement>) => void;
  handleRemarksChange: (item: string, text: string) => void;
  handleSubmit: (e: FormEvent) => void;
};
