import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { generateSecureVoucherCode, validateTypedVoucherCode } from "./MasterVoucherCreate.helpers";
import type { MasterVoucherCreateFormState } from "./MasterVoucherCreate.type";

import type {
  VoucherCreateResponse,
  VoucherData,
  VoucherDetailResponse,
  VoucherFormFieldsState,
  VoucherSubmissionParams,
  VoucherSubmissionState,
} from "../MasterVoucher.type";

import {
  mapVoucher,
  useCreateVoucherMutation,
  useGetVoucherByIdQuery,
  useUpdateVoucherMutation,
} from "@/services/master-voucher.service";

/**
 * Format backend messages into a display string.
 * @param {string[] | string | null} messages - Backend response messages
 * @returns {string} Display message
 */
const _formatMessages = (messages: string[] | string | null): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages ?? "Voucher request failed.";
};

/**
 * Resolve detail response into single UI voucher.
 * @param {VoucherDetailResponse | undefined} response - Detail response
 * @returns {VoucherData | null} Voucher or null
 */
const _resolveVoucherDetail = (response: VoucherDetailResponse | undefined): VoucherData | null => {
  if (!response?.status || !response.data) {
    return null;
  }

  const rawItem = Array.isArray(response.data) ? response.data[0] : response.data;

  return rawItem ? mapVoucher(rawItem) : null;
};

/**
 * Handle form submission logic for voucher create or update.
 * @param {VoucherSubmissionParams} params - Submission parameters
 * @returns {VoucherSubmissionState} Submission state
 */
const useVoucherSubmission = (
  params: VoucherSubmissionParams,
): VoucherSubmissionState => {
  const { id, isEditMode, name, code, codeMode, discountPercent, isActive } = params;
  const navigate = useNavigate();
  const [createVoucher, { isLoading: isCreating }] = useCreateVoucherMutation();
  const [updateVoucher, { isLoading: isUpdating }] = useUpdateVoucherMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSubmitting = isCreating || isUpdating;

  /**
   * Submit voucher form.
   * @param {SyntheticEvent} event - Submit event
   * @returns {Promise<void>} Async result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    const finalCode = (codeMode === "generate" ? (code || generateSecureVoucherCode()) : code).trim().toUpperCase();

    if (codeMode === "type") {
      const validationError = validateTypedVoucherCode(finalCode);

      if (validationError) {
        setErrorMessage(validationError);

        return;
      }
    }

    try {
      const payload = {
        name,
        code: finalCode,
        discount_percent: Number(discountPercent),
        status: 1,
      };

      let response: VoucherCreateResponse;

      if (isEditMode && id) {
        response = await updateVoucher({ ...payload, status: isActive ? 1 : 0, id }).unwrap();
      } else {
        response = await createVoucher(payload).unwrap();
      }

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      navigate("/master-voucher");
    } catch {
      setErrorMessage("Unable to save voucher. Please try again.");
    }
  };

  return { isSubmitting, errorMessage, handleSubmit };
};

/**
 * Hook managing form fields and synchronization.
 * @param {VoucherData | undefined} routeVoucher - Route voucher
 * @param {VoucherData | null} apiItem - API fetched voucher
 * @param {boolean} isEditMode - Edit mode flag
 * @returns {VoucherFormFieldsState} Form fields state
 */
const useVoucherFormFields = (
  routeVoucher: VoucherData | undefined,
  apiItem: VoucherData | null,
  isEditMode: boolean,
): VoucherFormFieldsState => {
  const initialMode = isEditMode ? "type" : "generate";
  const [codeMode, setCodeMode] = useState<"generate" | "type">(initialMode);
  const [name, setName] = useState(routeVoucher?.name ?? "");
  const [code, setCode] = useState(() => (
    routeVoucher?.code ?? (initialMode === "generate" ? generateSecureVoucherCode() : "")
  ));
  const [discountPercent, setDiscountPercent] = useState(routeVoucher?.discountPercent?.toString() ?? "");
  const [isActive, setIsActive] = useState(routeVoucher?.status ? routeVoucher.status === "active" : true);
  const [initializedId, setInitializedId] = useState<string | null>(routeVoucher?.id ?? null);

  if (apiItem && apiItem.id !== initializedId) {
    setInitializedId(apiItem.id);
    setName(apiItem.name ?? "");
    setCode(apiItem.code ?? "");
    setDiscountPercent(apiItem.discountPercent?.toString() ?? "");
    setIsActive(apiItem.status === "active");
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => { setName(e.target.value); };
  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>): void => { setCode(e.target.value); };
  const handleCodeModeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const nextMode = e.target.value === "type" ? "type" : "generate";
    setCodeMode(nextMode);
    setCode(nextMode === "generate" ? generateSecureVoucherCode() : "");
  };
  const handleDiscountChange = (e: ChangeEvent<HTMLInputElement>): void => { setDiscountPercent(e.target.value); };
  const handleStatusChange = (): void => { setIsActive((currentIsActive) => !currentIsActive); };

  return {
    name,
    code,
    codeMode,
    discountPercent,
    isActive,
    handleNameChange,
    handleCodeChange,
    handleCodeModeChange,
    handleDiscountChange,
    handleStatusChange,
  };
};

/**
 * Provide voucher creation form state.
 * @returns {MasterVoucherCreateFormState} Voucher form state
 */
export const useMasterVoucherCreateForm = (): MasterVoucherCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ readonly id?: string }>();
  const isEditMode = Boolean(id);
  const routeVoucher: VoucherData | undefined = location.state?.voucher;

  const { data: detailData } = useGetVoucherByIdQuery(id ?? "", {
    skip: !isEditMode || !id || Boolean(routeVoucher),
  });

  const apiItem = _resolveVoucherDetail(detailData);
  const formFields = useVoucherFormFields(routeVoucher, apiItem, isEditMode);
  const submission = useVoucherSubmission({ id, isEditMode, ...formFields });

  const goBack = (): void => {
    navigate(-1);
  };

  return {
    isEditMode,
    goBack,
    ...formFields,
    ...submission,
  };
};
