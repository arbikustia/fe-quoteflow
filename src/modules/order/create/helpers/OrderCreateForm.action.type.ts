import type { OrderCreateState } from "../OrderCreate.type";

import type { CustomerOption, ProjectData, VoucherOption } from "./OrderCreateForm.type";

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
  projects: ProjectData[];
};

export type FormFieldValue = Parameters<OrderCreateState["onChange"]>[1];
export type OrderItemField = Parameters<OrderCreateState["onItemChange"]>[1];
export type OrderItemFieldValue = Parameters<OrderCreateState["onItemChange"]>[2];
export type VoucherSelection = Parameters<OrderCreateState["onVoucherChange"]>[0];
