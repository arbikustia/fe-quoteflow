import * as React from "react";
import { useLocation, useParams } from "react-router-dom";

import { useCategorySelectOptions } from "@/hooks/useCategorySelectOptions";

import MasterItemCreateComponent from "./MasterItemCreate.component";
import { useMasterItemCreate } from "./MasterItemCreate.hook";
import type { ItemEditRouteState, ItemFormMode } from "./MasterItemCreate.type";
import { normalizeItemFormSource, toCategoryOptions } from "./MasterItemCreate.util";

import { useCreateItemMutation, useUpdateItemMutation, useUploadImageMutation } from "@/services/master-item.service";

/**
 * Render the item create / edit container. Edit mode is the `/master-item/edit/:id` route.
 * @returns {React.ReactElement} - Container of the item form view
 */
const MasterItemCreateContainer = (): React.ReactElement => {
  const { id } = useParams();
  const routeState: ItemEditRouteState = useLocation().state;
  const mode: ItemFormMode = id ? "edit" : "create";
  const categoryState = useCategorySelectOptions();
  const [createItem, createState] = useCreateItemMutation();
  const [updateItem, updateState] = useUpdateItemMutation();
  const [uploadImage, uploadState] = useUploadImageMutation();

  // Single upstream fallback: the form receives normalized initial values only
  const { formStatus, initialValues } = normalizeItemFormSource({ id, routeItem: routeState?.item });
  const controller = useMasterItemCreate({ id, mode, initialValues, createItem, updateItem, uploadImage });

  return (
    <MasterItemCreateComponent
      mode={mode}
      formStatus={formStatus}
      values={controller.values}
      fieldErrors={controller.fieldErrors}
      categoryOptions={toCategoryOptions(categoryState.categories)}
      isCategoryLoading={categoryState.isLoading}
      categoryErrorMessage={categoryState.errorMessage ?? controller.fieldErrors.categoryId}
      isSubmitting={createState.isLoading || updateState.isLoading}
      isImageUploading={uploadState.isLoading}
      imageUploadError={controller.imageUploadError}
      errorMessage={controller.errorMessage}
      onTextChange={controller.handleTextChange}
      onCategoryChange={controller.handleCategoryChange}
      onRemarkChange={controller.handleRemarkChange}
      onImageChange={controller.handleImageChange}
      onStatusChange={controller.handleStatusChange}
      onSubmit={controller.handleSubmit}
      onBack={controller.handleBack}
    />
  );
};

export default MasterItemCreateContainer;
