import type React from "react";

import type { OrderCreatePayload, OrderItemPayload } from "../Order.type";

export type OrderCreateFormState = {
  readonly customer_id: string;
  readonly pic_id: string;
  readonly voucher_id: string;
  readonly service_type_id: string;
  readonly service_type_name: string;
  readonly customer_name: string;
  readonly customer_phone: string;
  readonly address: string;
  readonly event_name: string;
  readonly start_at: string;
  readonly end_at: string;
  readonly subtotal: number;
  readonly discount: number;
  readonly service_fee: number;
  readonly remarks: string;
  readonly grand_total: number;
  readonly status: number;
  readonly rental_transaction_items: OrderItemPayload[];
};

export type SelectOption = { readonly id: string; readonly name: string };
export type OrderItemOption = SelectOption & { readonly image: string | null; readonly price: number | null; readonly stock: number | null };
export type OrderProjectOption = SelectOption & { readonly items: ReadonlyArray<{ readonly item_id: string; readonly item_name: string | null; readonly qty: number }> };

export type OrderCreateProps = {
  readonly form: OrderCreateFormState;
  readonly customers: Array<SelectOption & { readonly address: string; readonly phone_number: string }>;
  readonly pics: SelectOption[];
  readonly serviceTypes: SelectOption[];
  readonly vouchers: Array<SelectOption & { readonly discount_percent: number }>;
  readonly projects: OrderProjectOption[];
  readonly items: OrderItemOption[];
  readonly isCustomersLoading: boolean;
  readonly isPicsLoading: boolean;
  readonly isServiceTypesLoading: boolean;
  readonly isVouchersLoading: boolean;
  readonly isProjectsLoading: boolean;
  readonly isItemsLoading: boolean;
  readonly isEdit: boolean;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly step: number;
  readonly onBack: () => void;
  readonly onNextStep: () => void;
  readonly onPreviousStep: () => void;
  readonly onCustomerChange: (customerId: string) => void;
  readonly onPicChange: (picId: string) => void;
  readonly onVoucherChange: (voucherId: string) => void;
  readonly onServiceTypeChange: (serviceTypeId: string) => void;
  readonly onProjectSelect: (index: number, projectId: string) => void;
  readonly onItemSelect: (index: number, itemId: string) => void;
  readonly onToggleItem: (itemId: string) => void;
  readonly onToggleProject: (projectId: string) => void;
  readonly onChange: (field: keyof OrderCreateFormState, value: string | number) => void;
  readonly onItemChange: (index: number, field: keyof OrderItemPayload, value: string | number) => void;
  readonly onAddItem: () => void;
  readonly onRemoveItem: (index: number) => void;
  readonly onSubmit: (event: React.SyntheticEvent) => void;
  readonly onPreventSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type OrderCreateState = {
  readonly form: OrderCreateFormState;
  readonly customers: Array<SelectOption & { readonly address: string; readonly phone_number: string }>;
  readonly pics: SelectOption[];
  readonly serviceTypes: SelectOption[];
  readonly vouchers: Array<SelectOption & { readonly discount_percent: number }>;
  readonly projects: OrderProjectOption[];
  readonly items: OrderItemOption[];
  readonly isCustomersLoading: boolean;
  readonly isPicsLoading: boolean;
  readonly isServiceTypesLoading: boolean;
  readonly isVouchersLoading: boolean;
  readonly isProjectsLoading: boolean;
  readonly isItemsLoading: boolean;
  readonly isEdit: boolean;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly step: number;
  readonly onBack: () => void;
  readonly onNextStep: () => void;
  readonly onPreviousStep: () => void;
  readonly onCustomerChange: (customerId: string) => void;
  readonly onPicChange: (picId: string) => void;
  readonly onVoucherChange: (voucherId: string) => void;
  readonly onServiceTypeChange: (serviceTypeId: string) => void;
  readonly onProjectSelect: (index: number, projectId: string) => void;
  readonly onItemSelect: (index: number, itemId: string) => void;
  readonly onToggleItem: (itemId: string) => void;
  readonly onToggleProject: (projectId: string) => void;
  readonly onChange: (field: keyof OrderCreateFormState, value: string | number) => void;
  readonly onItemChange: (index: number, field: keyof OrderItemPayload, value: string | number) => void;
  readonly onAddItem: () => void;
  readonly onRemoveItem: (index: number) => void;
  readonly onSubmit: (event: React.SyntheticEvent) => void;
  readonly onPreventSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type OrderCreateResponse = {
  readonly status: boolean;
  readonly data: OrderCreatePayload | null;
  readonly messages: string[];
};
