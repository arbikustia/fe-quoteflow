import type { ChangeEvent, SyntheticEvent } from "react";

export type MasterItemCreateFormState = {
  readonly name: string;
  readonly categoryId: string;
  readonly price: string;
  readonly stock: string;
  readonly image: string;
  readonly duration: string;
  readonly remark: string;
  readonly isSubmitting: boolean;
  readonly isCategoryLoading: boolean;
  readonly categoryError: string | null;
  readonly errorMessage: string | null;
  readonly categories: readonly { readonly id: string; readonly category_name: string }[];
  readonly handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly handleCategoryChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly handlePriceChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly handleStockChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly handleDurationChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly handleRemarkChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly handleSubmit: (event: SyntheticEvent) => Promise<void>;
  readonly goBack: () => void;
};
