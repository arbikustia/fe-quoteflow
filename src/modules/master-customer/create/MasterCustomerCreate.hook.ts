import type { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { MasterCustomerCreateFormState } from "./MasterCustomerCreate.type";

import type { CustomerCreateResponse } from "@/modules/master-customer/MasterCustomer.type";
import { useCreateCustomerMutation } from "@/services/master-customer.service";

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
 * Hook managing input change handlers.
 * @param {Dispatch<SetStateAction<string>>} setter - State setter
 * @returns {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} Change handler
 */
const _useInputChange = (setter: Dispatch<SetStateAction<string>>): ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => { setter(event.target.value); }
);

/**
 * Hook managing submission logic.
 * @param {string} name - Name input
 * @param {string} address - Address input
 * @param {string} phoneNumber - Phone input
 * @returns {{ readonly isSubmitting: boolean; readonly errorMessage: string | null; readonly successMessage: string | null; readonly handleSubmit: (event: SyntheticEvent) => Promise<void>; }} Submission state
 */
const useCustomerSubmission = (
  name: string,
  address: string,
  phoneNumber: string,
): {
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleSubmit: (event: SyntheticEvent) => Promise<void>;
} => {
  const navigate = useNavigate();
  const [createCustomer, { isLoading: isSubmitting }] = useCreateCustomerMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Submit customer form.
   * @param {SyntheticEvent} event - Form submit event
   * @returns {Promise<void>} Submission result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response: CustomerCreateResponse = await createCustomer({ name, address, phone_number: phoneNumber }).unwrap();

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

  return { isSubmitting, errorMessage, successMessage, handleSubmit };
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

  const handleNameChange = _useInputChange(setName);
  const handlePhoneNumberChange = _useInputChange(setPhoneNumber);
  const handleAddressChange = _useInputChange(setAddress);
  const submission = useCustomerSubmission(name, address, phoneNumber);

  /**
   *
   */
  const goBack = (): void => { navigate(-1); };

  return {
    name,
    address,
    phoneNumber,
    handleNameChange,
    handlePhoneNumberChange,
    handleAddressChange,
    goBack,
    ...submission,
  };
};
