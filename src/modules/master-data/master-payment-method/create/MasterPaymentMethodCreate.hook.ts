import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { MASTER_PAYMENT_METHOD_ROUTE } from "../MasterPaymentMethod.config";

import { PAYMENT_METHOD_FORM_MODE_TEXT } from "./MasterPaymentMethodCreate.config";
import type {
  MasterPaymentMethodCreateController,
  MasterPaymentMethodCreateParams,
  PaymentMethodFormValues,
  PaymentMethodSubmission,
  PaymentMethodValidValues,
} from "./MasterPaymentMethodCreate.type";
import { formatApiMessages, getPaymentMethodFieldErrors, resolvePaymentMethodForm, sendPaymentMethodMutation } from "./MasterPaymentMethodCreate.util";

/**
 * Submit the form through the create / update mutation and handle navigation.
 * @param {MasterPaymentMethodCreateParams} params - Form mode and mutation triggers
 * @returns {PaymentMethodSubmission} - Submit error, submit and back handlers
 */
const usePaymentMethodSubmission = (params: MasterPaymentMethodCreateParams): PaymentMethodSubmission => {
  const { id, mode, createPaymentMethod, updatePaymentMethod } = params;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Send the validated form and return to the list on success.
   * @param {PaymentMethodValidValues} values - Valid form values
   * @returns {Promise<void>} - Resolves when the request settles
   */
  const submitPaymentMethod = useCallback(async (values: PaymentMethodValidValues): Promise<void> => {
    const modeText = PAYMENT_METHOD_FORM_MODE_TEXT[mode];

    setErrorMessage(undefined);

    try {
      const response = await sendPaymentMethodMutation(values, { id, createPaymentMethod, updatePaymentMethod });

      if (!response.status) {
        setErrorMessage(formatApiMessages(response.messages));

        return;
      }

      navigate(MASTER_PAYMENT_METHOD_ROUTE.LIST, { state: { successMessage: modeText.successMessage } });
    } catch {
      setErrorMessage(modeText.failureMessage);
    }
  }, [createPaymentMethod, id, mode, navigate, updatePaymentMethod]);

  /**
   * Navigate back to the payment method list.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_PAYMENT_METHOD_ROUTE.LIST);
  }, [navigate]);

  return { errorMessage, submitPaymentMethod, handleBack };
};

/**
 * Return a copy of the watched form values so every change yields a new object.
 * @param {PaymentMethodFormValues} formValues - Current form values
 * @returns {PaymentMethodFormValues} - Copy of the form values
 */
const _copyFormValues = (formValues: PaymentMethodFormValues): PaymentMethodFormValues => ({ ...formValues });

/**
 * Manage the payment method create / edit form: values, validation, submit and navigation.
 * @param {MasterPaymentMethodCreateParams} params - Form mode, initial values and mutation triggers
 * @returns {MasterPaymentMethodCreateController} - Form state and handlers
 */
export const useMasterPaymentMethodCreate = (params: MasterPaymentMethodCreateParams): MasterPaymentMethodCreateController => {
  const { control, formState, handleSubmit, setValue } = useForm<PaymentMethodFormValues, undefined, PaymentMethodValidValues>({
    defaultValues: params.initialValues,
    values: params.initialValues,
    resetOptions: { keepDirtyValues: true },
    resolver: resolvePaymentMethodForm,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { isSubmitted } = formState;
  const submission = usePaymentMethodSubmission(params);

  /**
   * Store the name input; re-validates once the form was submitted.
   * @param {ChangeEvent<HTMLInputElement>} event - Name input change event
   * @returns {void}
   */
  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setValue("name", event.target.value, { shouldDirty: true, shouldValidate: isSubmitted });
  }, [isSubmitted, setValue]);

  /**
   * Store the description input; re-validates once the form was submitted.
   * @param {ChangeEvent<HTMLTextAreaElement>} event - Description textarea change event
   * @returns {void}
   */
  const handleDescriptionChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
    setValue("description", event.target.value, { shouldDirty: true, shouldValidate: isSubmitted });
  }, [isSubmitted, setValue]);

  /**
   * Store the active status switch value.
   * @param {boolean} checked - Whether the switch is on
   * @returns {void}
   */
  const handleStatusChange = useCallback((checked: boolean): void => {
    setValue("isActive", checked, { shouldDirty: true });
  }, [setValue]);

  return {
    values: useWatch({ control, compute: _copyFormValues }),
    fieldErrors: getPaymentMethodFieldErrors(formState.errors),
    errorMessage: submission.errorMessage,
    handleNameChange,
    handleDescriptionChange,
    handleStatusChange,
    handleSubmit: handleSubmit(submission.submitPaymentMethod),
    handleBack: submission.handleBack,
  };
};
