import type { ChangeEvent, SyntheticEvent } from 'react';

export type LoginPageProps = {
  identifier: string;
  password: string;
  isPasswordVisible: boolean;
  isRemembered: boolean;
  onIdentifierChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTogglePasswordVisibility: () => void;
  onRememberedChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
};

export type LoginPageState = {
  identifier: string;
  password: string;
  isPasswordVisible: boolean;
  isRemembered: boolean;
  handleIdentifierChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleTogglePasswordVisibility: () => void;
  handleRememberedChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
};
