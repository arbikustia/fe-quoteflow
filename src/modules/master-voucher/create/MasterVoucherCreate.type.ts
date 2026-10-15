import type * as React from "react";

export type MasterVoucherCreateFormState = {
  readonly name: string;
  readonly code: string;
  readonly discountPercent: string;
  readonly status: string;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleDiscountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleStatusChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  readonly handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  readonly goBack: () => void;
};
