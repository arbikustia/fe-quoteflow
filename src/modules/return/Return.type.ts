import type { ChangeEvent, SyntheticEvent } from "react";

import type { QuoteData } from "../order-page/OrderPage.type";

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
  handleSearch: (e: SyntheticEvent) => void;
  handlePhotoUpload: (item: string, e: ChangeEvent<HTMLInputElement>) => void;
  handleRemarksChange: (item: string, text: string) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};

export type ItemPhotoProps = {
  photo?: string | null;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
};

export type ReturnItemCardProps = {
  item: string;
  idx: number;
  quote: NonNullable<ReturnProps["quote"]>;
  returnItems: ReturnProps["returnItems"];
  handleRemarksChange: ReturnProps["handleRemarksChange"];
  handlePhotoUpload: ReturnProps["handlePhotoUpload"];
};
