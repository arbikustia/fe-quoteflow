import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { MasterPicCreateState } from "./MasterPicCreate.type";
import type { PicCreateResponse } from "@/services/master-pic.service";
import { useCreatePicMutation, useGetPicByIdQuery, useUpdatePicMutation } from "@/services/master-pic.service";

/** Format backend messages into string. */
const _formatMessages = (messages: string[] | string | null): string => {
  if (Array.isArray(messages)) return messages.join(" ");
  return messages ?? "PIC request failed.";
};

/**
 * Manage PIC create state.
 * @returns {MasterPicCreateState} Form state
 */
export const useMasterPicCreate = (): MasterPicCreateState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ readonly id?: string }>();
  const isEditMode = Boolean(id);
  const routePic = location.state?.pic;

  const { data: detailData, isLoading: isLoadingDetail } = useGetPicByIdQuery(id ?? "", {
    skip: !isEditMode || !id || Boolean(routePic),
  });

  const apiItem = detailData?.status && detailData.data
    ? (Array.isArray(detailData.data) ? detailData.data[0] : detailData.data)
    : null;

  const initialName = routePic?.name ?? apiItem?.name ?? "";
  const initialIsActive = routePic
    ? routePic.status === "active"
    : (apiItem ? apiItem.status === 1 : true);

  const [name, setName] = useState(initialName);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [initializedId, setInitializedId] = useState<string | null>(routePic?.id ?? null);
  const isLoadingInitialData = isLoadingDetail && !routePic;

  if (apiItem && apiItem.id !== initializedId) {
    setInitializedId(apiItem.id);
    setName(apiItem.name ?? "");
    setIsActive(apiItem.status === 1);
  }

  const [createPic, { isLoading: isCreating }] = useCreatePicMutation();
  const [updatePic, { isLoading: isUpdating }] = useUpdatePicMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSubmitting = isCreating || isUpdating;

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleStatusChange = (): void => {
    setIsActive((prev) => !prev);
  };

  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      let response: PicCreateResponse;

      if (isEditMode && id) {
        response = await updatePic({ id, name, status: isActive ? 1 : 0 }).unwrap();
      } else {
        response = await createPic({ name, status: 1 }).unwrap();
      }

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));
        return;
      }

      navigate("/master-pic");
    } catch {
      setErrorMessage(isEditMode ? "Unable to update PIC. Please try again." : "Unable to create PIC. Please try again.");
    }
  };

  const goBack = (): void => {
    navigate(-1);
  };

  return {
    name,
    isActive,
    isEditMode,
    isLoadingInitialData,
    isSubmitting,
    errorMessage,
    handleNameChange,
    handleStatusChange,
    handleSubmit,
    goBack,
  };
};
