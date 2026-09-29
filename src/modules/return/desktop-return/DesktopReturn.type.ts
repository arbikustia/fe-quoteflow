import type { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent } from "react";

import type { QuoteData } from "../../order/desktop-order/DesktopOrder.type";

export type DesktopReturnItemsData = Record<
  string,
  { photo: string | null; remarks: string }
>;

export type DesktopReturnProps = {
  searchCode: string;
  setSearchCode: (code: string) => void;
  quote: QuoteData | null;
  error: string;
  returnItems: DesktopReturnItemsData;
  isSubmitted: boolean;
  handleSearch: (e: SyntheticEvent) => void;
  handlePhotoUpload: (item: string, e: ChangeEvent<HTMLInputElement>) => void;
  handleRemarksChange: (item: string, text: string) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};

export type ItemPhotoProps = {
  photo?: string | null;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
};

export type DesktopReturnItemCardProps = {
  item: string;
  idx: number;
  quote: NonNullable<DesktopReturnProps["quote"]>;
  returnItems: DesktopReturnProps["returnItems"];
  handleRemarksChange: DesktopReturnProps["handleRemarksChange"];
  handlePhotoUpload: DesktopReturnProps["handlePhotoUpload"];
};

export type OnSearchOptions = {
  searchCode: string;
  setQuote: Dispatch<SetStateAction<QuoteData | null>>;
  setReturnItems: Dispatch<SetStateAction<DesktopReturnItemsData>>;
  setError: Dispatch<SetStateAction<string>>;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
};
