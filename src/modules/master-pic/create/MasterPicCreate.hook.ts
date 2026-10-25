/* eslint-disable jsdoc/require-param, jsdoc/require-returns */
import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import type { FieldError, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { ApiPic, PicCreateResponse, PicData, PicDetailResponse, PicRouteState } from "../MasterPic.type";

import type { MasterPicCreateState, PicFormFieldsState, PicFormValues, PicSubmissionParams } from "./MasterPicCreate.type";

import { useCreatePicMutation, useGetPicByIdQuery, useUpdatePicMutation } from "@/services/master-pic.service";

/** Format backend messages. */
const _formatMessages = (messages: string[] | string | null): string => Array.isArray(messages) ? messages.join(" ") : (messages ?? "PIC request failed.");

/** Resolve PIC detail response. */
const _resolveApiPic = (detailData: PicDetailResponse | undefined): ApiPic | null => {
  if (!detailData?.status || !detailData.data) return null;

  return Array.isArray(detailData.data) ? detailData.data[0] ?? null : detailData.data;
};

/** Register PIC validation rules. */
const _registerPicFields = (register: ReturnType<typeof useForm<PicFormValues>>["register"]): void => {
  register("name", { required: "PIC name is required." });
};

/** Create name change handler. */
const _createNameChange = (setValue: UseFormSetValue<PicFormValues>, error: FieldError | undefined): ((event: ChangeEvent<HTMLInputElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement>): void => setValue("name", event.target.value, { shouldValidate: Boolean(error) })
);

/** Create status toggle handler. */
const _createStatusToggle = (setValue: UseFormSetValue<PicFormValues>, isActive: boolean): (() => void) => (
  (): void => setValue("isActive", !isActive, { shouldDirty: true })
);

/** Create form validator. */
const _createFormValidator = (trigger: UseFormTrigger<PicFormValues>): (() => Promise<boolean>) => (
  async (): Promise<boolean> => await trigger()
);

/** Sync API PIC data into form. */
const _syncApiPic = (apiPic: ApiPic | null, initializedId: string | null, setInitializedId: (id: string | null) => void, setValue: UseFormSetValue<PicFormValues>): void => {
  if (!apiPic || apiPic.id === initializedId) return;

  setInitializedId(apiPic.id);
  setValue("name", apiPic.name ?? "");
  setValue("isActive", apiPic.status === 1);
};

/** Submit PIC mutation. */
const _sendPicMutation = (
  params: PicSubmissionParams,
  createPic: ReturnType<typeof useCreatePicMutation>[0],
  updatePic: ReturnType<typeof useUpdatePicMutation>[0],
): Promise<PicCreateResponse> => {
  const values = params.getValues();

  if (params.isEditMode && params.id) {
    return updatePic({ id: params.id, name: values.name, status: params.isActive ? 1 : 0 }).unwrap();
  }

  return createPic({ name: values.name, status: 1 }).unwrap();
};

/** Manage PIC submission. */
const usePicSubmission = (params: PicSubmissionParams): Pick<MasterPicCreateState, "errorMessage" | "handleSubmit" | "isSubmitting"> => {
  const navigate = useNavigate();
  const [createPic, { isLoading: isCreating }] = useCreatePicMutation();
  const [updatePic, { isLoading: isUpdating }] = useUpdatePicMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /** Submit PIC form. */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    if (!(await params.validateForm())) {
      setErrorMessage("PIC name is required.");

      return;
    }

    try {
      const response = await _sendPicMutation(params, createPic, updatePic);

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      const successMessage = params.isEditMode ? "PIC updated successfully." : "PIC created successfully.";

      navigate("/master-pic", { state: { successMessage } });
    } catch {
      setErrorMessage(params.isEditMode ? "Unable to update PIC. Please try again." : "Unable to create PIC. Please try again.");
    }
  };

  return { errorMessage, handleSubmit, isSubmitting: isCreating || isUpdating };
};

/** Manage PIC form fields. */
const usePicFormFields = (routePic: PicData | undefined, apiPic: ApiPic | null): PicFormFieldsState => {
  const { control, formState: { errors, isSubmitted }, getValues, register, setValue, trigger } = useForm<PicFormValues>({
    defaultValues: { name: routePic?.name ?? "", isActive: routePic?.status !== "inactive" },
    mode: "onSubmit", reValidateMode: "onChange",
  });

  _registerPicFields(register);
  const [initializedId, setInitializedId] = useState<string | null>(routePic?.id ?? null);
  const name = useWatch({ control, name: "name" });
  const isActive = useWatch({ control, name: "isActive" });

  _syncApiPic(apiPic, initializedId, setInitializedId, setValue);

  return { name, isActive, errors, isSubmitted, getValues, validateForm: _createFormValidator(trigger), handleNameChange: _createNameChange(setValue, errors.name), handleStatusChange: _createStatusToggle(setValue, isActive) };
};

/** Manage PIC create/edit form. */
export const useMasterPicCreate = (): MasterPicCreateState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const routeState: PicRouteState | null = location.state;
  const routePic = routeState?.pic;
  const { data: detailData, isLoading: isLoadingDetail } = useGetPicByIdQuery(id ?? "", { skip: !isEditMode || !id || Boolean(routePic) });
  const formFields = usePicFormFields(routePic, _resolveApiPic(detailData));
  const submission = usePicSubmission({ id, isEditMode, ...formFields });

  /** Navigate back. */
  const goBack = (): void => { navigate(-1); };

  return { ...formFields, ...submission, isEditMode, isLoadingInitialData: isLoadingDetail && !routePic, goBack };
};
