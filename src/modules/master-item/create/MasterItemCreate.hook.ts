import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  parseRupiahInput,
  validateRequiredItemFields,
} from "./MasterItemCreate.helpers";
import type {
  ItemFormFieldsState,
  ItemRouteState,
  ItemSubmissionParams,
  ItemSubmissionState,
  MasterItemCreateFormState,
} from "./MasterItemCreate.type";

import { useCategorySelectOptions } from "@/modules/master-category/MasterCategory.hook";
import type { ItemCreatePayload, ItemCreateResponse } from "@/modules/master-item/MasterItem.type";
import {
  useCreateItemMutation,
  useUpdateItemMutation,
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
 * Manage item form input states.
 * @param {ItemRouteState} routeState - Route state
 * @returns {ItemFormFieldsState} Field states and handlers
 */
const useItemFormFields = (routeState: ItemRouteState): ItemFormFieldsState => {
  const routeItem = routeState.item;
  const [name, setName] = useState(routeItem?.name ?? "");
  const [categoryId, setCategoryId] = useState(routeItem?.categoryId ?? "");
  const [price, setPrice] = useState(routeItem?.price?.toString() ?? "");
  const [stock, setStock] = useState(routeItem?.stock?.toString() ?? "");
  const [image, setImage] = useState(routeItem?.image ?? "");
  const [duration, setDuration] = useState(routeItem?.duration?.toString() ?? "");
  const [remark, setRemark] = useState(routeItem?.remark ?? "");
  const [isActive, setIsActive] = useState(routeItem?.status === "active");

  /**
   * Update name.
   * @param {ChangeEvent<HTMLInputElement>} event - Input event
   * @returns {void}
   */
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => { setName(event.target.value); };

  /**
   * Update category.
   * @param {string} value - Category ID
   * @returns {void}
   */
  const handleCategoryChange = (value: string): void => { setCategoryId(value); };

  /**
   * Update price.
   * @param {ChangeEvent<HTMLInputElement>} event - Input event
   * @returns {void}
   */
  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>): void => { setPrice(parseRupiahInput(event.target.value)); };

  /**
   * Update stock.
   * @param {ChangeEvent<HTMLInputElement>} event - Input event
   * @returns {void}
   */
  const handleStockChange = (event: ChangeEvent<HTMLInputElement>): void => { setStock(event.target.value); };

  /**
   * Update image.
   * @param {ChangeEvent<HTMLInputElement>} event - Input event
   * @returns {void}
   */
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => { setImage(event.target.value); };

  /**
   * Update duration.
   * @param {ChangeEvent<HTMLInputElement>} event - Input event
   * @returns {void}
   */
  const handleDurationChange = (event: ChangeEvent<HTMLInputElement>): void => { setDuration(event.target.value); };

  /**
   * Update remark.
   * @param {ChangeEvent<HTMLInputElement>} event - Input event
   * @returns {void}
   */
  const handleRemarkChange = (event: ChangeEvent<HTMLInputElement>): void => { setRemark(event.target.value); };

  /**
   * Toggle status.
   * @returns {void}
   */
  const handleStatusChange = (): void => { setIsActive((current) => !current); };

  return {
    name, categoryId, price, stock, image, duration, remark, isActive,
    handleNameChange, handleCategoryChange, handlePriceChange, handleStockChange,
    handleImageChange, handleDurationChange, handleRemarkChange, handleStatusChange,
  };
};

/**
 * Send create or update mutation.
 * @param {ItemSubmissionParams} params - Submission parameters
 * @returns {Promise<ItemCreateResponse>} Mutation response
 */
const _sendItemMutation = (params: ItemSubmissionParams): Promise<ItemCreateResponse> => {
  const { id, isEditMode, fields, createItem, updateItem } = params;
  let status = 1;

  if (isEditMode) {
    status = fields.isActive ? 1 : 0;
  }

  const payload: ItemCreatePayload = {
    name: fields.name,
    category_id: fields.categoryId,
    price: Number(fields.price),
    stock: Number(fields.stock),
    image: fields.image,
    duration: Number(fields.duration),
    remark: fields.remark,
    status,
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

  /**
   * Submit item form.
   * @param {SyntheticEvent} event - Submit event
   * @returns {Promise<void>} Submission result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    const validationError = validateRequiredItemFields({
      name: params.fields.name,
      categoryId: params.fields.categoryId,
      price: params.fields.price,
      stock: params.fields.stock,
      duration: params.fields.duration,
    });

    if (validationError) {
      setErrorMessage(validationError);

      return;
    }

    try {
      const response = await _sendItemMutation(params);

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      navigate("/master-item");
    } catch {
      setErrorMessage(params.isEditMode ? "Unable to update item. Please try again." : "Unable to create item. Please try again.");
    }
  };

  return { errorMessage, handleSubmit };
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
  const fields = useItemFormFields(routeState);
  const categoryState = useCategorySelectOptions();
  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
  const submission = useItemSubmission({ id, isEditMode, fields, createItem, updateItem });
  /**
   *
   */
  const goBack = (): void => { navigate(-1); };

  return {
    ...fields,
    isEditMode,
    isSubmitting: isCreating || isUpdating,
    isCategoryLoading: categoryState.isLoading,
    categoryError: categoryState.errorMessage,
    categories: categoryState.categories,
    errorMessage: submission.errorMessage,
    handleSubmit: submission.handleSubmit,
    goBack,
  };
};
