import type { ChangeEvent, SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import type { UseFormRegister, UseFormReset } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type {
  MasterOrderTypeCreateFormState,
  OrderTypeCreateFormInput,
  OrderTypeFieldHandlers,
  OrderTypeFormApi,
  OrderTypeFormFields,
  OrderTypeFormValidation,
  OrderTypeFormValues,
  OrderTypeSubmissionParams,
  OrderTypeSubmissionState,
  OrderTypeSubmitContext,
} from "./MasterOrderTypeCreate.type";

import type { OrderTypeCreateResponse, OrderTypeData } from "@/modules/master-data/master-order-type/MasterOrderType.type";
import {
  useCreateOrderTypeMutation,
  useGetOrderTypeByIdQuery,
  useUpdateOrderTypeMutation,
} from "@/services/master-order-type.service";

/**
 * Format backend messages into a display string.
 *
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
 *
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
 *
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
 *
 * @param {UseFormRegister<OrderTypeFormValues>} register - Form register function
 * @returns {void} No return value
 */
const _registerOrderTypeFields = (register: UseFormRegister<OrderTypeFormValues>): void => {
  register("name", { required: "Order type name is required." });
};

/**
 * Reset form when API order type arrives.
 *
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
 * Register the order type form with react-hook-form.
 *
 * @param {OrderTypeData | undefined} routeOrderType - Order type from route state
 * @param {ReturnType<typeof _resolveOrderTypeDetail>} orderTypeItem - Order type from API
 * @returns {OrderTypeFormApi} Form API
 */
const useOrderTypeFormApi = (
  routeOrderType: OrderTypeData | undefined,
  orderTypeItem: ReturnType<typeof _resolveOrderTypeDetail>,
): OrderTypeFormApi => {
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
  useOrderTypeReset(orderTypeItem, reset);

  return {
    control: formControl,
    errors,
    getValues,
    register,
    setValue,
    trigger,
  };
};

/**
 * Build the order type field change handlers.
 *
 * @param {OrderTypeFormApi} api - Form API
 * @param {boolean} isSubmitted - Whether the form has been submitted
 * @param {boolean} isHandover - Current handover flag
 * @param {boolean} isActive - Current active status
 * @returns {OrderTypeFieldHandlers} Field handlers
 */
const _buildOrderTypeFieldHandlers = (
  api: OrderTypeFormApi,
  isSubmitted: boolean,
  isHandover: boolean,
  isActive: boolean,
): OrderTypeFieldHandlers => ({
  /**
   * Handle name change.
   *
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - Change event
   * @returns {void} No return value
   */
  handleNameChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    api.setValue("name", event.target.value, { shouldValidate: isSubmitted });
  },
  /**
   * Toggle handover flag.
   *
   * @returns {void} No return value
   */
  handleHandoverChange: (): void => {
    api.setValue("isHandover", !isHandover, { shouldValidate: true });
  },
  /**
   * Toggle active status.
   *
   * @returns {void} No return value
   */
  handleStatusChange: (): void => {
    api.setValue("isActive", !isActive, { shouldValidate: true });
  },
});

/**
 * Manage order type form fields and validation state.
 *
 * @param {OrderTypeData | undefined} routeOrderType - Order type from route state
 * @param {ReturnType<typeof _resolveOrderTypeDetail>} orderTypeItem - Order type from API
 * @returns {OrderTypeFormFields & OrderTypeFormValidation} Form state and handlers
 */
const useOrderTypeFormFields = (
  routeOrderType: OrderTypeData | undefined,
  orderTypeItem: ReturnType<typeof _resolveOrderTypeDetail>,
): OrderTypeFormFields & OrderTypeFormValidation => {
  const api = useOrderTypeFormApi(routeOrderType, orderTypeItem);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const name = useWatch({ control: api.control, name: "name" });
  const isHandover = useWatch({ control: api.control, name: "isHandover" });
  const isActive = useWatch({ control: api.control, name: "isActive" });

  /**
   * Validate the order type form.
   *
   * @returns {Promise<boolean>} Whether the form is valid
   */
  const validateForm = (): Promise<boolean> => {
    setIsSubmitted(true);

    return api.trigger();
  };

  return {
    name,
    isHandover,
    isActive,
    errors: api.errors,
    isSubmitted,
    getValues: api.getValues,
    register: api.register,
    validateForm,
    ..._buildOrderTypeFieldHandlers(api, isSubmitted, isHandover, isActive),
  };
};

/**
 * Send the order type create or update request.
 *
 * @param {OrderTypeSubmitContext} context - Bound submit context
 * @returns {Promise<OrderTypeCreateResponse>} Mutation response
 */
const _sendOrderTypeMutation = (context: OrderTypeSubmitContext): Promise<OrderTypeCreateResponse> => {
  const { name } = context.values;

  if (context.isEditMode && context.id) {
    return context.updateOrderType({ id: context.id, name, is_handover: context.isHandover, status: context.isActive ? 1 : 0 }).unwrap();
  }

  return context.createOrderType({ name, is_handover: context.isHandover, status: 1 }).unwrap();
};

/**
 * Submit the order type form and report the result.
 *
 * @param {OrderTypeSubmitContext} context - Bound submit context
 * @returns {Promise<void>} Resolves after submission settles
 */
const _submitOrderType = async (context: OrderTypeSubmitContext): Promise<void> => {
  if (!(await context.validateForm())) return;

  context.setErrorMessage(null);
  context.setSuccessMessage(null);

  try {
    const response = await _sendOrderTypeMutation(context);

    if (!response.status) {
      context.setErrorMessage(_formatMessages(response.messages));

      return;
    }

    const successMsg = context.isEditMode ? "Order type updated successfully." : "Order type created successfully.";

    context.setSuccessMessage(successMsg);
    context.navigate("/master-order-type", { state: { successMessage: successMsg } });
  } catch {
    context.setErrorMessage(context.isEditMode ? "Unable to update order type. Please try again." : "Unable to create order type. Please try again.");
  }
};

/**
 * Handle order type form submission.
 *
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

  /**
   * Submit the order type form.
   *
   * @param {SyntheticEvent} event - Form submission event
   * @returns {Promise<void>} Completion promise
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();

    await _submitOrderType({
      id,
      isEditMode,
      isActive,
      isHandover,
      values: getValues(),
      validateForm,
      createOrderType,
      updateOrderType,
      navigate,
      setErrorMessage,
      setSuccessMessage,
    });
  };

  return {
    isSubmitting: isCreating || isUpdating,
    errorMessage,
    successMessage,
    handleSubmit,
  };
};

/**
 * Build the master order type create form state.
 *
 * @param {OrderTypeCreateFormInput} input - Form state inputs
 * @returns {MasterOrderTypeCreateFormState} Form state
 */
const _buildCreateFormState = (input: OrderTypeCreateFormInput): MasterOrderTypeCreateFormState => ({
  name: input.formFields.name,
  isHandover: input.formFields.isHandover,
  isActive: input.formFields.isActive,
  isEditMode: input.isEditMode,
  isLoadingInitialData: input.isLoadingDetail,
  isSubmitting: input.submission.isSubmitting,
  errorMessage: input.submission.errorMessage,
  successMessage: input.submission.successMessage,
  errors: input.formFields.errors,
  isSubmitted: input.formFields.isSubmitted,
  handleNameChange: input.formFields.handleNameChange,
  handleHandoverChange: input.formFields.handleHandoverChange,
  handleStatusChange: input.formFields.handleStatusChange,
  handleSubmit: input.submission.handleSubmit,
  goBack: input.goBack,
});

/**
 * Hook managing master order type form state.
 *
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
  const formFields = useOrderTypeFormFields(routeOrderType, _resolveOrderTypeDetail(orderTypeDetail));
  const submission = useOrderTypeSubmission({
    id,
    isEditMode,
    isActive: formFields.isActive,
    isHandover: formFields.isHandover,
    getValues: formFields.getValues,
    validateForm: formFields.validateForm,
  });

  /**
   * Go back to the order type list.
   *
   * @returns {void} No return value
   */
  const goBack = (): void => {
    navigate("/master-order-type");
  };

  return _buildCreateFormState({ formFields, submission, isEditMode, isLoadingDetail, goBack });
};
