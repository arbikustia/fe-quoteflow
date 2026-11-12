import type React from "react";
import type { NavigateFunction } from "react-router-dom";

import type { OrderCreatePayload, OrderCreateResponse, ProjectOrderCreatePayload, UpdateOrderRequest } from "../../Order.type";
import type { OrderCreateFormState, OrderCreateState, OrderProjectOption, OrderTypeOption, SelectOption } from "../OrderCreate.type";

import type { ActivityLogPayload } from "@/services/activity-log.service";

export type CustomerOption = SelectOption & { address: string; phone_number: string };
export type VoucherOption = SelectOption & { discount_percent: number };
export type OrderLocationState = { returnUrl?: string; quotationId?: string };
export type ProjectData = OrderProjectOption;
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
  projects: ProjectData[];
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
