import type React from "react";
import type { NavigateFunction } from "react-router-dom";

import type { OrderCreatePayload, OrderCreateResponse, OrderItemPayload, ProjectOrderCreatePayload, UpdateOrderRequest } from "../Order.type";

import type { ActivityLogPayload } from "@/services/activity-log.service";

export type OrderCreateFormState = {
  customer_id: string;
  pic_id: string;
  voucher_id: string | null;
  service_type_id: string;
  order_type_id: string;
  handover_type: string;
  handover_name: string;
  service_type_name: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  event_name: string;
  start_at: string;
  end_at: string;
  subtotal: number;
  discount: number;
  service_fee: number;
  remarks: string;
  grand_total: number;
  status: number;
  rental_transaction_items: OrderItemPayload[];
};

/** Fields checked by the order information step. */
export type OrderInformationFields = Pick<
  OrderCreateFormState,
  "customer_id" | "customer_name" | "customer_phone" | "pic_id" | "service_type_id" | "order_type_id" | "handover_type" | "handover_name" | "event_name" | "start_at" | "end_at"
>;

/** Item row fields used to check stock. */
export type OrderQtyItem = Pick<OrderItemPayload, "item_id" | "qty">;

/** Item row fields used to calculate totals. */
export type OrderTotalsItem = Pick<OrderItemPayload, "price" | "qty"> & Partial<Pick<OrderItemPayload, "item_id" | "project_id" | "subtotal">>;

/** Form fields used to price an order. */
export type OrderPricing = Pick<OrderCreateFormState, "discount" | "service_fee"> & Partial<Pick<OrderCreateFormState, "start_at" | "end_at">>;

/** Calculated order totals. */
export type OrderTotals = {
  subtotal: number;
  discountAmount: number;
  grandTotal: number;
};

export type SelectOption = { id: string; name: string };
export type OrderItemOption = SelectOption & { image: string | null; price: number | null; stock: number | null };
export type OrderProjectOption = SelectOption & { price: number; items: ReadonlyArray<{ item_id: string; item_name: string | null; qty: number }> };
export type OrderTypeOption = SelectOption & { is_handover: boolean };

export type OrderCreateProps = {
  form: OrderCreateFormState;
  customers: Array<SelectOption & { address: string; phone_number: string }>;
  pics: SelectOption[];
  serviceTypes: SelectOption[];
  orderTypes: OrderTypeOption[];
  vouchers: Array<SelectOption & { discount_percent: number }>;
  projects: OrderProjectOption[];
  items: OrderItemOption[];
  isCustomersLoading: boolean;
  isPicsLoading: boolean;
  isServiceTypesLoading: boolean;
  isOrderTypesLoading: boolean;
  isVouchersLoading: boolean;
  isProjectsLoading: boolean;
  isItemsLoading: boolean;
  isEdit: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  showInformationErrors: boolean;
  showItemErrors: boolean;
  step: number;
  onBack: () => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onCustomerChange: (customerId: string) => void;
  onPicChange: (picId: string) => void;
  onVoucherChange: (voucherId: string | null) => void;
  onVoucherSearch: (code: string) => void;
  onServiceTypeChange: (serviceTypeId: string) => void;
  onOrderTypeChange: (orderTypeId: string) => void;
  onHandoverTypeChange: (handoverType: string) => void;
  onProjectSelect: (index: number, projectId: string) => void;
  onItemSelect: (index: number, itemId: string) => void;
  onToggleItem: (itemId: string) => void;
  onToggleProject: (projectId: string) => void;
  onChange: (field: keyof OrderCreateFormState, value: string | number) => void;
  onItemChange: (index: number, field: keyof OrderItemPayload, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSubmit: (event: React.SyntheticEvent) => void;
  onPreventSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type OrderCreateState = {
  form: OrderCreateFormState;
  customers: Array<SelectOption & { address: string; phone_number: string }>;
  pics: SelectOption[];
  serviceTypes: SelectOption[];
  orderTypes: OrderTypeOption[];
  vouchers: Array<SelectOption & { discount_percent: number }>;
  projects: OrderProjectOption[];
  items: OrderItemOption[];
  isCustomersLoading: boolean;
  isPicsLoading: boolean;
  isServiceTypesLoading: boolean;
  isOrderTypesLoading: boolean;
  isVouchersLoading: boolean;
  isProjectsLoading: boolean;
  isItemsLoading: boolean;
  isEdit: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  showInformationErrors: boolean;
  showItemErrors: boolean;
  step: number;
  onBack: () => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onCustomerChange: (customerId: string) => void;
  onPicChange: (picId: string) => void;
  onVoucherChange: (voucherId: string | null) => void;
  onVoucherSearch: (code: string) => void;
  onServiceTypeChange: (serviceTypeId: string) => void;
  onOrderTypeChange: (orderTypeId: string) => void;
  onHandoverTypeChange: (handoverType: string) => void;
  onProjectSelect: (index: number, projectId: string) => void;
  onItemSelect: (index: number, itemId: string) => void;
  onToggleItem: (itemId: string) => void;
  onToggleProject: (projectId: string) => void;
  onChange: (field: keyof OrderCreateFormState, value: string | number) => void;
  onItemChange: (index: number, field: keyof OrderItemPayload, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSubmit: (event: React.SyntheticEvent) => void;
  onPreventSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type CustomerOption = SelectOption & { address: string; phone_number: string };
export type VoucherOption = SelectOption & { discount_percent: number };
export type OrderLocationState = { returnUrl?: string; quotationId?: string };
export type FormSetter = React.Dispatch<React.SetStateAction<OrderCreateFormState>>;
export type ErrorMessageSetter = React.Dispatch<React.SetStateAction<OrderCreateState["errorMessage"]>>;
export type OrderDateRange = Pick<OrderCreateFormState, "start_at" | "end_at">;

export type MutationResult<TResponse> = { unwrap: () => Promise<TResponse> };
export type ActivityLogResponse = { status: boolean };
export type CreateOrderTrigger = (payload: OrderCreatePayload) => MutationResult<OrderCreateResponse>;
export type CreateProjectOrderTrigger = (payload: ProjectOrderCreatePayload) => MutationResult<OrderCreateResponse>;
export type UpdateOrderTrigger = (request: UpdateOrderRequest) => MutationResult<OrderCreateResponse>;
export type CreateActivityLogTrigger = (payload: ActivityLogPayload) => MutationResult<ActivityLogResponse>;

export type SubmitOrderParams = {
  form: OrderCreateFormState;
  orderTypes: OrderTypeOption[];
  projects: OrderProjectOption[];
  id?: string;
  createOrder: CreateOrderTrigger;
  createProjectOrder: CreateProjectOrderTrigger;
  updateOrder: UpdateOrderTrigger;
  createActivityLog: CreateActivityLogTrigger;
  navigate: NavigateFunction;
  setErrorMessage: ErrorMessageSetter;
  returnUrl?: string;
};

export type VoucherOptionsState = Pick<OrderCreateState, "vouchers" | "isVouchersLoading" | "onVoucherSearch">;

export type OrderOptionsState = VoucherOptionsState & Pick<
  OrderCreateState,
  | "customers"
  | "pics"
  | "serviceTypes"
  | "orderTypes"
  | "projects"
  | "items"
  | "isCustomersLoading"
  | "isPicsLoading"
  | "isServiceTypesLoading"
  | "isOrderTypesLoading"
  | "isProjectsLoading"
  | "isItemsLoading"
>;

export type OrderStepSection = "information" | "items";

export type OrderStepValidation =
  | { isValid: true }
  | { isValid: false; section: OrderStepSection; message: string };

export type StepNavigationState = Pick<OrderCreateState, "step" | "showInformationErrors" | "showItemErrors" | "onNextStep" | "onPreviousStep">;

export type OrderSubmitHookParams = Pick<SubmitOrderParams, "form" | "id" | "orderTypes" | "projects" | "navigate" | "setErrorMessage">;

export type OrderSubmitState = Pick<OrderCreateState, "isEdit" | "isSubmitting" | "onSubmit">;

export type ActionResult = Pick<
  OrderCreateState,
  | "onToggleItem"
  | "onToggleProject"
  | "onCustomerChange"
  | "onPicChange"
  | "onVoucherChange"
  | "onServiceTypeChange"
  | "onOrderTypeChange"
  | "onHandoverTypeChange"
  | "onProjectSelect"
  | "onItemSelect"
  | "onChange"
  | "onItemChange"
  | "onAddItem"
  | "onRemoveItem"
>;

export type FieldActions = Pick<ActionResult, "onChange" | "onPicChange" | "onOrderTypeChange" | "onHandoverTypeChange" | "onAddItem" | "onRemoveItem">;
export type OptionActions = Pick<ActionResult, "onCustomerChange" | "onVoucherChange" | "onServiceTypeChange">;
export type ItemActions = Pick<ActionResult, "onProjectSelect" | "onItemSelect" | "onItemChange" | "onToggleItem" | "onToggleProject">;

export type FormActionOptions = Pick<OrderCreateState, "serviceTypes" | "items"> & {
  customers: CustomerOption[];
  vouchers: VoucherOption[];
  projects: OrderProjectOption[];
};

export type FormFieldValue = Parameters<OrderCreateState["onChange"]>[1];
export type OrderItemField = Parameters<OrderCreateState["onItemChange"]>[1];
export type OrderItemFieldValue = Parameters<OrderCreateState["onItemChange"]>[2];
export type VoucherSelection = Parameters<OrderCreateState["onVoucherChange"]>[0];
