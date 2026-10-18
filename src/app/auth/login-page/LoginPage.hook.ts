import type { ChangeEvent, SyntheticEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthenticateMutation } from '@/services/authentication.service';

import type { LoginPageState } from './LoginPage.type';

/**
 * Custom hook for login page state and handlers
 * @returns {LoginPageState} login page state and handlers
 */
export const useLoginPageState = (): LoginPageState => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isRemembered, setIsRemembered] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authenticate, { isLoading: isSubmitting }] = useAuthenticateMutation();

  /**
   * Handle identifier input change
   * @param {ChangeEvent<HTMLInputElement>} event - change event
   * @returns {void}
   */
  const handleIdentifierChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIdentifier(event.target.value);
  };

  /**
   * Handle password input change
   * @param {ChangeEvent<HTMLInputElement>} event - change event
   * @returns {void}
   */
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  /**
   * Toggle password visibility state
   * @returns {void}
   */
  const handleTogglePasswordVisibility = (): void => {
    setIsPasswordVisible((prev: boolean): boolean => !prev);
  };

  /**
   * Handle remember me checkbox change
   * @param {ChangeEvent<HTMLInputElement>} event - change event
   * @returns {void}
   */
  const handleRememberedChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsRemembered(event.target.checked);
  };

  /**
   * Handle form submit
   * @param {SyntheticEvent<HTMLFormElement>} event - form event
   * @returns {void}
   */
  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const response = await authenticate({ username: identifier, password }).unwrap();

      if (!response.status || !response.data) {
        setErrorMessage(Array.isArray(response.messages) ? response.messages.join(" ") : response.messages ?? "Login failed.");

        return;
      }

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      document.cookie = `quoteflow_username=${encodeURIComponent(identifier)}; path=/; max-age=2592000; SameSite=Lax`;
      navigate('/home');
    } catch {
      setErrorMessage("Username atau password salah.");
    }
  }; 

  return {
    identifier,
    password,
    isPasswordVisible,
    isRemembered,
    isSubmitting,
    errorMessage,
    handleIdentifierChange,
    handlePasswordChange,
    handleTogglePasswordVisibility,
    handleRememberedChange,
    handleSubmit,
  }; 
};

