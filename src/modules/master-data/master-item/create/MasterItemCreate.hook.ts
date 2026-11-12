import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { MASTER_ITEM_ROUTE } from "../MasterItem.config";

import { ITEM_FORM_MESSAGE, ITEM_FORM_MODE_TEXT } from "./MasterItemCreate.config";
import type {
  ItemFormValues,
  ItemImageUpload,
  ItemOptionalFieldHandlers,
  ItemSubmission,
  ItemTextField,
  MasterItemCreateController,
  MasterItemCreateParams,
} from "./MasterItemCreate.type";
import {
  buildImageFormData,
  createTextChangeHandlers,
  formatApiMessages,
  getItemFieldErrors,
  resolveItemForm,
  sendItemMutation,
} from "./MasterItemCreate.util";

/**
 * Submit the form through the create / update mutation and handle navigation.
 * @param {MasterItemCreateParams} params - Form mode and mutation triggers
 * @returns {ItemSubmission} - Submit error, submit and back handlers
 */
const useItemSubmission = (params: MasterItemCreateParams): ItemSubmission => {
  const { id, mode, createItem, updateItem } = params;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Send the validated form and return to the list on success.
   * @param {ItemFormValues} values - Valid form values
   * @returns {Promise<void>} - Resolves when the request settles
   */
  const submitItem = useCallback(async (values: ItemFormValues): Promise<void> => {
    const modeText = ITEM_FORM_MODE_TEXT[mode];

    setErrorMessage(undefined);

    try {
      const response = await sendItemMutation(values, { id, createItem, updateItem });

      if (!response.status) {
        setErrorMessage(formatApiMessages(response.messages));

        return;
      }

      navigate(MASTER_ITEM_ROUTE.LIST, { state: { successMessage: modeText.successMessage } });
    } catch {
      setErrorMessage(modeText.failureMessage);
    }
  }, [createItem, id, mode, navigate, updateItem]);

  /**
   * Navigate back to the item list.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_ITEM_ROUTE.LIST);
  }, [navigate]);

  return { errorMessage, submitItem, handleBack };
};

/**
 * Upload a selected image and store its URL in the form.
 * @param {MasterItemCreateParams["uploadImage"]} uploadImage - Upload mutation trigger
 * @param {UseFormSetValue<ItemFormValues>} setValue - Form value setter
 * @returns {ItemImageUpload} - Upload error and file input handler
 */
const useItemImageUpload = (uploadImage: MasterItemCreateParams["uploadImage"], setValue: UseFormSetValue<ItemFormValues>): ItemImageUpload => {
  const [imageUploadError, setImageUploadError] = useState<string>();

  /**
   * Upload the selected image and store its URL.
   * @param {ChangeEvent<HTMLInputElement>} event - File input change event
   * @returns {Promise<void>} - Resolves when the upload settles
   */
  const handleImageChange = useCallback(async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageUploadError(undefined);

    try {
      const response = await uploadImage(buildImageFormData(file)).unwrap();

      setValue("image", response.url, { shouldDirty: true });
    } catch {
      setImageUploadError(ITEM_FORM_MESSAGE.IMAGE_UPLOAD_FAILED);
    }
  }, [setValue, uploadImage]);

  return { imageUploadError, handleImageChange };
};

/**
 * Create the handlers of the optional remark and status fields.
 * @param {UseFormSetValue<ItemFormValues>} setValue - Form value setter
 * @returns {ItemOptionalFieldHandlers} - Remark and status handlers
 */
const useItemOptionalFields = (setValue: UseFormSetValue<ItemFormValues>): ItemOptionalFieldHandlers => {
  /**
   * Handle the optional remark textarea.
   * @param {ChangeEvent<HTMLTextAreaElement>} event - Textarea change event
   * @returns {void}
   */
  const handleRemarkChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
    setValue("remark", event.target.value, { shouldDirty: true });
  }, [setValue]);

  /**
   * Handle the active status switch.
   * @param {boolean} isActive - Whether the item is active
   * @returns {void}
   */
  const handleStatusChange = useCallback((isActive: boolean): void => {
    setValue("isActive", isActive, { shouldDirty: true });
  }, [setValue]);

  return { handleRemarkChange, handleStatusChange };
};

/**
 * Return a copy of the watched form values so every change yields a new object.
 * @param {ItemFormValues} formValues - Current form values
 * @returns {ItemFormValues} - Copy of the form values
 */
const _copyFormValues = (formValues: ItemFormValues): ItemFormValues => ({ ...formValues });

/**
 * Manage the item create / edit form: values, validation, image upload, submit and navigation.
 * @param {MasterItemCreateParams} params - Form mode, initial values and mutation triggers
 * @returns {MasterItemCreateController} - Form state and handlers
 */
export const useMasterItemCreate = (params: MasterItemCreateParams): MasterItemCreateController => {
  const { control, formState, handleSubmit, setValue } = useForm<ItemFormValues>({
    defaultValues: params.initialValues,
    values: params.initialValues,
    resetOptions: { keepDirtyValues: true },
    resolver: resolveItemForm,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { isSubmitted } = formState;
  const submission = useItemSubmission(params);
  const imageUpload = useItemImageUpload(params.uploadImage, setValue);

  /**
   * Store a required field value; re-validates once the form was submitted.
   * @param {ItemTextField | "categoryId"} field - Field to update
   * @param {string} value - New value
   * @returns {void}
   */
  const handleFieldChange = useCallback((field: ItemTextField | "categoryId", value: string): void => {
    setValue(field, value, { shouldDirty: true, shouldValidate: isSubmitted });
  }, [isSubmitted, setValue]);

  /**
   * Handle the category select.
   * @param {string} categoryId - Selected category id
   * @returns {void}
   */
  const handleCategoryChange = useCallback((categoryId: string): void => {
    handleFieldChange("categoryId", categoryId);
  }, [handleFieldChange]);

  return {
    values: useWatch({ control, compute: _copyFormValues }),
    fieldErrors: getItemFieldErrors(formState.errors),
    errorMessage: submission.errorMessage,
    imageUploadError: imageUpload.imageUploadError,
    handleTextChange: useMemo(() => createTextChangeHandlers(handleFieldChange), [handleFieldChange]),
    handleCategoryChange,
    handleImageChange: imageUpload.handleImageChange,
    ...useItemOptionalFields(setValue),
    handleSubmit: handleSubmit(submission.submitItem),
    handleBack: submission.handleBack,
  };
};
