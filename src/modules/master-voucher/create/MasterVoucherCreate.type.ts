import type * as React from "react";

export type MasterVoucherCreateFormState = {
  name: string;
  code: string;
  codeMode: "generate" | "type";
  discountPercent: string;
  isActive: boolean;
  isEditMode: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCodeModeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleDiscountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: () => void;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  goBack: () => void;
};
