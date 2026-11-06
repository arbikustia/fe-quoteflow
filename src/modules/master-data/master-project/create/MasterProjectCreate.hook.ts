import type { ChangeEvent, SyntheticEvent } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import type { ApiProject, MasterProjectCreateFormState, ProjectDraftFormState, ProjectFormStep, ProjectFormValues,ProjectItemOption, ProjectSubmissionParams, ProjectSubmissionState } from "@/modules/master-data/master-project/MasterProject.type";
import { useGetAllItemsQuery } from "@/services/master-item.service";
import { useCreateProjectMutation, useGetProjectByIdQuery, useUpdateProjectMutation } from "@/services/master-project.service";

import { formatProjectMessages, mapProjectItemOptions, mapProjectSelectedItems, validateProjectStep } from "./MasterProjectCreate.helpers";
import { useProjectItemSelection } from "./MasterProjectCreate.items.hook";

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
/* eslint-disable max-lines-per-function */
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
    const {
      clearErrors,
      register,
      setValue,
      trigger,
      formState: { errors },
    } = useForm<ProjectFormValues>({ mode: "onChange", defaultValues: { name: "" } });
    const [step, setStep] = useState<ProjectFormStep>(1);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [remark, setRemark] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [initializedId, setInitializedId] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const itemSelection = useProjectItemSelection();

    register("name", { required: "Project name is required." });
    register("price", { required: "Project price is required." });

    /**
     * Validate step 2 input.
     * @returns {Promise<boolean>} Validation result
     */
    const validateStep2 = async (): Promise<boolean> => {
      setIsSubmitted(true);

      return await trigger("name");
    };

    if (project && items.length > 0 && project.id !== initializedId) {
      setInitializedId(project.id);
      setName(project.name ?? "");
      setValue("name", project.name ?? "");
      setPrice(String(project.price ?? 0));
      setValue("price", String(project.price ?? 0));
      clearErrors();
      setRemark(project.remark ?? "");
      setIsActive(project.status === 1);
      itemSelection.setSelectedItems(mapProjectSelectedItems(project, items));
    }

    /**
     * Update project name and validation value.
     * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - Input event
     * @returns {void} No return value
     */
    const handleNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setName(event.target.value);
      setValue("name", event.target.value, { shouldValidate: isSubmitted });
    };
    const handlePriceChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setPrice(event.target.value);
      setValue("price", event.target.value, { shouldValidate: isSubmitted });
    };
    const handleRemarkChange = _createInputChange(setRemark);
    /**
     * Toggle project active status.
     * @returns {void} No return value
     */
    const handleStatusChange = (): void => { setIsActive((current) => !current); };
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
      price,
      remark,
      isActive,
      selectedItems: itemSelection.selectedItems,
      handleNameChange,
      handlePriceChange,
      handleRemarkChange,
      handleStatusChange,
      toggleItem: itemSelection.toggleItem,
      updateItemQuantity: itemSelection.updateItemQuantity,
      nextStep,
      previousStep,
      errors,
      isSubmitted,
      validateStep2,
    };
  };
  /* eslint-enable max-lines-per-function */


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
  const { id, isEdit, name, price, remark, isActive, selectedItems } = params;
  const status = !isEdit || isActive ? 1 : 0;
  const payload = {
    name,
    remark,
    price: Number(price),
    status,
    items: selectedItems.map((item) => ({ item_id: item.id, qty: item.qty, price: item.price })),
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
// eslint-disable-next-line max-lines-per-function
const _executeSubmission = async (
  params: ProjectSubmissionParams,
  createProject: ReturnType<typeof useCreateProjectMutation>[0],
  updateProject: ReturnType<typeof useUpdateProjectMutation>[0],
  handlers: {
    navigate: (path: string, options?: { state: { successMessage: string } }) => void;
    setErrorMessage: (msg: string | null) => void;
    setSuccessMessage: (msg: string | null) => void;
  },
): Promise<void> => {
  const { name, selectedItems, step, nextStep } = params;
  const stepError = validateProjectStep(step, selectedItems.length, name);

  if (step === 2 && !await params.validateStep2()) {
    handlers.setErrorMessage("Project name is required.");

    return;
  }

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

    const successMessage = params.isEdit ? "Project updated successfully." : "Project created successfully.";

    handlers.setSuccessMessage(successMessage);
    handlers.navigate("/master-project", { state: { successMessage } });
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
    navigate("/master-project");
  };

  return {
    ...draft,
    isEditMode: isEdit,
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
