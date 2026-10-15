import type * as React from "react";

export type MasterServiceTypeCreateFormState = {
  readonly serviceName: string;
  readonly price: string;
  readonly isActive: boolean;
  readonly isSubmitting: boolean;
  readonly isEdit: boolean;
  readonly errorMessage: string | null;
  readonly handleServiceNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handlePriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleIsActiveChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  readonly goBack: () => void;
};
