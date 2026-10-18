import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { ApiPic, PicData, PicDetailResponse } from "../MasterPic.type";

import { validatePicFields } from "./MasterPicCreate.helpers";
import type {
  MasterPicCreateState,
  PicFormFieldsState,
  PicSubmissionParams,
} from "./MasterPicCreate.type";

import { useCreatePicMutation, useGetPicByIdQuery, useUpdatePicMutation } from "@/services/master-pic.service";

/**
 * Format backend messages into string.
 * @param {string[] | string | null} messages - Backend messages
 * @returns {string} Formatted message
 */
const _formatMessages = (messages: string[] | string | null): string => {
  if (Array.isArray(messages)) return messages.join(" ");

  return messages ?? "PIC request failed.";
};

/**
 * Resolve PIC detail response.
 * @param {PicDetailResponse | undefined} detailData - Detail response
 * @returns {ApiPic | null} API PIC record
 */
const _resolveApiPic = (detailData: PicDetailResponse | undefined): ApiPic | null => {
  if (!detailData?.status || !detailData.data) return null;

  return Array.isArray(detailData.data) ? detailData.data[0] ?? null : detailData.data;
};

/**
 * Get initial status state.
 * @param {PicData | undefined} routePic - Route PIC record
 * @param {ApiPic | null} apiPic - API PIC record
 * @returns {boolean} Initial status state
 */
const _getInitialActive = (routePic: PicData | undefined, apiPic: ApiPic | null): boolean => {
  if (routePic) return routePic.status === "active";

  if (apiPic) return apiPic.status === 1;

  return true;
};

/**
 * Manage PIC form fields.
 * @param {PicData | undefined} routePic - Route PIC record
 * @param {ApiPic | null} apiPic - API PIC record
 * @returns {PicFormFieldsState} Form field state
 */
const usePicFormFields = (routePic: PicData | undefined, apiPic: ApiPic | null): PicFormFieldsState => {
  const [name, setName] = useState(routePic?.name ?? apiPic?.name ?? "");
  const [isActive, setIsActive] = useState(_getInitialActive(routePic, apiPic));
  const [initializedId, setInitializedId] = useState<string | null>(routePic?.id ?? null);

  if (apiPic && apiPic.id !== initializedId) {
    setInitializedId(apiPic.id);
    setName(apiPic.name ?? "");
    setIsActive(apiPic.status === 1);
  }

  /**
   * Update PIC name.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event
   */
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  /** Toggle PIC status. */
  const handleStatusChange = (): void => {
    setIsActive((previous) => !previous);
  };

  return { name, isActive, handleNameChange, handleStatusChange };
};

/**
 * Submit PIC create or update mutation.
 * @param {PicSubmissionParams} params - Submission parameters
 * @returns {{ errorMessage: string | null; handleSubmit: (event: React.SyntheticEvent) => Promise<void>; isSubmitting: boolean }} Submission state
 */
const usePicSubmission = (params: PicSubmissionParams): {
  errorMessage: string | null;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
} => {
  const navigate = useNavigate();
  const [createPic, { isLoading: isCreating }] = useCreatePicMutation();
  const [updatePic, { isLoading: isUpdating }] = useUpdatePicMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Submit PIC form.
   * @param {React.SyntheticEvent} event - Form submit event
   * @returns {Promise<void>} Submit result
   */
  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    const validationError = validatePicFields(params.name);

    if (validationError) {
      setErrorMessage(validationError);

      return;
    }

    try {
      const response = params.isEditMode && params.id
        ? await updatePic({ id: params.id, name: params.name, status: params.isActive ? 1 : 0 }).unwrap()
        : await createPic({ name: params.name, status: 1 }).unwrap();

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      navigate("/master-pic");
    } catch {
      setErrorMessage(params.isEditMode ? "Unable to update PIC. Please try again." : "Unable to create PIC. Please try again.");
    }
  };

  return { errorMessage, handleSubmit, isSubmitting: isCreating || isUpdating };
};

/**
 * Manage PIC create state.
 * @returns {MasterPicCreateState} Form state
 */
export const useMasterPicCreate = (): MasterPicCreateState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const routePic: PicData | undefined = location.state?.pic;
  const { data: detailData, isLoading: isLoadingDetail } = useGetPicByIdQuery(id ?? "", { skip: !isEditMode || !id || Boolean(routePic) });
  const apiPic = _resolveApiPic(detailData);
  const formFields = usePicFormFields(routePic, apiPic);
  const submission = usePicSubmission({ id, isEditMode, ...formFields });

  /** Navigate back. */
  const goBack = (): void => {
    navigate(-1);
  };

  return { ...formFields, ...submission, isEditMode, isLoadingInitialData: isLoadingDetail && !routePic, goBack };
};
