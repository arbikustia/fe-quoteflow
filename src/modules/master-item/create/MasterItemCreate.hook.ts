/* eslint-disable jsdoc/require-param-type, jsdoc/require-param-description */
import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";

import { useMasterItemCreate, useMasterItemNavigation } from "../MasterItem.hook";

import type { MasterItemCreateFormState } from "./MasterItemCreate.type";

import { useCategorySelectOptions } from "@/modules/master-category/MasterCategory.hook";

/**
 * Manage create item form state and submission.
 * @returns {MasterItemCreateFormState} Form state
 */
export const useMasterItemCreateForm = (): MasterItemCreateFormState => {
  const { goBack } = useMasterItemNavigation();
  const { createItem, isCreating: isSubmitting } = useMasterItemCreate();
  const { categories, isLoading: isCategoryLoading, errorMessage: categoryError } = useCategorySelectOptions();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [duration, setDuration] = useState("");
  const [remark, setRemark] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  /**
   *
   * @param event
   */
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => { setName(event.target.value); };
  /**
   *
   * @param event
   */
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>): void => { setCategoryId(event.target.value); };
  /**
   *
   * @param event
   */
  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>): void => { setPrice(event.target.value); };
  /**
   *
   * @param event
   */
  const handleStockChange = (event: ChangeEvent<HTMLInputElement>): void => { setStock(event.target.value); };
  /**
   *
   * @param event
   */
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => { setImage(event.target.value); };
  /**
   *
   * @param event
   */
  const handleDurationChange = (event: ChangeEvent<HTMLInputElement>): void => { setDuration(event.target.value); };
  /**
   *
   * @param event
   */
  const handleRemarkChange = (event: ChangeEvent<HTMLInputElement>): void => { setRemark(event.target.value); };
  /**
   *
   * @param event
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const response = await createItem({ name, category_id: categoryId, price: Number(price), stock: Number(stock), image, duration: Number(duration), remark });

      if (!response.status) {
        setErrorMessage(Array.isArray(response.messages) ? response.messages.join(" ") : (response.messages ?? "Failed to create item."));

        return;
      }

      goBack();
    } catch {
      setErrorMessage("Unable to create item. Please try again.");
    }
  };

  return { name, categoryId, price, stock, image, duration, remark, isSubmitting, isCategoryLoading, categoryError, errorMessage, categories, handleNameChange, handleCategoryChange, handlePriceChange, handleStockChange, handleImageChange, handleDurationChange, handleRemarkChange, handleSubmit, goBack };
};
