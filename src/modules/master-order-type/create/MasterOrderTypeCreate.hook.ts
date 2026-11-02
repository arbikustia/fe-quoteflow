import type { ChangeEvent, SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import type { UseFormRegister, UseFormReset } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { OrderTypeCreateResponse, OrderTypeData } from "@/modules/master-order-type/MasterOrderType.type";
import {
  useCreateOrderTypeMutation,
  useGetOrderTypeByIdQuery,
  useUpdateOrderTypeMutation,
} from "@/services/master-order-type.service";

import type {
  MasterOrderTypeCreateFormState,
  OrderTypeFormFields,
  OrderTypeFormValidation,
  OrderTypeFormValues,
  OrderTypeSubmissionParams,
  OrderTypeSubmissionState,
} from "./MasterOrderTypeCreate.type";

/**
 * Format backend messages into a display string.
 * @param {string[] | string | null} messages - Backend response messages
 * @returns {string} Display message
 */
const _formatMessages = (messages: string[] | string | null): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages ?? "Order type request failed.";
};

/**
 * Extract order type item from API detail payload.
 * @param {ReturnType<typeof useGetOrderTypeByIdQuery>["data"]} orderTypeDetail - Detail response
 * @returns {OrderTypeData | null} Order type item or null
 */
const _resolveOrderTypeDetail = (
  orderTypeDetail: ReturnType<typeof useGetOrderTypeByIdQuery>["data"],
): {
  id: string;
  name: string;
  is_handover: boolean;
  status: number;
} | null => {
  if (!orderTypeDetail?.status || !orderTypeDetail.data) {
    return null;
  }

  const payload = orderTypeDetail.data;

  return Array.isArray(payload) ? payload[0] : payload;
};

/**
 * Derive initial order type field values.
 * @param {OrderTypeData | undefined} routeOrderType - Order type from router state
 * @param {ReturnType<typeof _resolveOrderTypeDetail>} orderTypeItem - Order type from API
 * @returns {{ name: string; isHandover: boolean; isActive: boolean }} Initial values
 */
const _getInitialFieldValues = (
  routeOrderType: OrderTypeData | undefined,
  orderTypeItem: ReturnType<typeof _resolveOrderTypeDetail>,
): {
  name: string;
  isHandover: boolean;
  isActive: boolean;
} => ({
  name: routeOrderType?.name ?? orderTypeItem?.name ?? "",
  isHandover: routeOrderType ? routeOrderType.isHandover : Boolean(orderTypeItem?.is_handover),
  isActive: routeOrderType ? routeOrderType.status === "active" : orderTypeItem?.status === 1,
});

/**
 * Register order type validation rules.
 * @param {UseFormRegister<OrderTypeFormValues>} register - Form register function
 * @returns {void} No return value
 */
const _registerOrderTypeFields = (register: UseFormRegister<OrderTypeFormValues>): void => {
  register("name", { required: "Order type name is required." });
};

/**
 * Reset form when API order type arrives.
 * @param {ReturnType<typeof _resolveOrderTypeDetail>} orderTypeItem - Order type from API
 * @param {UseFormReset<OrderTypeFormValues>} reset - Form reset function
 * @returns {void} No return value
 */
const useOrderTypeReset = (
  orderTypeItem: ReturnType<typeof _resolveOrderTypeDetail>,
  reset: UseFormReset<OrderTypeFormValues>,
): void => {
  useEffect((): void => {
    if (orderTypeItem) {
      reset({
        name: orderTypeItem.name,
        isHandover: Boolean(orderTypeItem.is_handover),
        isActive: orderTypeItem.status === 1,
      });
    }
  }, [orderTypeItem, reset]);
};

/**
 * Manage order type form fields and validation state.
 * @param {OrderTypeData | undefined} routeOrderType - Order type from route state
 * @param {ReturnType<typeof _resolveOrderTypeDetail>} orderTypeItem - Order type from API
 * @returns {OrderTypeFormFields & OrderTypeFormValidation} Form state and handlers
 */
const useOrderTypeFormFields = (
  routeOrderType: OrderTypeData | undefined,
  orderTypeItem: ReturnType<typeof _resolveOrderTypeDetail>,
): OrderTypeFormFields & OrderTypeFormValidation => {
  const initial = _getInitialFieldValues(routeOrderType, orderTypeItem);
  const {
    control: formControl,
    formState: { errors },
    getValues,
    register,
    reset,
    setValue,
    trigger,
  } = useForm<OrderTypeFormValues>({
    defaultValues: { name: initial.name, isHandover: initial.isHandover, isActive: initial.isActive },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  _registerOrderTypeFields(register);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const name = useWatch({ control: formControl, name: "name" });
  const isHandover = useWatch({ control: formControl, name: "isHandover" });
  const isActive = useWatch({ control: formControl, name: "isActive" });

  useOrderTypeReset(orderTypeItem, reset);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setValue("name", event.target.value, { shouldValidate: isSubmitted });
  };

  const handleHandoverChange = (): void => {
    setValue("isHandover", !isHandover, { shouldValidate: true });
  };

  const handleStatusChange = (): void => {
    setValue("isActive", !isActive, { shouldValidate: true });
  };

  const validateForm = async (): Promise<boolean> => {
    setIsSubmitted(true);

    return trigger();
  };

  return {
    name,
    isHandover,
    isActive,
    errors,
    isSubmitted,
    getValues,
    register,
    validateForm,
    handleNameChange,
    handleHandoverChange,
    handleStatusChange,
  };
};

/**
 * Handle order type form submission.
 * @param {OrderTypeSubmissionParams} params - Submission parameters
 * @returns {OrderTypeSubmissionState} Submission state
 */
const useOrderTypeSubmission = (params: OrderTypeSubmissionParams): OrderTypeSubmissionState => {
  const { id, isEditMode, isActive, isHandover, getValues, validateForm } = params;
  const navigate = useNavigate();
  const [createOrderType, { isLoading: isCreating }] = useCreateOrderTypeMutation();
  const [updateOrderType, { isLoading: isUpdating }] = useUpdateOrderTypeMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();

    if (!(await validateForm())) {
      return;
    }

    const { name } = getValues();

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response: OrderTypeCreateResponse =
        isEditMode && id
          ? await updateOrderType({ id, name, is_handover: isHandover, status: isActive ? 1 : 0 }).unwrap()
          : await createOrderType({ name, is_handover: isHandover, status: 1 }).unwrap();

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      const successMsg = isEditMode ? "Order type updated successfully." : "Order type created successfully.";

      setSuccessMessage(successMsg);
      navigate("/master-order-type", { state: { successMessage: successMsg } });
    } catch {
      setErrorMessage(
        isEditMode
          ? "Unable to update order type. Please try again."
          : "Unable to create order type. Please try again.",
      );
    }
  };

  return {
    isSubmitting: isCreating || isUpdating,
    errorMessage,
    successMessage,
    handleSubmit,
  };
};

/**
 * Hook managing master order type form state.
 * @returns {MasterOrderTypeCreateFormState} Form state
 */
export const useMasterOrderTypeCreate = (): MasterOrderTypeCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const routeOrderType: OrderTypeData | undefined = location.state?.orderType;

  const { data: orderTypeDetail, isLoading: isLoadingDetail } = useGetOrderTypeByIdQuery(id ?? "", {
    skip: !isEditMode || !id || Boolean(routeOrderType),
  });

  const orderTypeItem = _resolveOrderTypeDetail(orderTypeDetail);
  const formFields = useOrderTypeFormFields(routeOrderType, orderTypeItem);
  const submission = useOrderTypeSubmission({
    id,
    isEditMode,
    isActive: formFields.isActive,
    isHandover: formFields.isHandover,
    getValues: formFields.getValues,
    validateForm: formFields.validateForm,
  });

  const goBack = (): void => {
    navigate(-1);
  };

  return {
    name: formFields.name,
    isHandover: formFields.isHandover,
    isActive: formFields.isActive,
    isEditMode,
    isLoadingInitialData: isLoadingDetail,
    isSubmitting: submission.isSubmitting,
    errorMessage: submission.errorMessage,
    successMessage: submission.successMessage,
    errors: formFields.errors,
    isSubmitted: formFields.isSubmitted,
    handleNameChange: formFields.handleNameChange,
    handleHandoverChange: formFields.handleHandoverChange,
    handleStatusChange: formFields.handleStatusChange,
    handleSubmit: submission.handleSubmit,
    goBack,
  };
};
