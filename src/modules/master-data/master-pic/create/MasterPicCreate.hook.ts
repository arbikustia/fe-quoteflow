import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import type {
  FieldError,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type {
  ApiPic,
  PicCreateResponse,
  PicData,
  PicDetailResponse,
  PicRouteState,
} from "../MasterPic.type";

import type {
  MasterPicCreateState,
  PicFormFieldsState,
  PicFormInstance,
  PicFormValues,
  PicSubmissionParams,
  PicSubmitContext,
} from "./MasterPicCreate.type";

import {
  useCreatePicMutation,
  useGetPicByIdQuery,
  useUpdatePicMutation,
} from "@/services/master-pic.service";

/**
 * Format backend messages.
 *
 * @param {string[] | string | null} messages - Messages
 * @returns {string} Resolved string
 */
const _formatMessages = (messages: string[] | string | null): string =>
  Array.isArray(messages)
    ? messages.join(" ")
    : (messages ?? "PIC request failed.");

/**
 * Resolve PIC detail response.
 *
 * @param {PicDetailResponse | undefined} detailData - Detail data
 * @returns {ApiPic | null} Resolved value
 */
const _resolveApiPic = (
  detailData: PicDetailResponse | undefined,
): ApiPic | null => {
  if (!detailData?.status || !detailData.data) return null;

  return Array.isArray(detailData.data)
    ? (detailData.data[0] ?? null)
    : detailData.data;
};

/**
 * Register PIC validation rules.
 *
 * @param {ReturnType<typeof useForm<PicFormValues>>["register"]} register - Register
 */
const _registerPicFields = (
  register: ReturnType<typeof useForm<PicFormValues>>["register"],
): void => {
  register("name", { required: "PIC name is required." });
};

/**
 * Create name change handler.
 *
 * @param {UseFormSetValue<PicFormValues>} setValue - Set value
 * @param {FieldError | undefined} error - Error
 * @returns {((event: ChangeEvent<HTMLInputElement>) => void)} Resolved value
 */
const _createNameChange =
  (
    setValue: UseFormSetValue<PicFormValues>,
    error: FieldError | undefined,
  ): ((event: ChangeEvent<HTMLInputElement>) => void) =>
  (event: ChangeEvent<HTMLInputElement>): void =>
    setValue("name", event.target.value, { shouldValidate: Boolean(error) });

/**
 * Create status toggle handler.
 *
 * @param {UseFormSetValue<PicFormValues>} setValue - Set value
 * @param {boolean} isActive - Whether active
 * @returns {(() => void)} Resolved value
 */
const _createStatusToggle =
  (setValue: UseFormSetValue<PicFormValues>, isActive: boolean): (() => void) =>
  (): void =>
    setValue("isActive", !isActive, { shouldDirty: true });

/**
 * Create form validator.
 *
 * @param {UseFormTrigger<PicFormValues>} trigger - Trigger
 * @returns {(() => Promise<boolean>)} Resolved value
 */
const _createFormValidator =
  (trigger: UseFormTrigger<PicFormValues>): (() => Promise<boolean>) =>
  async (): Promise<boolean> =>
    await trigger();

/**
 * Sync API PIC data into form.
 *
 * @param {ApiPic | null} apiPic - Api pic
 * @param {string | null} initializedId - Initialized id
 * @param {(id: string | null) => void} setInitializedId - Set initialized id
 * @param {UseFormSetValue<PicFormValues>} setValue - Set value
 */
const _syncApiPic = (
  apiPic: ApiPic | null,
  initializedId: string | null,
  setInitializedId: (id: string | null) => void,
  setValue: UseFormSetValue<PicFormValues>,
): void => {
  if (!apiPic || apiPic.id === initializedId) return;

  setInitializedId(apiPic.id);
  setValue("name", apiPic.name ?? "");
  setValue("isActive", apiPic.status === 1);
};

/**
 * Submit PIC mutation.
 *
 * @param {PicSubmissionParams} params - Params
 * @param {ReturnType<typeof useCreatePicMutation>[0]} createPic - Create pic
 * @param {ReturnType<typeof useUpdatePicMutation>[0]} updatePic - Update pic
 * @returns {Promise<PicCreateResponse>} Resolved promise value
 */
const _sendPicMutation = (
  params: PicSubmissionParams,
  createPic: ReturnType<typeof useCreatePicMutation>[0],
  updatePic: ReturnType<typeof useUpdatePicMutation>[0],
): Promise<PicCreateResponse> => {
  const values = params.getValues();

  if (params.isEditMode && params.id) {
    return updatePic({
      id: params.id,
      name: values.name,
      status: params.isActive ? 1 : 0,
    }).unwrap();
  }

  return createPic({ name: values.name, status: 1 }).unwrap();
};

/**
 * Submit the PIC form and report the result.
 *
 * @param {PicSubmitContext} context - Bound submit context
 * @returns {Promise<void>} Resolves after submission settles
 */
const _submitPic = async (context: PicSubmitContext): Promise<void> => {
  context.setErrorMessage(null);

  if (!(await context.params.validateForm())) {
    context.setErrorMessage("PIC name is required.");

    return;
  }

  try {
    const response = await _sendPicMutation(context.params, context.createPic, context.updatePic);

    if (!response.status) {
      context.setErrorMessage(_formatMessages(response.messages));

      return;
    }

    const successMessage = context.params.isEditMode ? "PIC updated successfully." : "PIC created successfully.";

    context.navigate("/master-pic", { state: { successMessage } });
  } catch {
    context.setErrorMessage(context.params.isEditMode ? "Unable to update PIC. Please try again." : "Unable to create PIC. Please try again.");
  }
};

/**
 * Manage PIC submission.
 *
 * @param {PicSubmissionParams} params - Params
 * @returns {Pick<MasterPicCreateState, "errorMessage" | "handleSubmit" | "isSubmitting">} Submission state
 */
const usePicSubmission = (
  params: PicSubmissionParams,
): Pick<
  MasterPicCreateState,
  "errorMessage" | "handleSubmit" | "isSubmitting"
> => {
  const navigate = useNavigate();
  const [createPic, { isLoading: isCreating }] = useCreatePicMutation();
  const [updatePic, { isLoading: isUpdating }] = useUpdatePicMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Submit PIC form.
   *
   * @param {SyntheticEvent} event - Submit event
   * @returns {Promise<void>} Completion promise
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();

    await _submitPic({ params, createPic, updatePic, navigate, setErrorMessage });
  };

  return { errorMessage, handleSubmit, isSubmitting: isCreating || isUpdating };
};

/**
 * Create the PIC react-hook-form instance.
 *
 * @param {PicData | undefined} routePic - Route pic
 * @returns {PicFormInstance} Form instance
 */
const usePicFormInstance = (routePic: PicData | undefined): PicFormInstance => {
  const form = useForm<PicFormValues>({
    defaultValues: {
      name: routePic?.name ?? "",
      isActive: routePic?.status !== "inactive",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  _registerPicFields(form.register);

  return form;
};

/**
 * Manage PIC form fields.
 *
 * @param {PicData | undefined} routePic - Route pic
 * @param {ApiPic | null} apiPic - Api pic
 * @returns {PicFormFieldsState} Resolved value
 */
const usePicFormFields = (
  routePic: PicData | undefined,
  apiPic: ApiPic | null,
): PicFormFieldsState => {
  const {
    control,
    formState: { errors, isSubmitted },
    getValues,
    setValue,
    trigger,
  } = usePicFormInstance(routePic);
  const [initializedId, setInitializedId] = useState<string | null>(routePic?.id ?? null);
  const name = useWatch({ control, name: "name" });
  const isActive = useWatch({ control, name: "isActive" });

  _syncApiPic(apiPic, initializedId, setInitializedId, setValue);

  return {
    name,
    isActive,
    errors,
    isSubmitted,
    getValues,
    validateForm: _createFormValidator(trigger),
    handleNameChange: _createNameChange(setValue, errors.name),
    handleStatusChange: _createStatusToggle(setValue, isActive),
  };
};

/**
 * Manage PIC create/edit form.
 *
 * @returns {MasterPicCreateState} Resolved value
 */
export const useMasterPicCreate = (): MasterPicCreateState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const routeState: PicRouteState | null = location.state;
  const routePic = routeState?.pic;
  const { data: detailData, isLoading: isLoadingDetail } = useGetPicByIdQuery(
    id ?? "",
    { skip: !isEditMode || !id || Boolean(routePic) },
  );
  const formFields = usePicFormFields(routePic, _resolveApiPic(detailData));
  const submission = usePicSubmission({ id, isEditMode, ...formFields });

  /**
   * Navigate back to the PIC list.
   *
   * @returns {void} No return value
   */
  const goBack = (): void => {
    navigate("/master-pic");
  };

  return {
    ...formFields,
    ...submission,
    isEditMode,
    isLoadingInitialData: isLoadingDetail && !routePic,
    goBack,
  };
};
