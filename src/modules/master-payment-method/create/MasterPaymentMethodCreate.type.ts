import type { ChangeEvent, SyntheticEvent } from "react";

export type MasterPaymentMethodCreateState = {
  readonly name: string;
  readonly description: string;
  readonly isEdit: boolean;
  readonly handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly handleDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  readonly handleSubmit: (event: SyntheticEvent) => void;
  readonly goBack: () => void;
};
