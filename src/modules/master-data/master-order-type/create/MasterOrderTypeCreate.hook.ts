import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { MASTER_ORDER_TYPE_ROUTE } from "../MasterOrderType.config";

import { ORDER_TYPE_FORM_MODE_TEXT } from "./MasterOrderTypeCreate.config";
import type {
  MasterOrderTypeCreateController,
  MasterOrderTypeCreateParams,
  OrderTypeFormValues,
  OrderTypeSubmission,
  OrderTypeToggleField,
  OrderTypeValidValues,
} from "./MasterOrderTypeCreate.type";
import {
  createToggleChangeHandlers,
  formatApiMessages,
  getOrderTypeFieldErrors,
  resolveOrderTypeForm,
  sendOrderTypeMutation,
} from "./MasterOrderTypeCreate.util";

/**
 * Submit the form through the create / update mutation and handle navigation.
 * @param {MasterOrderTypeCreateParams} params - Form mode and mutation triggers
 * @returns {OrderTypeSubmission} - Submit error, submit and back handlers
 */
const useOrderTypeSubmission = (params: MasterOrderTypeCreateParams): OrderTypeSubmission => {
  const { id, mode, createOrderType, updateOrderType } = params;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Send the validated form and return to the list on success.
   * @param {OrderTypeValidValues} values - Valid form values
   * @returns {Promise<void>} - Resolves when the request settles
   */
  const submitOrderType = useCallback(async (values: OrderTypeValidValues): Promise<void> => {
    const modeText = ORDER_TYPE_FORM_MODE_TEXT[mode];

    setErrorMessage(undefined);

    try {
      const response = await sendOrderTypeMutation(values, { id, createOrderType, updateOrderType });

      if (!response.status) {
        setErrorMessage(formatApiMessages(response.messages));

        return;
      }

      navigate(MASTER_ORDER_TYPE_ROUTE.LIST, { state: { successMessage: modeText.successMessage } });
    } catch {
      setErrorMessage(modeText.failureMessage);
    }
  }, [createOrderType, id, mode, navigate, updateOrderType]);

  /**
   * Navigate back to the order type list.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_ORDER_TYPE_ROUTE.LIST);
  }, [navigate]);

  return { errorMessage, submitOrderType, handleBack };
};

/**
 * Return a copy of the watched form values so every change yields a new object.
 * @param {OrderTypeFormValues} formValues - Current form values
 * @returns {OrderTypeFormValues} - Copy of the form values
 */
const _copyFormValues = (formValues: OrderTypeFormValues): OrderTypeFormValues => ({ ...formValues });

/**
 * Manage the order type create / edit form: values, validation, submit and navigation.
 * @param {MasterOrderTypeCreateParams} params - Form mode, initial values and mutation triggers
 * @returns {MasterOrderTypeCreateController} - Form state and handlers
 */
export const useMasterOrderTypeCreate = (params: MasterOrderTypeCreateParams): MasterOrderTypeCreateController => {
  const { control, formState, handleSubmit, setValue } = useForm<OrderTypeFormValues, undefined, OrderTypeValidValues>({
    defaultValues: params.initialValues,
    values: params.initialValues,
    resetOptions: { keepDirtyValues: true },
    resolver: resolveOrderTypeForm,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { isSubmitted } = formState;
  const submission = useOrderTypeSubmission(params);

  /**
   * Store the name input; re-validates once the form was submitted.
   * @param {ChangeEvent<HTMLInputElement>} event - Name input change event
   * @returns {void}
   */
  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setValue("name", event.target.value, { shouldDirty: true, shouldValidate: isSubmitted });
  }, [isSubmitted, setValue]);

  /**
   * Store a switch value.
   * @param {OrderTypeToggleField} field - Switch field
   * @param {boolean} checked - Whether the switch is on
   * @returns {void}
   */
  const handleToggle = useCallback((field: OrderTypeToggleField, checked: boolean): void => {
    setValue(field, checked, { shouldDirty: true });
  }, [setValue]);

  return {
    values: useWatch({ control, compute: _copyFormValues }),
    fieldErrors: getOrderTypeFieldErrors(formState.errors),
    errorMessage: submission.errorMessage,
    handleNameChange,
    handleToggleChange: useMemo(() => createToggleChangeHandlers(handleToggle), [handleToggle]),
    handleSubmit: handleSubmit(submission.submitOrderType),
    handleBack: submission.handleBack,
  };
};
