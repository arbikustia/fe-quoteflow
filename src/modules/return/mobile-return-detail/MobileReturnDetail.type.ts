import type { ChangeEvent } from "react";

import type { QuoteData } from "../../order/desktop-order/DesktopOrder.type";

export type MobileReturnDetailProps = {
  order: QuoteData;
  location: string;
  itemFiles: Record<number, { name: string; url: string }>;
  previewImage: string | null;
  showToast: boolean;
  handleFileChange: (idx: number, e: ChangeEvent<HTMLInputElement>) => void;
  removeFile: (idx: number) => void;
  handleSave: () => void;
  setPreviewImage: (url: string | null) => void;
  onBack: () => void;
  onDownload: () => void;
};

export type MobileReturnDetailItemRowProps = Pick<MobileReturnDetailProps, "handleFileChange" | "setPreviewImage" | "removeFile"> & {
  item: string;
  idx: number;
  itemFile?: { name: string; url: string };
};

export type UseItemFilesReturn = Pick<
  MobileReturnDetailProps,
  | "itemFiles"
  | "previewImage"
  | "setPreviewImage"
  | "handleFileChange"
  | "removeFile"
>;
