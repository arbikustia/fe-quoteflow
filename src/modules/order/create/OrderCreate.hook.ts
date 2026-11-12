import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { EMPTY_ITEM } from "./OrderCreate.config";
import { createFormActions, submitOrder } from "./OrderCreate.helper";
import type { ErrorMessageSetter, FormSetter, OrderCreateFormState, OrderCreateState, OrderLocationState, OrderOptionsState, OrderSubmitHookParams, OrderSubmitState, StepNavigationState, VoucherOptionsState } from "./OrderCreate.type";
import { buildEditForm, getDefaultDateRange, getNextOrderStep, getPreviousOrderStep, mapQuotationToOrderDetail, validateOrderStep } from "./OrderCreate.util";

import { useCreateActivityLogMutation } from "@/services/activity-log.service";
import { useGetAllCustomersQuery } from "@/services/master-customer.service";
import { useGetAllItemsQuery } from "@/services/master-item.service";
import { useGetAllPicsQuery } from "@/services/master-pic.service";
import { useGetAllProjectsQuery } from "@/services/master-project.service";
import { useGetAllServiceTypesQuery } from "@/services/master-service-type.service";
import { useGetAllVouchersQuery, useGetVoucherByCodeQuery } from "@/services/master-voucher.service";
import { useCreateOrderMutation, useCreateProjectOrderMutation, useGetAllOrderTypesQuery, useGetOrderByIdQuery, useUpdateOrderMutation } from "@/services/order.service";
import { useGetQuotationByIdQuery } from "@/services/quotation.service";

const DEFAULT_DATE_RANGE = getDefaultDateRange();
const INITIAL_FORM: OrderCreateFormState = { customer_id: "", pic_id: "", voucher_id: null, service_type_id: "", order_type_id: "", handover_type: "", handover_name: "", service_type_name: "", customer_name: "", customer_phone: "", address: "", event_name: "", start_at: DEFAULT_DATE_RANGE.start_at, end_at: DEFAULT_DATE_RANGE.end_at, subtotal: 0, discount: 0, service_fee: 0, remarks: "", grand_total: 0, status: 1, rental_transaction_items: [EMPTY_ITEM] };

/**
 * Manage voucher options with a debounced voucher code search.
 * @returns {VoucherOptionsState} Voucher options, loading state, and search handler.
 */
const useVoucherOptions = (): VoucherOptionsState => {
  const voucherQuery = useGetAllVouchersQuery();
  const [voucherSearchInput, setVoucherSearchInput] = useState("");
  const [voucherSearchCode, setVoucherSearchCode] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVoucherSearchCode(voucherSearchInput.trim());
    }, 500);

    return (): void => window.clearTimeout(timer);
  }, [voucherSearchInput]);

  const { data: searchedVoucher } = useGetVoucherByCodeQuery(voucherSearchCode, { skip: !voucherSearchCode });
  const voucherSearchResult = searchedVoucher?.data;
  const voucherData = Array.isArray(voucherSearchResult) ? voucherSearchResult[0] : voucherSearchResult;
  const vouchers = (voucherSearchInput.trim() && voucherData)
    ? [{ id: voucherData.id, name: voucherData.name, discount_percent: voucherData.discount_percent }]
    : (voucherQuery.data?.data ?? []);
  /**
   * Update voucher search input and reload all vouchers when cleared.
   * @param {string} code - Voucher code search input.
   * @returns {void} Nothing.
   */
  const onVoucherSearch = (code: string): void => {
    setVoucherSearchInput(code);

    if (!code.trim()) {
      setVoucherSearchCode("");
      void voucherQuery.refetch();
    }
  };

  return { vouchers, isVouchersLoading: voucherQuery.isLoading, onVoucherSearch };
};

/**
 * Load all select options used by the order form.
 * @returns {OrderOptionsState} Select options and their loading states.
 */
const useOrderOptions = (): OrderOptionsState => {
  const customerQuery = useGetAllCustomersQuery();
  const picQuery = useGetAllPicsQuery();
  const serviceTypeQuery = useGetAllServiceTypesQuery();
  const orderTypeQuery = useGetAllOrderTypesQuery();
  const itemQuery = useGetAllItemsQuery();
  const projectQuery = useGetAllProjectsQuery();
  const voucherOptions = useVoucherOptions();

  return {
    ...voucherOptions,
    customers: customerQuery.data?.data ?? [],
    pics: picQuery.data?.data ?? [],
    serviceTypes: serviceTypeQuery.data?.data ?? [],
    orderTypes: orderTypeQuery.data?.data ?? [],
    items: itemQuery.data?.data ?? [],
    projects: (projectQuery.data?.data ?? []).map((project) => ({ id: project.id, name: project.name, price: project.price, items: project.items ?? [] })),
    isCustomersLoading: customerQuery.isLoading,
    isPicsLoading: picQuery.isLoading,
    isServiceTypesLoading: serviceTypeQuery.isLoading,
    isOrderTypesLoading: orderTypeQuery.isLoading,
    isProjectsLoading: projectQuery.isLoading,
    isItemsLoading: itemQuery.isLoading,
  };
};

/**
 * Populate the form once when editing an existing order.
 * Uses /api/quotation/:id when opened from a quotation, otherwise /api/rental-transaction/:id.
 * @param {FormSetter} setForm - Form state setter.
 * @param {string} [id] - Transaction ID when editing.
 * @returns {void} Nothing.
 */
const useEditFormInit = (setForm: FormSetter, id?: string): void => {
  const location = useLocation();
  const quotationId: OrderLocationState["quotationId"] = location.state?.quotationId;
  const quotationDetailQuery = useGetQuotationByIdQuery(quotationId ?? "", { skip: !id || !quotationId, refetchOnMountOrArgChange: true });
  const orderDetailQuery = useGetOrderByIdQuery(id ?? "", { skip: !id || Boolean(quotationId) });
  const hasInitializedEdit = useRef(false);

  useEffect(() => {
    if (!id || hasInitializedEdit.current) return;

    const quotation = quotationDetailQuery.data?.data;
    const quotationOrder = quotation ? mapQuotationToOrderDetail(quotation) : null;
    const order = quotationId ? quotationOrder : orderDetailQuery.data?.data;

    if (!order) return;

    setForm(buildEditForm(order));
    hasInitializedEdit.current = true;
  }, [id, quotationId, quotationDetailQuery.data, orderDetailQuery.data]);
};

/**
 * Manage step navigation and step validation errors.
 * @param {OrderCreateFormState} form - Current form.
 * @param {OrderOptionsState} options - Select options.
 * @param {ErrorMessageSetter} setErrorMessage - Error message setter.
 * @returns {StepNavigationState} Step state and navigation handlers.
 */
const useStepNavigation = (form: OrderCreateFormState, options: OrderOptionsState, setErrorMessage: ErrorMessageSetter): StepNavigationState => {
  const [step, setStep] = useState<number>(1);
  const [showInformationErrors, setShowInformationErrors] = useState<boolean>(false);
  const [showItemErrors, setShowItemErrors] = useState<boolean>(false);
  /**
   * Move to the next step when the current step is valid.
   * @returns {void} Nothing.
   */
  const onNextStep = (): void => {
    const validation = validateOrderStep(step, form, options);

    if (!validation.isValid) {
      if (validation.section === "information") setShowInformationErrors(true);
      else setShowItemErrors(true);

      setErrorMessage(validation.message);

      return;
    }

    setShowInformationErrors(false);
    setShowItemErrors(false);
    setErrorMessage(null);
    setStep(getNextOrderStep);
  };
  /**
   * Move to the previous step.
   * @returns {void} Nothing.
   */
  const onPreviousStep = (): void => setStep(getPreviousOrderStep);

  return { step, showInformationErrors, showItemErrors, onNextStep, onPreviousStep };
};

/**
 * Manage order submission mutations and submit handler.
 * @param {OrderSubmitHookParams} params - Form, options, routing, and error setter.
 * @returns {OrderSubmitState} Submission state and handler.
 */
const useOrderSubmit = (params: OrderSubmitHookParams): OrderSubmitState => {
  const location = useLocation();
  const returnUrl: OrderLocationState["returnUrl"] = location.state?.returnUrl;
  const [createOrder, createMutation] = useCreateOrderMutation();
  const [createProjectOrder] = useCreateProjectOrderMutation();
  const [updateOrder, updateMutation] = useUpdateOrderMutation();
  const [createActivityLog] = useCreateActivityLogMutation();
  const mutation = params.id ? updateMutation : createMutation; // Edit quotation transaction when route carries transaction_id.
  /**
   * Submit the order form.
   * @param {React.SyntheticEvent} event - Submit event.
   * @returns {Promise<void>} Completion promise.
   */
  const onSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    params.setErrorMessage(null);

    try {
      await submitOrder({ ...params, createOrder, createProjectOrder, updateOrder, createActivityLog, returnUrl });
    } catch (error) {
      params.setErrorMessage(error instanceof Error ? `Unable to save order: ${error.message}` : "Unable to save order. Please review the form and try again.");
    }
  };

  return { isEdit: Boolean(params.id), isSubmitting: mutation.isLoading, onSubmit };
};

/**
 * Manage order creation form state, validation, and submission.
 * @returns {OrderCreateState} Order creation state and handlers.
 */
export const useOrderCreateLogic = (): OrderCreateState => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState<OrderCreateFormState>(INITIAL_FORM);
  const [errorMessage, setErrorMessage] = useState<OrderCreateState["errorMessage"]>(null);
  const options = useOrderOptions();
  const stepState = useStepNavigation(form, options, setErrorMessage);
  const submitState = useOrderSubmit({ form, id, orderTypes: options.orderTypes, projects: options.projects, navigate, setErrorMessage });

  useEditFormInit(setForm, id);

  const actions = createFormActions(setForm, options);
  /**
   * Navigate back to the previous page.
   * @returns {void} Nothing.
   */
  const onBack = (): void => {
    void navigate(-1);
  };
  /**
   * Prevent native form submission.
   * @param {React.SyntheticEvent<HTMLFormElement>} event - Form submit event.
   * @returns {void} Nothing.
   */
  const onPreventSubmit = (event: React.SyntheticEvent<HTMLFormElement>): void => event.preventDefault();

  return { form, errorMessage, ...options, ...stepState, ...submitState, ...actions, onBack, onPreventSubmit };
};
