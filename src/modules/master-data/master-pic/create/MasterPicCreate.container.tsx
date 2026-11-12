import * as React from "react";
import { useLocation, useParams } from "react-router-dom";

import type { PicEditRouteState } from "../MasterPic.type";

import MasterPicCreateComponent from "./MasterPicCreate.component";
import { useMasterPicCreate } from "./MasterPicCreate.hook";
import type { PicFormMode } from "./MasterPicCreate.type";
import { normalizePicFormSource } from "./MasterPicCreate.util";

import { useCreatePicMutation, useUpdatePicMutation } from "@/services/master-pic.service";

/**
 * Render the PIC create / edit container. Edit mode is the `/master-pic/edit/:id` route.
 * @returns {React.ReactElement} - Container of the PIC form view
 */
const MasterPicCreateContainer = (): React.ReactElement => {
  const { id } = useParams();
  const routeState: PicEditRouteState = useLocation().state;
  const mode: PicFormMode = id ? "edit" : "create";
  const [createPic, createState] = useCreatePicMutation();
  const [updatePic, updateState] = useUpdatePicMutation();

  // Single upstream fallback: the form receives normalized initial values only
  const { formStatus, initialValues } = normalizePicFormSource({ id, routePic: routeState?.pic });
  const controller = useMasterPicCreate({ id, mode, initialValues, createPic, updatePic });

  return (
    <MasterPicCreateComponent
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

export default MasterPicCreateContainer;
