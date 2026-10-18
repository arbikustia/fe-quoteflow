import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useProjectDraft } from "./MasterProjectCreate.draft.hook";
import { mapProjectItemOptions, validateProjectStep } from "./MasterProjectCreate.helpers";
import { useProjectSubmission } from "./MasterProjectCreate.submit.hook";

import type {
  MasterProjectCreateFormState,
  ProjectDraftFormState,
  ProjectSubmissionState,
} from "@/modules/master-project/MasterProject.type";
import { useGetAllItemsQuery } from "@/services/master-item.service";
import {
  useGetProjectByIdQuery,
} from "@/services/master-project.service";

/**
 * Create step navigation handlers.
 * @param {ProjectDraftFormState} draft - Draft state
 * @param {ProjectSubmissionState} submission - Submission state
 * @returns {object} Navigation handlers
 */
const _createStepNavigators = (
  draft: ProjectDraftFormState,
  submission: ProjectSubmissionState,
): { nextStep: () => void; previousStep: () => void } => {
  /**
   * Advance to next step.
   * @returns {void} No return
   */
  const nextStep = (): void => {
    submission.setErrorMessage(null);
    const stepError = validateProjectStep(draft.step, draft.selectedItems.length, draft.name);

    if (stepError) {
      submission.setErrorMessage(stepError);

      return;
    }

    draft.nextStep();
  };

  /**
   * Return to previous step.
   * @returns {void} No return
   */
  const previousStep = (): void => {
    submission.setErrorMessage(null);
    draft.previousStep();
  };

  return { nextStep, previousStep };
};

/**
 * Manage master project create form state and submission.
 * @returns {MasterProjectCreateFormState} Form state and handlers
 */
export const useMasterProjectCreate = (): MasterProjectCreateFormState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const isEdit = Boolean(id);

  const { data: itemResponse, isLoading: isItemsLoading, error: itemError } = useGetAllItemsQuery();
  const { data: projectResponse, isLoading: isProjectLoading } = useGetProjectByIdQuery(id ?? "", { skip: !isEdit });

  const project = projectResponse?.status ? projectResponse.data : null;
  const items = useMemo(() => mapProjectItemOptions(itemResponse), [itemResponse]);
  const itemsError = itemError || (itemResponse && !itemResponse.status) ? "Unable to load items." : null;

  const draft = useProjectDraft(project, items);
  const submission = useProjectSubmission({ id, isEdit, ...draft });
  const { nextStep, previousStep } = _createStepNavigators(draft, submission);

  /**
   * Navigate back.
   * @returns {void} No return
   */
  const goBack = (): void => {
    navigate(-1);
  };

  return {
    ...draft,
    nextStep,
    previousStep,
    items,
    isItemsLoading,
    itemsError,
    isSubmitting: submission.isSubmitting || isProjectLoading,
    errorMessage: submission.errorMessage,
    successMessage: submission.successMessage,
    handleSubmit: submission.handleSubmit,
    goBack,
  };
};
