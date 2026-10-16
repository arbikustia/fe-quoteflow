import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useCategorySelectOptions } from "@/modules/master-category/MasterCategory.hook";
import type { ItemCreateResponse } from "@/modules/master-item/MasterItem.type";
import { useCreateItemMutation, useUpdateItemMutation } from "@/services/master-item.service";

import type { MasterItemCreateFormState } from "./MasterItemCreate.type";

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
 * Manage master item create and update form state.
 * @returns {MasterItemCreateFormState} Form state
 */
export const useMasterItemCreateForm = (): MasterItemCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ readonly id?: string }>();
  const isEditMode = Boolean(id);
  const routeItem = location.state?.item;
  const { categories, isLoading: isCategoryLoading, errorMessage: categoryError } = useCategorySelectOptions();
  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
  const [name, setName] = useState(routeItem?.name ?? "");
  const [categoryId, setCategoryId] = useState(routeItem?.categoryId ?? "");
  const [price, setPrice] = useState(routeItem?.price?.toString() ?? "");
  const [stock, setStock] = useState(routeItem?.stock?.toString() ?? "");
  const [image, setImage] = useState(routeItem?.image ?? "");
  const [duration, setDuration] = useState(routeItem?.duration?.toString() ?? "");
  const [remark, setRemark] = useState(routeItem?.remark ?? "");
  const [isActive, setIsActive] = useState(routeItem?.status === "active");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSubmitting = isCreating || isUpdating;

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => { setName(event.target.value); };
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>): void => { setCategoryId(event.target.value); };
  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>): void => { setPrice(event.target.value); };
  const handleStockChange = (event: ChangeEvent<HTMLInputElement>): void => { setStock(event.target.value); };
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => { setImage(event.target.value); };
  const handleDurationChange = (event: ChangeEvent<HTMLInputElement>): void => { setDuration(event.target.value); };
  const handleRemarkChange = (event: ChangeEvent<HTMLInputElement>): void => { setRemark(event.target.value); };
  const handleStatusChange = (): void => { setIsActive((currentIsActive) => !currentIsActive); };

  /**
   * Submit item form.
   * @param {SyntheticEvent} event - Form submit event
   * @returns {Promise<void>} Submission result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const payload = { name, category_id: categoryId, price: Number(price), stock: Number(stock), image, duration: Number(duration), remark, status: isEditMode ? (isActive ? 1 : 0) : 1 };
      let response: ItemCreateResponse;

      if (isEditMode && id) {
        response = await updateItem({ ...payload, id }).unwrap();
      } else {
        response = await createItem(payload).unwrap();
      }

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      navigate("/master-item");
    } catch {
      setErrorMessage(isEditMode ? "Unable to update item. Please try again." : "Unable to create item. Please try again.");
    }
  };

  /**
   * Navigate back.
   * @returns {void} No return value
   */
  const goBack = (): void => { navigate(-1); };

  return {
    name,
    categoryId,
    price,
    stock,
    image,
    duration,
    remark,
    isActive,
    isEditMode,
    isSubmitting,
    isCategoryLoading,
    categoryError,
    errorMessage,
    categories,
    handleNameChange,
    handleCategoryChange,
    handlePriceChange,
    handleStockChange,
    handleImageChange,
    handleDurationChange,
    handleRemarkChange,
    handleStatusChange,
    handleSubmit,
    goBack,
  };
};
