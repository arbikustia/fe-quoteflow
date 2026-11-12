import * as React from "react";
import { useParams } from "react-router-dom";

import MasterCategoryCreateComponent from "./MasterCategoryCreate.component";
import { useMasterCategoryCreate } from "./MasterCategoryCreate.hook";
import type { CategoryFormMode } from "./MasterCategoryCreate.type";
import { normalizeCategoryFormSource } from "./MasterCategoryCreate.util";

import {
  useCreateCategoryMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "@/services/master-category.service";

/**
 * Render the category create / edit container. Edit mode is the `/master-category/edit/:id` route.
 * @returns {React.ReactElement} - Container of the category form view
 */
const MasterCategoryCreateContainer = (): React.ReactElement => {
  const { id } = useParams();
  const mode: CategoryFormMode = id ? "edit" : "create";
  const { data, isLoading, isError } = useGetCategoryByIdQuery(id ?? "", { skip: !id });
  const [createCategory, createState] = useCreateCategoryMutation();
  const [updateCategory, updateState] = useUpdateCategoryMutation();

  // Single upstream fallback: the form receives normalized initial values only
  const { formStatus, initialValues } = normalizeCategoryFormSource({ data, isLoading, isError });
  const controller = useMasterCategoryCreate({ id, mode, initialValues, createCategory, updateCategory });

  return (
    <MasterCategoryCreateComponent
      mode={mode}
      formStatus={formStatus}
      values={controller.values}
      nameError={controller.nameError}
      isSubmitting={createState.isLoading || updateState.isLoading}
      errorMessage={controller.errorMessage}
      onNameChange={controller.handleNameChange}
      onStatusChange={controller.handleStatusChange}
      onSubmit={controller.handleSubmit}
      onBack={controller.handleBack}
    />
  );
};

export default MasterCategoryCreateContainer;
