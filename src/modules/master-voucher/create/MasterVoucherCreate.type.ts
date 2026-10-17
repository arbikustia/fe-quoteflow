import type * as React from "react";

export type MasterVoucherCreateFormState = {
  readonly name: string;
  readonly code: string;
  readonly codeMode: "generate" | "type";
  readonly discountPercent: string;
  readonly isActive: boolean;
  readonly isEditMode: boolean;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleCodeModeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  readonly handleDiscountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleStatusChange: () => void;
  readonly handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  readonly goBack: () => void;
};
