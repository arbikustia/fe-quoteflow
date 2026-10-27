import type { SyntheticEvent } from "react";

export type InvoiceStatusFormProps = {
  invoiceNumber: string | null;
  isActive: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  handleStatusChange: (checked: boolean) => void;
  handleSubmit: (event: SyntheticEvent<HTMLFormElement>) => Promise<void>;
  goBack: () => void;
};
