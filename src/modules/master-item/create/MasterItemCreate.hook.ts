import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import type { FieldErrors, UseFormSetValue } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { parseRupiahInput } from "./MasterItemCreate.helpers";
import type {
  ImageUploadMutation,
  ItemFormFieldsState,
  ItemFormValues,
  ItemImageFieldState,
  ItemRouteState,
  ItemSubmissionParams,
  ItemSubmissionState,
  ItemTextFieldsState,
  MasterItemCreateFormState,
} from "./MasterItemCreate.type";

import { useCategorySelectOptions } from "@/modules/master-category/MasterCategory.hook";
import type { ItemCreatePayload, ItemCreateResponse } from "@/modules/master-item/MasterItem.type";
import {
  useCreateItemMutation,
  useUpdateItemMutation,
  useUploadImageMutation,
} from "@/services/master-item.service";

/**
 * Format backend messages into a display string.
 * @param {string[] | string | null} messages - Backend response messages
 * @returns {string} Display message
 */
const _formatMessages = (messages: string[] | string | null): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages ?? "Item request failed.";
};

/**
 * Create validated text field change handler.
 * @param {keyof ItemFormValues} field - Form field name
 * @param {UseFormSetValue<ItemFormValues>} setValue - React Hook Form value setter
 * @param {FieldErrors<ItemFormValues>} errors - Current validation errors
 * @param {(value: string) => string} transform - Input value transformer
 * @returns {(event: ChangeEvent<HTMLInputElement>) => void} Change handler
 */
const _createTextHandler = (field: keyof ItemFormValues, setValue: UseFormSetValue<ItemFormValues>, errors: FieldErrors<ItemFormValues>, transform: (value: string) => string): ((event: ChangeEvent<HTMLInputElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement>): void => { setValue(field, transform(event.target.value), { shouldValidate: Boolean(errors[field]) }); }
);

/**
 * Register validation rules for item text fields.
 * @param {import("react-hook-form").UseFormRegister<ItemFormValues>} register - Form register function
 * @returns {void} No return value
 */
const _registerItemFields = (register: import("react-hook-form").UseFormRegister<ItemFormValues>): void => {
  register("name", { required: "Item name is required." });
  register("categoryId", { required: "Category is required." });
  register("price", { required: "Price is required." });
  register("stock", { required: "Stock is required." });
  register("duration", { required: "Duration is required." });
};

/**
 * Manage item text form fields.
 * @param {ItemRouteState} routeState - Route state
 * @returns {ItemTextFieldsState} Text fields and handlers
 */
const useItemTextFields = (routeState: ItemRouteState): ItemTextFieldsState => {
  const routeItem = routeState.item;
  const { control, formState: { errors }, register, setValue, trigger } = useForm<ItemFormValues>({
    defaultValues: {
      name: routeItem?.name ?? "",
      categoryId: routeItem?.categoryId ?? "",
      price: routeItem?.price?.toString() ?? "",
      stock: routeItem?.stock?.toString() ?? "",
      duration: routeItem?.duration?.toString() ?? "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  _registerItemFields(register);
  const name = useWatch({ control, name: "name" });
  const categoryId = useWatch({ control, name: "categoryId" });
  const price = useWatch({ control, name: "price" });
  const stock = useWatch({ control, name: "stock" });
  const duration = useWatch({ control, name: "duration" });
  const [remark, setRemark] = useState(routeItem?.remark ?? "");
  const [isActive, setIsActive] = useState(routeItem?.status === "active");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleNameChange = _createTextHandler("name", setValue, errors, (v: string): string => v);
  /**
   * Update category selection.
   * @param {string} value - Category ID
   * @returns {void} No return value
   */
  const handleCategoryChange = (value: string): void => { setValue("categoryId", value, { shouldValidate: Boolean(errors.categoryId) }); };
  const handlePriceChange = _createTextHandler("price", setValue, errors, parseRupiahInput);
  const handleStockChange = _createTextHandler("stock", setValue, errors, (value: string): string => value);
  const handleDurationChange = _createTextHandler("duration", setValue, errors, (value: string): string => value);
  /**
   * Update optional remark.
   * @param {ChangeEvent<HTMLInputElement>} event - Remark change event
   * @returns {void} No return value
   */
  const handleRemarkChange = (event: ChangeEvent<HTMLInputElement>): void => { setRemark(event.target.value); };
  /**
   * Toggle item status.
   * @returns {void} No return value
   */
  const handleStatusChange = (): void => { setIsActive((current) => !current); };
  /**
   * Validate required item fields.
   * @returns {Promise<boolean>} Validation result
   */
  const validateForm = async (): Promise<boolean> => {
    setIsSubmitted(true);

    return await trigger();
  };

  return { name, categoryId, price, stock, duration, remark, isActive, errors, isSubmitted, validateForm, handleNameChange, handleCategoryChange, handlePriceChange, handleStockChange, handleDurationChange, handleRemarkChange, handleStatusChange };
};

/**
 * Manage item image field.
 * @param {ItemRouteState} routeState - Route state
 * @param {ImageUploadMutation} uploadImage - Image upload mutation
 * @param {boolean} isImageUploading - Image upload loading state
 * @returns {ItemImageFieldState} Image field and handler
 */
const useItemImageField = (
  routeState: ItemRouteState,
  uploadImage: ImageUploadMutation,
  isImageUploading: boolean,
): ItemImageFieldState => {
  const [image, setImage] = useState(routeState.item?.image ?? "");
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  /**
   * Upload selected image and store returned URL.
   * @param {ChangeEvent<HTMLInputElement>} event - File input event
   * @returns {Promise<void>} Upload result
   */
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageUploadError(null);
    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await uploadImage(formData).unwrap();

      setImage(response.url);
    } catch {
      setImageUploadError("Unable to upload image. Please try again.");
    }
  };

  return { image, isImageUploading, imageUploadError, handleImageChange };
};

/**
 * Manage item form input states.
 * @param {ItemRouteState} routeState - Route state
 * @param {ImageUploadMutation} uploadImage - Image upload mutation
 * @param {boolean} isImageUploading - Image upload loading state
 * @returns {ItemFormFieldsState} Field states and handlers
 */
const useItemFormFields = (
  routeState: ItemRouteState,
  uploadImage: ImageUploadMutation,
  isImageUploading: boolean,
): ItemFormFieldsState => ({
  ...useItemTextFields(routeState),
  ...useItemImageField(routeState, uploadImage, isImageUploading),
});

/**
 * Send create or update mutation.
 * @param {ItemSubmissionParams} params - Submission parameters
 * @returns {Promise<ItemCreateResponse>} Mutation response
 */
const _sendItemMutation = (params: ItemSubmissionParams): Promise<ItemCreateResponse> => {
  const { id, isEditMode, fields, createItem, updateItem } = params;
  const payload: ItemCreatePayload = {
    name: fields.name,
    category_id: fields.categoryId,
    price: Number(fields.price),
    stock: Number(fields.stock),
    image: fields.image,
    duration: Number(fields.duration),
    remark: fields.remark,
    status: isEditMode && !fields.isActive ? 0 : 1,
  };

  if (isEditMode && id) {
    return updateItem({ ...payload, id }).unwrap();
  }

  return createItem(payload).unwrap();
};

/**
 * Manage item form submission logic.
 * @param {ItemSubmissionParams} params - Submission parameters
 * @returns {ItemSubmissionState} Submission state
 */
const useItemSubmission = (params: ItemSubmissionParams): ItemSubmissionState => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Submit item form.
   * @param {SyntheticEvent} event - Submit event
   * @returns {Promise<void>} Submission result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!(await params.fields.validateForm())) {
      return;
    }

    try {
      const response = await _sendItemMutation(params);

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      const message = params.isEditMode ? "Item updated successfully." : "Item created successfully.";

      setSuccessMessage(message);
      navigate("/master-item", { state: { successMessage: message } });
    } catch {
      setErrorMessage(params.isEditMode ? "Unable to update item. Please try again." : "Unable to create item. Please try again.");
    }
  };

  return { errorMessage, successMessage, handleSubmit };
};

/**
 * Manage master item create and update form state.
 * @returns {MasterItemCreateFormState} Form state
 */
export const useMasterItemCreateForm = (): MasterItemCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const routeState = (location.state as ItemRouteState) ?? {};
  const categoryState = useCategorySelectOptions();
  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
  const [uploadImage, { isLoading: isImageUploading }] = useUploadImageMutation();
  const fields = useItemFormFields(routeState, uploadImage, isImageUploading);
  const submission = useItemSubmission({ id, isEditMode, fields, createItem, updateItem });

  /**
   * Navigate back to previous page.
   * @returns {void} No return value
   */
  const goBack = (): void => {
    navigate(-1);
  };

  return { ...fields, isEditMode, isSubmitting: isCreating || isUpdating, isCategoryLoading: categoryState.isLoading, categoryError: categoryState.errorMessage, categories: categoryState.categories, errorMessage: submission.errorMessage, successMessage: submission.successMessage, handleSubmit: submission.handleSubmit, goBack };
};
