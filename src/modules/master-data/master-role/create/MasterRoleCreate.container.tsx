import * as React from "react";
import { useParams } from "react-router-dom";

import MasterRoleCreateComponent from "./MasterRoleCreate.component";
import { useMasterRoleCreate } from "./MasterRoleCreate.hook";
import type { RoleFormMode } from "./MasterRoleCreate.type";
import { normalizeRoleFormSource } from "./MasterRoleCreate.util";

import { useCreateRoleMutation, useGetRoleByIdQuery, useUpdateRoleMutation } from "@/services/master-role.service";

/**
 * Render the role create / edit container. Edit mode is the `/master-role/edit/:id` route.
 * @returns {React.ReactElement} - Container of the role form view
 */
const MasterRoleCreateContainer = (): React.ReactElement => {
  const { id } = useParams();
  const mode: RoleFormMode = id ? "edit" : "create";
  const { data, isLoading, isError } = useGetRoleByIdQuery(id ?? "", { skip: !id });
  const [createRole, createState] = useCreateRoleMutation();
  const [updateRole, updateState] = useUpdateRoleMutation();

  // Single upstream fallback: the form receives normalized initial values only
  const { formStatus, initialValues } = normalizeRoleFormSource({ data, isLoading, isError });
  const controller = useMasterRoleCreate({ id, mode, initialValues, createRole, updateRole });

  return (
    <MasterRoleCreateComponent
      mode={mode}
      formStatus={formStatus}
      values={controller.values}
      fieldErrors={controller.fieldErrors}
      isSubmitting={createState.isLoading || updateState.isLoading}
      errorMessage={controller.errorMessage}
      onNameChange={controller.handleNameChange}
      onStatusChange={controller.handleStatusChange}
      onSubmit={controller.handleSubmit}
      onBack={controller.handleBack}
    />
  );
};

export default MasterRoleCreateContainer;
