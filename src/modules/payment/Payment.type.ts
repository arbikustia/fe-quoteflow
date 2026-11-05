import type * as React from "react";

export type ApiPayment = {
  id: string;
  invoice_id: string;
  payment_method_id: string;
  amount: number;
  paid_at: string;
  reference_no: string;
  notes: string;
  status: number;
  created_at: string;
  updated_at: string;
  invoice?: {
    invoice_no: string;
    customer: {
      name: string;
    };
  };
};

export type PaymentInvoiceListResponse = { status: boolean; data: PaymentInvoiceOption[]; messages: string[] };
export type PaymentMethodListResponse = { status: boolean; data: PaymentMethodOption[]; messages: string[] };

export type PaymentListResponse = {
  status: boolean;
  data: ApiPayment[];
  messages: string[];
  page_number: number;
  total_pages: number;
  page_size: number;
  total_count: number;
  has_previous: boolean;
  has_next: boolean;
};

export type PaymentListParams = { pageNumber: number; pageSize: number; searchTerm: string };
export type PaymentCreatePayload = {
  invoice_id: string;
  payment_method_id: string;
  status: number;
  amount: number;
  paid_at: string;
  reference_no?: string;
  notes: string;
};
export type PaymentCreateResponse = { status: boolean; data: ApiPayment | null; messages: string[] };
export type PaymentDetailResponse = { status: boolean; data: ApiPayment | null; messages: string[] };
export type PaymentInvoiceOption = { id: string; invoice_no: string; customer_name?: string; event_name?: string };
export type PaymentMethodOption = { id: string; name: string };
export type PaymentRequiredFields = {
  invoiceId: string;
  paymentMethodId: string;
  status?: string | number;
  amount: number | null;
  paidAt: string;
  referenceNo?: string;
};

export type PaymentCreateFormState = {
  id?: string;
  isEditMode?: boolean;
  isActive?: boolean;
  invoices: PaymentInvoiceOption[];
  paymentMethods: PaymentMethodOption[];
  invoiceId: string;
  paymentMethodId: string;
  status: string;
  amount: number | null;
  paidAt: string;
  referenceNo?: string;
  notes: string;
  isLoadingOptions: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  isSubmitted: boolean;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  setInvoiceId: (value: string) => void;
  setPaymentMethodId: (value: string) => void;
  setStatus: (value: string) => void;
  setAmount: (value: number | null) => void;
  setPaidAt: (value: string) => void;
  setReferenceNo?: (value: string) => void;
  setNotes: (value: string) => void;
  handleStatusChange: (value: boolean) => void;
  goBack: () => void;
};

export type PaymentData = {
  id: string;
  invoiceId: string;
  paymentMethodId: string;
  invoiceNo: string;
  customerName: string;
  amount: number;
  paidAt: string;
  referenceNo: string;
  notes: string;
  status: "active" | "inactive";
  paymentStatus?: number;
  createdAt: string;
};

export type PaymentMobileCardProps = {
  payment: PaymentData;
  onClick: (payment: PaymentData) => void;
};

export type PaymentFieldErrors = {
  amountError: string | null;
  invoiceError: string | null;
  paidAtError: string | null;
  paymentMethodError: string | null;
  statusError: string | null;
};

export type PaymentSelectFieldConfig = {
  errorMessage: string | null;
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  placeholder: string;
  value: string;
};

export type PaymentHandlers = {
  handleAmountChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleNotes: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handlePaidAt: (value: string) => void;
};

export type PaymentFormFieldsConfig = PaymentFieldErrors &
  PaymentHandlers & {
    amountValue: string;
    invoiceOptions: Array<{ label: string; value: string }>;
    methodOptions: Array<{ label: string; value: string }>;
    props: PaymentCreateFormState;
  };

export type PaymentEditFormState = PaymentCreateFormState & {
  id: string;
  isEditMode: boolean;
  isActive: boolean;
  handleStatusChange: (value: boolean) => void;
};

export type PaymentPagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: PaymentData[];
  totalCount: number;
  isLoading: boolean;
  errorMessage: string | null;
  isMissingData: boolean;
  isEmpty: boolean;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (value: string) => void;
};

export type PaymentProps = PaymentPagination & {
  onBack: () => void;
  onCreate: () => void;
  onEdit: (payment: PaymentData) => void;
  onDetail?: (payment: PaymentData) => void;
  onRowClick: (payment: PaymentData) => void;
};

export type PaymentDetailState = {
  payment: PaymentData | null;
  linkedInvoice?: PaymentInvoiceOption | null;
  methodName?: string;
  isLoading: boolean;
  errorMessage: string | null;
  goBack: () => void;
  handleEdit: () => void;
  handleStatus: () => void;
};
