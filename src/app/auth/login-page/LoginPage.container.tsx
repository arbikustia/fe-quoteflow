import type { ReactElement } from 'react';

import { LoginPageComponent } from './LoginPage.component';
import { useLoginPageState } from './LoginPage.hook';

/**
 * Render Login Page Container
 * @returns {ReactElement} container node
 */
export default function LoginPageContainer(): ReactElement {
  const {
    identifier,
    password,
    isPasswordVisible,
    isRemembered,
    handleIdentifierChange,
    handlePasswordChange,
    handleTogglePasswordVisibility,
    handleRememberedChange,
    handleSubmit,
  } = useLoginPageState();

  return (
    <LoginPageComponent
      identifier={identifier}
      password={password}
      isPasswordVisible={isPasswordVisible}
      isRemembered={isRemembered}
      onIdentifierChange={handleIdentifierChange}
      onPasswordChange={handlePasswordChange}
      onTogglePasswordVisibility={handleTogglePasswordVisibility}
      onRememberedChange={handleRememberedChange}
      onSubmit={handleSubmit}
    />
  );
}
