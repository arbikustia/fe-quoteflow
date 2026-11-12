import * as React from "react";
import { useParams } from "react-router-dom";

import MasterProjectCreateComponent from "./MasterProjectCreate.component";
import { useMasterProjectCreate } from "./MasterProjectCreate.hook";
import type { ProjectFormMode } from "./MasterProjectCreate.type";
import { normalizeProjectFormSource, normalizeProjectItemOptions } from "./MasterProjectCreate.util";

import { useGetAllItemsQuery } from "@/services/master-item.service";
import { useCreateProjectMutation, useGetProjectByIdQuery, useUpdateProjectMutation } from "@/services/master-project.service";

/**
 * Render the project create / edit container. Edit mode is the `/master-project/edit/:id` route.
 * @returns {React.ReactElement} - Container of the project form view
 */
const MasterProjectCreateContainer = (): React.ReactElement => {
  const { id } = useParams();
  const mode: ProjectFormMode = id ? "edit" : "create";
  const itemsQuery = useGetAllItemsQuery();
  const { data, isLoading, isError } = useGetProjectByIdQuery(id ?? "", { skip: !id });
  const [createProject, createState] = useCreateProjectMutation();
  const [updateProject, updateState] = useUpdateProjectMutation();

  // Single upstream fallback: the form receives normalized item options and initial values only
  const itemsView = normalizeProjectItemOptions({ data: itemsQuery.data, isLoading: itemsQuery.isLoading, isError: itemsQuery.isError });
  const { formStatus, initialValues } = normalizeProjectFormSource({ data, isLoading, isError, itemsView });
  const controller = useMasterProjectCreate({ id, mode, initialValues, createProject, updateProject });

  return (
    <MasterProjectCreateComponent
      {...itemsView}
      mode={mode}
      formStatus={formStatus}
      step={controller.step}
      values={controller.values}
      fieldErrors={controller.fieldErrors}
      isSubmitting={createState.isLoading || updateState.isLoading}
      errorMessage={controller.errorMessage}
      onItemToggle={controller.handleItemToggle}
      onItemQuantityChange={controller.handleItemQuantityChange}
      onNameChange={controller.handleNameChange}
      onPriceChange={controller.handlePriceChange}
      onRemarkChange={controller.handleRemarkChange}
      onStatusChange={controller.handleStatusChange}
      onSubmit={controller.handleSubmit}
      onStepBack={controller.handleStepBack}
      onBack={controller.handleBack}
    />
  );
};

export default MasterProjectCreateContainer;
