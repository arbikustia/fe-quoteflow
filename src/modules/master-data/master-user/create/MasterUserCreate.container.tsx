import * as React from "react";
import { useParams } from "react-router-dom";

import MasterUserCreateComponent from "./MasterUserCreate.component";
import { useMasterUserCreate } from "./MasterUserCreate.hook";
import type { UserFormMode } from "./MasterUserCreate.type";
import { normalizeRoleOptions, normalizeUserFormSource } from "./MasterUserCreate.util";

import { useGetAllRolesQuery } from "@/services/master-role.service";
import { useCreateUserMutation, useGetUserByIdQuery, useUpdateUserMutation } from "@/services/master-user.service";

/**
 * Render the user create / edit container. Edit mode is the `/master-user/edit/:id` route.
 * @returns {React.ReactElement} - Container of the user form view
 */
const MasterUserCreateContainer = (): React.ReactElement => {
  const { id } = useParams();
  const mode: UserFormMode = id ? "edit" : "create";
  const detailQuery = useGetUserByIdQuery(id ?? "", { skip: !id });
  const rolesQuery = useGetAllRolesQuery();
  const [createUser, createState] = useCreateUserMutation();
  const [updateUser, updateState] = useUpdateUserMutation();

  // Single upstream fallback: the form receives normalized initial values and options only
  const { formStatus, initialValues } = normalizeUserFormSource(detailQuery);
  const roleOptions = normalizeRoleOptions(rolesQuery);
  const controller = useMasterUserCreate({ id, mode, initialValues, createUser, updateUser });

  return (
    <MasterUserCreateComponent
      {...roleOptions}
      mode={mode}
      formStatus={formStatus}
      values={controller.values}
      fieldErrors={controller.fieldErrors}
      isPasswordVisible={controller.isPasswordVisible}
      isSubmitting={createState.isLoading || updateState.isLoading}
      errorMessage={controller.errorMessage}
      onUsernameChange={controller.handleUsernameChange}
      onEmailChange={controller.handleEmailChange}
      onPasswordChange={controller.handlePasswordChange}
      onTogglePasswordVisibility={controller.handleTogglePasswordVisibility}
      onRoleChange={controller.handleRoleChange}
      onStatusChange={controller.handleStatusChange}
      onSubmit={controller.handleSubmit}
      onBack={controller.handleBack}
    />
  );
};

export default MasterUserCreateContainer;
