import type { ChangeEvent, SyntheticEvent } from "react";

export type MasterPicCreateState = {
  readonly name: string;
  readonly isEdit: boolean;
  readonly handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly handleSubmit: (event: SyntheticEvent) => void;
  readonly goBack: () => void;
};
