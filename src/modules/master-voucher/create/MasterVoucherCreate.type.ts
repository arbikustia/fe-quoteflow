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
  errors: import("react-hook-form").FieldErrors<import("../MasterVoucher.type").VoucherFormValues>;
  isSubmitted: boolean;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCodeModeChange: (value: string) => void;
  handleDiscountChange: (value: number | null) => void;
  handleStatusChange: () => void;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  goBack: () => void;
};
