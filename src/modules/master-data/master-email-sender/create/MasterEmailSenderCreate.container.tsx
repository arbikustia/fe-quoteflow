import * as React from "react";
import { useParams } from "react-router-dom";

import MasterEmailSenderCreateComponent from "./MasterEmailSenderCreate.component";
import { useMasterEmailSenderCreate } from "./MasterEmailSenderCreate.hook";
import type { EmailSenderFormMode } from "./MasterEmailSenderCreate.type";
import { normalizeEmailSenderFormSource } from "./MasterEmailSenderCreate.util";

import {
  useCreateEmailSenderMutation,
  useGetEmailSenderByIdQuery,
  useUpdateEmailSenderMutation,
} from "@/services/email-sender.service";

/**
 * Render the email sender create / edit container. Edit mode is the `/master-email-sender/edit/:id` route.
 * @returns {React.ReactElement} - Container of the email sender form view
 */
const MasterEmailSenderCreateContainer = (): React.ReactElement => {
  const { id } = useParams();
  const mode: EmailSenderFormMode = id ? "edit" : "create";
  const { data, isLoading, isError } = useGetEmailSenderByIdQuery(id ?? "", { skip: !id });
  const [createEmailSender, createState] = useCreateEmailSenderMutation();
  const [updateEmailSender, updateState] = useUpdateEmailSenderMutation();

  // Single upstream fallback: the form receives normalized initial values only
  const { formStatus, initialValues } = normalizeEmailSenderFormSource({ data, isLoading, isError });
  const controller = useMasterEmailSenderCreate({ id, mode, initialValues, createEmailSender, updateEmailSender });

  return (
    <MasterEmailSenderCreateComponent
      mode={mode}
      formStatus={formStatus}
      values={controller.values}
      fieldErrors={controller.fieldErrors}
      isSubmitting={createState.isLoading || updateState.isLoading}
      errorMessage={controller.errorMessage}
      onTextChange={controller.handleTextChange}
      onPortChange={controller.handlePortChange}
      onToggleChange={controller.handleToggleChange}
      onSubmit={controller.handleSubmit}
      onBack={controller.handleBack}
    />
  );
};

export default MasterEmailSenderCreateContainer;
