import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { MASTER_CUSTOMER_ROUTE } from "../MasterCustomer.config";

import { CUSTOMER_FORM_MODE_TEXT } from "./MasterCustomerCreate.config";
import type {
  CustomerFieldHandlers,
  CustomerFormValues,
  CustomerSubmission,
  CustomerTextField,
  MasterCustomerCreateController,
  MasterCustomerCreateParams,
} from "./MasterCustomerCreate.type";
import { formatApiMessages, getCustomerFieldErrors, parsePhoneInput, resolveCustomerForm, sendCustomerMutation } from "./MasterCustomerCreate.util";

/**
 * Watch every customer form value.
 * @param {Control<CustomerFormValues>} control - react-hook-form control
 * @returns {CustomerFormValues} - Current form values
 */
const useCustomerFormValues = (control: Control<CustomerFormValues>): CustomerFormValues => ({
  name: useWatch({ control, name: "name" }),
  email: useWatch({ control, name: "email" }),
  phoneNumber: useWatch({ control, name: "phoneNumber" }),
  address: useWatch({ control, name: "address" }),
  isActive: useWatch({ control, name: "isActive" }),
});

/**
 * Create the field change handlers; fields re-validate on change once the form was submitted.
 * @param {UseFormSetValue<CustomerFormValues>} setValue - react-hook-form setValue
 * @param {boolean} isSubmitted - Whether the form was submitted
 * @returns {CustomerFieldHandlers} - Field change handlers
 */
const useCustomerFieldHandlers = (setValue: UseFormSetValue<CustomerFormValues>, isSubmitted: boolean): CustomerFieldHandlers => {
  /**
   * Store a text field value.
   * @param {CustomerTextField} field - Field to update
   * @param {string} value - New value
   * @returns {void}
   */
  const updateTextField = useCallback((field: CustomerTextField, value: string): void => {
    setValue(field, value, { shouldDirty: true, shouldValidate: isSubmitted });
  }, [isSubmitted, setValue]);

  /**
   * Handle customer name input.
   * @param {ChangeEvent<HTMLInputElement>} event - Input change event
   * @returns {void}
   */
  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    updateTextField("name", event.target.value);
  }, [updateTextField]);

  /**
   * Handle email input.
   * @param {ChangeEvent<HTMLInputElement>} event - Input change event
   * @returns {void}
   */
  const handleEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    updateTextField("email", event.target.value);
  }, [updateTextField]);

  /**
   * Handle phone number input, keeping digits only.
   * @param {ChangeEvent<HTMLInputElement>} event - Input change event
   * @returns {void}
   */
  const handlePhoneNumberChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    updateTextField("phoneNumber", parsePhoneInput(event.target.value));
  }, [updateTextField]);

  /**
   * Handle address input.
   * @param {ChangeEvent<HTMLTextAreaElement>} event - Textarea change event
   * @returns {void}
   */
  const handleAddressChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
    updateTextField("address", event.target.value);
  }, [updateTextField]);

  /**
   * Handle the active status switch.
   * @param {boolean} isActive - Whether the customer is active
   * @returns {void}
   */
  const handleStatusChange = useCallback((isActive: boolean): void => {
    setValue("isActive", isActive, { shouldDirty: true });
  }, [setValue]);

  return { handleNameChange, handleEmailChange, handlePhoneNumberChange, handleAddressChange, handleStatusChange };
};

/**
 * Submit the form through the create / update mutation and handle navigation.
 * @param {MasterCustomerCreateParams} params - Form mode and mutation triggers
 * @returns {CustomerSubmission} - Submit error, submit and back handlers
 */
const useCustomerSubmission = (params: MasterCustomerCreateParams): CustomerSubmission => {
  const { id, mode, createCustomer, updateCustomer } = params;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Send the validated form and return to the list on success.
   * @param {CustomerFormValues} values - Valid form values
   * @returns {Promise<void>} - Resolves when the request settles
   */
  const submitCustomer = useCallback(async (values: CustomerFormValues): Promise<void> => {
    const modeText = CUSTOMER_FORM_MODE_TEXT[mode];

    setErrorMessage(undefined);

    try {
      const response = await sendCustomerMutation(values, { id, createCustomer, updateCustomer });

      if (!response.status) {
        setErrorMessage(formatApiMessages(response.messages));

        return;
      }

      navigate(MASTER_CUSTOMER_ROUTE.LIST, { state: { successMessage: modeText.successMessage } });
    } catch {
      setErrorMessage(modeText.failureMessage);
    }
  }, [createCustomer, id, mode, navigate, updateCustomer]);

  /**
   * Navigate back to the customer list.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_CUSTOMER_ROUTE.LIST);
  }, [navigate]);

  return { errorMessage, submitCustomer, handleBack };
};

/**
 * Manage the customer create / edit form: values, validation, submit and navigation.
 * @param {MasterCustomerCreateParams} params - Form mode, initial values and mutation triggers
 * @returns {MasterCustomerCreateController} - Form state and handlers
 */
export const useMasterCustomerCreate = (params: MasterCustomerCreateParams): MasterCustomerCreateController => {
  const { control, formState, handleSubmit, setValue } = useForm<CustomerFormValues>({
    defaultValues: params.initialValues,
    values: params.initialValues,
    resetOptions: { keepDirtyValues: true },
    resolver: resolveCustomerForm,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const values = useCustomerFormValues(control);
  const fieldHandlers = useCustomerFieldHandlers(setValue, formState.isSubmitted);
  const submission = useCustomerSubmission(params);

  return {
    ...fieldHandlers,
    values,
    fieldErrors: getCustomerFieldErrors(formState.errors),
    errorMessage: submission.errorMessage,
    handleSubmit: handleSubmit(submission.submitCustomer),
    handleBack: submission.handleBack,
  };
};
