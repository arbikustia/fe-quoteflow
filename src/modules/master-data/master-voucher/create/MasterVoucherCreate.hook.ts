import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { MASTER_VOUCHER_ROUTE } from "../MasterVoucher.config";

import { VOUCHER_FORM_MODE_TEXT } from "./MasterVoucherCreate.config";
import type {
  MasterVoucherCreateController,
  MasterVoucherCreateParams,
  VoucherFieldHandlers,
  VoucherFormValues,
  VoucherSubmission,
  VoucherTextFieldName,
  VoucherValidValues,
} from "./MasterVoucherCreate.type";
import { formatApiMessages, getVoucherFieldErrors, resolveVoucherForm, sendVoucherMutation } from "./MasterVoucherCreate.util";

/**
 * Submit the form through the create / update mutation and handle navigation.
 * @param {MasterVoucherCreateParams} params - Form mode and mutation triggers
 * @returns {VoucherSubmission} - Submit error, submit and back handlers
 */
const useVoucherSubmission = (params: MasterVoucherCreateParams): VoucherSubmission => {
  const { id, mode, createVoucher, updateVoucher } = params;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Send the validated form and return to the list on success.
   * @param {VoucherValidValues} values - Valid form values
   * @returns {Promise<void>} - Resolves when the request settles
   */
  const submitVoucher = useCallback(async (values: VoucherValidValues): Promise<void> => {
    const modeText = VOUCHER_FORM_MODE_TEXT[mode];

    setErrorMessage(undefined);

    try {
      const response = await sendVoucherMutation(values, { id, createVoucher, updateVoucher });

      if (!response.status) {
        setErrorMessage(formatApiMessages(response.messages));

        return;
      }

      navigate(MASTER_VOUCHER_ROUTE.LIST, { state: { successMessage: modeText.successMessage } });
    } catch {
      setErrorMessage(modeText.failureMessage);
    }
  }, [createVoucher, id, mode, navigate, updateVoucher]);

  /**
   * Navigate back to the voucher list.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_VOUCHER_ROUTE.LIST);
  }, [navigate]);

  return { errorMessage, submitVoucher, handleBack };
};

/**
 * Create the field change handlers; text fields re-validate once the form was submitted.
 * @param {UseFormSetValue<VoucherFormValues>} setValue - react-hook-form setter
 * @param {boolean} isSubmitted - Whether the form was submitted
 * @returns {VoucherFieldHandlers} - Field change handlers
 */
const useVoucherFieldHandlers = (setValue: UseFormSetValue<VoucherFormValues>, isSubmitted: boolean): VoucherFieldHandlers => {
  /**
   * Create a text input change handler for one field.
   * @param {VoucherTextFieldName} field - Field to update
   * @returns {(event: ChangeEvent<HTMLInputElement>) => void} - Change handler
   */
  const createTextHandler = useCallback((field: VoucherTextFieldName) => (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(field, event.target.value, { shouldDirty: true, shouldValidate: isSubmitted });
  }, [isSubmitted, setValue]);

  /**
   * Switch between generated and typed code; the code restarts empty.
   * @param {string} codeMode - Selected mode
   * @returns {void}
   */
  const handleCodeModeChange = useCallback((codeMode: string): void => {
    setValue("codeMode", codeMode === "type" ? "type" : "generate", { shouldDirty: true });
    setValue("code", "", { shouldDirty: true, shouldValidate: isSubmitted });
  }, [isSubmitted, setValue]);

  /**
   * Store the discount percentage.
   * @param {number | null} discountPercent - Typed discount, null when empty
   * @returns {void}
   */
  const handleDiscountChange = useCallback((discountPercent: number | null): void => {
    setValue("discountPercent", discountPercent, { shouldDirty: true, shouldValidate: isSubmitted });
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
    handleNameChange: createTextHandler("name"),
    handleCodeChange: createTextHandler("code"),
    handleCodeModeChange,
    handleDiscountChange,
    handleStatusChange,
  };
};

/**
 * Return a copy of the watched form values so every change yields a new object.
 * @param {VoucherFormValues} formValues - Current form values
 * @returns {VoucherFormValues} - Copy of the form values
 */
const _copyFormValues = (formValues: VoucherFormValues): VoucherFormValues => ({ ...formValues });

/**
 * Manage the voucher create / edit form: values, validation, submit and navigation.
 * @param {MasterVoucherCreateParams} params - Form mode, initial values and mutation triggers
 * @returns {MasterVoucherCreateController} - Form state and handlers
 */
export const useMasterVoucherCreate = (params: MasterVoucherCreateParams): MasterVoucherCreateController => {
  const { control, formState, handleSubmit, setValue } = useForm<VoucherFormValues, undefined, VoucherValidValues>({
    defaultValues: params.initialValues,
    values: params.initialValues,
    resetOptions: { keepDirtyValues: true },
    resolver: resolveVoucherForm,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const submission = useVoucherSubmission(params);

  return {
    ...useVoucherFieldHandlers(setValue, formState.isSubmitted),
    values: useWatch({ control, compute: _copyFormValues }),
    fieldErrors: getVoucherFieldErrors(formState.errors),
    errorMessage: submission.errorMessage,
    handleSubmit: handleSubmit(submission.submitVoucher),
    handleBack: submission.handleBack,
  };
};
