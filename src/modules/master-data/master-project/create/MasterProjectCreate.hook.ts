import type { ChangeEvent, SyntheticEvent } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { formatProjectMessages, mapProjectItemOptions, mapProjectSelectedItems, validateProjectStep } from "./MasterProjectCreate.helpers";
import { useProjectItemSelection } from "./MasterProjectCreate.items.hook";

import type { ApiProject, MasterProjectCreateFormState, ProjectDraftFormState, ProjectDraftHandlers, ProjectDraftHandlersInput, ProjectDraftSetters, ProjectDraftStateApi, ProjectFormStep, ProjectFormValues, ProjectItemOption, ProjectSubmissionHandlers, ProjectSubmissionParams, ProjectSubmissionState } from "@/modules/master-data/master-project/MasterProject.type";
import { useGetAllItemsQuery } from "@/services/master-item.service";
import { useCreateProjectMutation, useGetProjectByIdQuery, useUpdateProjectMutation } from "@/services/master-project.service";

/**
 * Create input field change handler.
 *
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
 * Apply loaded project data into the draft form state.
 *
 * @param {ApiProject} project - Loaded project
 * @param {ProjectItemOption[]} items - Loaded item options
 * @param {string | null} initializedId - Last applied project id
 * @param {ProjectDraftSetters} setters - Draft setters
 * @returns {void} No return value
 */
const _applyLoadedProject = (
  project: ApiProject,
  items: ProjectItemOption[],
  initializedId: string | null,
  setters: ProjectDraftSetters,
): void => {
  if (items.length === 0 || project.id === initializedId) return;

  const price = String(project.price ?? 0);

  setters.setInitializedId(project.id);
  setters.setName(project.name ?? "");
  setters.setValue("name", project.name ?? "");
  setters.setPrice(price);
  setters.setValue("price", price);
  setters.clearErrors();
  setters.setRemark(project.remark ?? "");
  setters.setIsActive(project.status === 1);
  setters.setSelectedItems(mapProjectSelectedItems(project, items));
};

/**
 * Build the project draft change handlers.
 *
 * @param {ProjectDraftHandlersInput} input - Handler inputs
 * @returns {ProjectDraftHandlers} Change handlers
 */
const _buildProjectDraftHandlers = (input: ProjectDraftHandlersInput): ProjectDraftHandlers => ({
  /**
   * Update project name and validation value.
   *
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - Input event
   * @returns {void} No return value
   */
  handleNameChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    input.setName(event.target.value);
    input.setValue("name", event.target.value, { shouldValidate: input.isSubmitted });
  },
  /**
   * Update project price and validation value.
   *
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - Input event
   * @returns {void} No return value
   */
  handlePriceChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    input.setPrice(event.target.value);
    input.setValue("price", event.target.value, { shouldValidate: input.isSubmitted });
  },
  handleRemarkChange: _createInputChange(input.setRemark),
  /**
   * Toggle project active status.
   *
   * @returns {void} No return value
   */
  handleStatusChange: (): void => {
    input.setIsActive((current) => !current);
  },
});

/**
 * Create the project draft state container.
 *
 * @returns {ProjectDraftStateApi} Draft state and setters
 */
const useProjectDraftState = (): ProjectDraftStateApi => {
  const form = useForm<ProjectFormValues>({ mode: "onChange", defaultValues: { name: "" } });
  const [step, setStep] = useState<ProjectFormStep>(1);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [remark, setRemark] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [initializedId, setInitializedId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const itemSelection = useProjectItemSelection();

  form.register("name", { required: "Project name is required." });
  form.register("price", { required: "Project price is required." });

  return {
    form,
    step,
    setStep,
    name,
    setName,
    price,
    setPrice,
    remark,
    setRemark,
    isActive,
    setIsActive,
    initializedId,
    setInitializedId,
    isSubmitted,
    setIsSubmitted,
    itemSelection,
  };
};

/**
 * Build the draft form state returned by the draft hook.
 *
 * @param {ProjectDraftStateApi} state - Draft state container
 * @param {ProjectDraftHandlers} handlers - Change handlers
 * @param {() => Promise<boolean>} validateStep2 - Step 2 validator
 * @returns {ProjectDraftFormState} Draft form state
 */
const _buildDraftFormState = (
  state: ProjectDraftStateApi,
  handlers: ProjectDraftHandlers,
  validateStep2: () => Promise<boolean>,
): ProjectDraftFormState => ({
  step: state.step,
  name: state.name,
  price: state.price,
  remark: state.remark,
  isActive: state.isActive,
  selectedItems: state.itemSelection.selectedItems,
  ...handlers,
  toggleItem: state.itemSelection.toggleItem,
  updateItemQuantity: state.itemSelection.updateItemQuantity,
  /**
   * Advance to next step.
   *
   * @returns {void} No return value
   */
  nextStep: (): void => {
    state.setStep((current) => (current + 1) as ProjectFormStep);
  },
  /**
   * Return to previous step.
   *
   * @returns {void} No return value
   */
  previousStep: (): void => {
    state.setStep((current) => (current - 1) as ProjectFormStep);
  },
  errors: state.form.formState.errors,
  isSubmitted: state.isSubmitted,
  validateStep2,
});

/**
 * Manage project form input state and step wizard.
 *
 * @param {ApiProject | null} project - Initial project data
 * @param {ProjectItemOption[]} items - Loaded item options
 * @returns {ProjectDraftFormState} Draft form state
 */
const useProjectDraft = (
  project: ApiProject | null,
  items: ProjectItemOption[],
): ProjectDraftFormState => {
  const state = useProjectDraftState();
  const { form, itemSelection } = state;

  /**
   * Validate step 2 input.
   *
   * @returns {Promise<boolean>} Validation result
   */
  const validateStep2 = async (): Promise<boolean> => {
    state.setIsSubmitted(true);

    return await form.trigger("name");
  };

  if (project) {
    _applyLoadedProject(project, items, state.initializedId, {
      setInitializedId: state.setInitializedId,
      setName: state.setName,
      setValue: form.setValue,
      setPrice: state.setPrice,
      clearErrors: form.clearErrors,
      setRemark: state.setRemark,
      setIsActive: state.setIsActive,
      setSelectedItems: itemSelection.setSelectedItems,
    });
  }

  const handlers = _buildProjectDraftHandlers({
    setName: state.setName,
    setValue: form.setValue,
    isSubmitted: state.isSubmitted,
    setPrice: state.setPrice,
    setRemark: state.setRemark,
    setIsActive: state.setIsActive,
  });

  return _buildDraftFormState(state, handlers, validateStep2);
};


/**
 * Send project create or update mutation.
 *
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
 * Validate the current wizard step and advance when possible.
 *
 * @param {ProjectSubmissionParams} params - Params
 * @param {ProjectSubmissionHandlers} handlers - Status setters and navigator
 * @returns {Promise<boolean>} Whether the form may submit now
 */
const _passSubmissionStep = async (
  params: ProjectSubmissionParams,
  handlers: ProjectSubmissionHandlers,
): Promise<boolean> => {
  const { name, selectedItems, step, nextStep } = params;
  const stepError = validateProjectStep(step, selectedItems.length, name);

  if (step === 2 && !await params.validateStep2()) {
    handlers.setErrorMessage("Project name is required.");

    return false;
  }

  if (stepError) {
    handlers.setErrorMessage(stepError);

    return false;
  }

  if (step !== 3) {
    nextStep();

    return false;
  }

  return true;
};

/**
 * Handle form submission execution.
 *
 * @param {ProjectSubmissionParams} params - Params
 * @param {ReturnType<typeof useCreateProjectMutation>[0]} createProject - Create mutation
 * @param {ReturnType<typeof useUpdateProjectMutation>[0]} updateProject - Update mutation
 * @param {ProjectSubmissionHandlers} handlers - Status setters and navigator
 * @returns {Promise<void>} Async result
 */
const _executeSubmission = async (
  params: ProjectSubmissionParams,
  createProject: ReturnType<typeof useCreateProjectMutation>[0],
  updateProject: ReturnType<typeof useUpdateProjectMutation>[0],
  handlers: ProjectSubmissionHandlers,
): Promise<void> => {
  if (!await _passSubmissionStep(params, handlers)) return;

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
 *
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
   *
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
 *
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
   *
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
   *
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
 *
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
   *
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
