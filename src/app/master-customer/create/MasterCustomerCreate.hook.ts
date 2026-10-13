import type * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateCustomerMutation } from "@/modules/master-customer/MasterCustomer.api";
import type { MasterCustomerCreateFormState } from "@/modules/master-customer/MasterCustomer.type";

/**
 * Format backend messages into a display string.
 * @param {string[] | string | null} messages - Backend response messages
 * @returns {string} Display message
 */
const _formatMessages = (messages: string[] | string | null): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages ?? "Customer request failed.";
};

/**
 * Hook managing master customer create form state and submission.
 * @returns {MasterCustomerCreateFormState} Form state and handlers
 */
export const useMasterCustomerCreate = (): MasterCustomerCreateFormState => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [createCustomer, { isLoading: isSubmitting }] = useCreateCustomerMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setName(event.target.value);
  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setPhoneNumber(event.target.value);
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setAddress(event.target.value);

  /**
   * Submit the new customer to the API.
   * @param {React.SyntheticEvent} event - The form submit event
   * @returns {Promise<void>} Resolves after submission handling
   */
  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await createCustomer({ name, address, phone_number: phoneNumber }).unwrap();

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      setSuccessMessage("Customer created successfully.");
      navigate("/master-customer");
    } catch {
      setErrorMessage("Unable to create customer. Please try again.");
    }
  };

  const goBack = (): void => { navigate(-1); };

  return {
    name,
    address,
    phoneNumber,
    isSubmitting,
    errorMessage,
    successMessage,
    handleNameChange,
    handlePhoneNumberChange,
    handleAddressChange,
    handleSubmit,
    goBack,
  };
};
