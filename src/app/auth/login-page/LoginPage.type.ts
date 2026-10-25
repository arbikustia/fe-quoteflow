import type { ChangeEvent, SyntheticEvent } from 'react';

import type { ApiEnvelope } from '@/types/api.type';

export type AuthenticationPayload = {
  username: string;
  password: string;
};

export type AuthenticationTokens = {
  access_token: string;
  refresh_token: string;
};

export type AuthenticationResponse = ApiEnvelope<AuthenticationTokens | null>;

export type LoginPageProps = {
  identifier: string;
  password: string;
  isPasswordVisible: boolean;
  isRemembered: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
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
  isSubmitting: boolean;
  errorMessage: string | null;
  handleIdentifierChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleTogglePasswordVisibility: () => void;
  handleRememberedChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
};
