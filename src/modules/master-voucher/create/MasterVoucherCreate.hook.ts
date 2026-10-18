import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type {
  VoucherCreatePayload,
  VoucherCreateResponse,
  VoucherData,
  VoucherDetailResponse,
  VoucherFormFieldsState,
  VoucherSubmissionParams,
  VoucherSubmissionState,
  VoucherUpdatePayload,
} from "../MasterVoucher.type";

import { generateSecureVoucherCode, validateTypedVoucherCode } from "./MasterVoucherCreate.helpers";
import type { MasterVoucherCreateFormState } from "./MasterVoucherCreate.type";

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
 * Resolve voucher code value.
 * @param {string} code - Typed code
 * @param {"generate" | "type"} codeMode - Mode
 * @returns {string} Voucher code
 */
const _getVoucherCode = (code: string, codeMode: "generate" | "type"): string => {
  const finalCode = (codeMode === "generate" ? (code || generateSecureVoucherCode()) : code).trim().toUpperCase();

  return finalCode;
};

/**
 * Send voucher mutation.
 * @param {VoucherSubmissionParams} params - Submission parameters
 * @param {string} finalCode - Prepared code
 * @param {(payload: VoucherCreatePayload) => { unwrap: () => Promise<VoucherCreateResponse> }} createVoucher - Create mutation
 * @param {(payload: VoucherUpdatePayload) => { unwrap: () => Promise<VoucherCreateResponse> }} updateVoucher - Update mutation
 * @returns {Promise<VoucherCreateResponse>} API response
 */
const _sendVoucherMutation = (
  params: VoucherSubmissionParams,
  finalCode: string,
  createVoucher: (payload: VoucherCreatePayload) => { unwrap: () => Promise<VoucherCreateResponse> },
  updateVoucher: (payload: VoucherUpdatePayload) => { unwrap: () => Promise<VoucherCreateResponse> },
): Promise<VoucherCreateResponse> => {
  const payload = {
    name: params.name,
    code: finalCode,
    discount_percent: Number(params.discountPercent),
    status: 1,
  };

  if (params.isEditMode && params.id) {
    return updateVoucher({ ...payload, status: params.isActive ? 1 : 0, id: params.id }).unwrap();
  }

  return createVoucher(payload).unwrap();
};

/**
 * Handle form submission logic for voucher create or update.
 * @param {VoucherSubmissionParams} params - Submission parameters
 * @returns {VoucherSubmissionState} Submission state
 */
const useVoucherSubmission = (
  params: VoucherSubmissionParams,
): VoucherSubmissionState => {
  const { code, codeMode } = params;
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
    const finalCode = _getVoucherCode(code, codeMode);

    if (codeMode === "type") {
      const validationError = validateTypedVoucherCode(finalCode);

      if (validationError) {
        setErrorMessage(validationError);

        return;
      }
    }

    try {
      const response = await _sendVoucherMutation(params, finalCode, createVoucher, updateVoucher);

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
 * Update form state with api voucher item.
 * @param {VoucherData | null} apiItem - Fetched voucher item
 * @param {string | null} initializedId - Previously initialized ID
 * @param {(id: string | null) => void} setInitializedId - Set initialized ID
 * @param {object} setters - Field state setters
 * @param {(v: string) => void} setters.setName - Name setter
 * @param {(v: string) => void} setters.setCode - Code setter
 * @param {(v: string) => void} setters.setDiscountPercent - Discount setter
 * @param {(v: boolean) => void} setters.setIsActive - Status setter
 * @returns {void}
 */
const _syncApiVoucher = (
  apiItem: VoucherData | null,
  initializedId: string | null,
  setInitializedId: (id: string | null) => void,
  setters: {
    setName: (v: string) => void;
    setCode: (v: string) => void;
    setDiscountPercent: (v: string) => void;
    setIsActive: (v: boolean) => void;
  },
): void => {
  if (apiItem && apiItem.id !== initializedId) {
    setInitializedId(apiItem.id);
    setters.setName(apiItem.name ?? "");
    setters.setCode(apiItem.code ?? "");
    setters.setDiscountPercent(apiItem.discountPercent?.toString() ?? "");
    setters.setIsActive(apiItem.status === "active");
  }
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

  _syncApiVoucher(apiItem, initializedId, setInitializedId, { setName, setCode, setDiscountPercent, setIsActive });

  return {
    name,
    code,
    codeMode,
    discountPercent,
    isActive,
    /** @param {ChangeEvent<HTMLInputElement>} e - Name event */
    handleNameChange: (e: ChangeEvent<HTMLInputElement>): void => { setName(e.target.value); },
    /** @param {ChangeEvent<HTMLInputElement>} e - Code event */
    handleCodeChange: (e: ChangeEvent<HTMLInputElement>): void => { setCode(e.target.value); },
    /** @param {ChangeEvent<HTMLSelectElement>} e - Code mode event */
    handleCodeModeChange: (e: ChangeEvent<HTMLSelectElement>): void => {
      const nextMode = e.target.value === "type" ? "type" : "generate";

      setCodeMode(nextMode);
      setCode(nextMode === "generate" ? generateSecureVoucherCode() : "");
    },
    /** @param {ChangeEvent<HTMLInputElement>} e - Discount event */
    handleDiscountChange: (e: ChangeEvent<HTMLInputElement>): void => { setDiscountPercent(e.target.value); },
    /**
     *
     */
    handleStatusChange: (): void => { setIsActive((currentIsActive) => !currentIsActive); },
  };
};

/**
 * Provide voucher creation form state.
 * @returns {MasterVoucherCreateFormState} Voucher form state
 */
export const useMasterVoucherCreateForm = (): MasterVoucherCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const routeVoucher: VoucherData | undefined = location.state?.voucher;

  const { data: detailData } = useGetVoucherByIdQuery(id ?? "", {
    skip: !isEditMode || !id || Boolean(routeVoucher),
  });

  const apiItem = _resolveVoucherDetail(detailData);
  const formFields = useVoucherFormFields(routeVoucher, apiItem, isEditMode);
  const submission = useVoucherSubmission({ id, isEditMode, ...formFields });

  /**
   *
   */
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
