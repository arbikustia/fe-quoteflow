import type { ChangeEvent, SyntheticEvent } from "react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { formatProjectMessages, mapProjectItemOptions, mapProjectSelectedItems, validateProjectStep } from "./MasterProjectCreate.helpers";
import { useProjectItemSelection } from "./MasterProjectCreate.items.hook";

import type { ApiProject, MasterProjectCreateFormState, ProjectDraftFormState, ProjectFormStep, ProjectItemOption, ProjectSubmissionParams, ProjectSubmissionState } from "@/modules/master-project/MasterProject.type";
import { useGetAllItemsQuery } from "@/services/master-item.service";
import { useCreateProjectMutation, useGetProjectByIdQuery, useUpdateProjectMutation } from "@/services/master-project.service";

/**
 * Create input field change handler.
 * @param {(val: string) => void} setter - State setter
 * @returns {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} Change handler
 */
const _createInputChange = (
  setter: (val: string) => void,
): ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setter(event.target.value);
  }
);

/**
 * Manage project form input state and step wizard.
 * @param {ApiProject | null} project - Initial project data
 * @param {ProjectItemOption[]} items - Loaded item options
 * @returns {ProjectDraftFormState} Draft form state
 */
const useProjectDraft = (
  project: ApiProject | null,
  items: ProjectItemOption[],
): ProjectDraftFormState => {
  const [step, setStep] = useState<ProjectFormStep>(1);
  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const [initializedId, setInitializedId] = useState<string | null>(null);
  const itemSelection = useProjectItemSelection();

  if (project && items.length > 0 && project.id !== initializedId) {
    setInitializedId(project.id);
    setName(project.name ?? "");
    setRemark(project.remark ?? "");
    itemSelection.setSelectedItems(mapProjectSelectedItems(project, items));
  }

  const handleNameChange = _createInputChange(setName);
  const handleRemarkChange = _createInputChange(setRemark);
  /**
   * Advance to next step.
   * @returns {void} No return
   */
  const nextStep = (): void => { setStep((current) => (current + 1) as ProjectFormStep); };
  /**
   * Return to previous step.
   * @returns {void} No return
   */
  const previousStep = (): void => { setStep((current) => (current - 1) as ProjectFormStep); };

  return {
    step,
    name,
    remark,
    selectedItems: itemSelection.selectedItems,
    handleNameChange,
    handleRemarkChange,
    toggleItem: itemSelection.toggleItem,
    updateItemQuantity: itemSelection.updateItemQuantity,
    nextStep,
    previousStep,
  };
};


/**
 * Send project create or update mutation.
 * @param {ProjectSubmissionParams} params - Submission params
 * @param {ReturnType<typeof useCreateProjectMutation>[0]} createProject - Create trigger
 * @param {ReturnType<typeof useUpdateProjectMutation>[0]} updateProject - Update trigger
 * @returns {Promise<any>} API response
 */
const _sendProjectMutation = (
  params: ProjectSubmissionParams,
  createProject: ReturnType<typeof useCreateProjectMutation>[0],
  updateProject: ReturnType<typeof useUpdateProjectMutation>[0],
): Promise<{ status: boolean; messages: string[] | string | null }> => {
  const { id, isEdit, name, remark, selectedItems } = params;
  const payload = {
    name,
    remark,
    status: 1,
    items: selectedItems.map((item) => ({ item_id: item.id, qty: item.qty })),
  };

  return isEdit && id
    ? updateProject({ id, ...payload }).unwrap()
    : createProject(payload).unwrap();
};

/**
 * Handle form submission execution.
 * @param {ProjectSubmissionParams} params - Params
 * @param {ReturnType<typeof useCreateProjectMutation>[0]} createProject - Create mutation
 * @param {ReturnType<typeof useUpdateProjectMutation>[0]} updateProject - Update mutation
 * @param {object} handlers - Status setters and navigator
 * @param {(path: string) => void} handlers.navigate - Router navigation
 * @param {(msg: string | null) => void} handlers.setErrorMessage - Error setter
 * @param {(msg: string | null) => void} handlers.setSuccessMessage - Success setter
 * @returns {Promise<void>} Async result
 */
const _executeSubmission = async (
  params: ProjectSubmissionParams,
  createProject: ReturnType<typeof useCreateProjectMutation>[0],
  updateProject: ReturnType<typeof useUpdateProjectMutation>[0],
  handlers: {
    navigate: (path: string) => void;
    setErrorMessage: (msg: string | null) => void;
    setSuccessMessage: (msg: string | null) => void;
  },
): Promise<void> => {
  const { name, selectedItems, step, nextStep } = params;
  const stepError = validateProjectStep(step, selectedItems.length, name);

  if (stepError) {
    handlers.setErrorMessage(stepError);

    return;
  }

  if (step !== 3) {
    nextStep();

    return;
  }

  try {
    const response = await _sendProjectMutation(params, createProject, updateProject);

    if (!response.status) {
      handlers.setErrorMessage(formatProjectMessages(response.messages));

      return;
    }

    handlers.setSuccessMessage("Project created successfully.");
    handlers.navigate("/master-project", { state: { successMessage: "Project created successfully." } });
  } catch {
    handlers.setErrorMessage("Unable to create project. Please try again.");
  }
};

/**
 * Handle API project submission.
 * @param {ProjectSubmissionParams} params - Submission params
 * @returns {ProjectSubmissionState} Submission state
 */
const useProjectSubmission = (params: ProjectSubmissionParams): ProjectSubmissionState => {
  const navigate = useNavigate();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Submit project form to backend.
   * @param {SyntheticEvent} event - Submit event
   * @returns {Promise<void>} Async result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    await _executeSubmission(params, createProject, updateProject, {
      navigate,
      setErrorMessage,
      setSuccessMessage,
    });
  };

  return {
    isSubmitting: isCreating || isUpdating,
    errorMessage,
    successMessage,
    setErrorMessage,
    handleSubmit,
  };
};


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
