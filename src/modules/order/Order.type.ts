import type { TableColumn } from "../../components/Table";

export type ApiRentalTransactionItem = {
  readonly item_id: string;
  readonly project_id: string;
  readonly item_name: string;
  readonly qty: number;
  readonly price: number;
  readonly subtotal: number;
  readonly remark: string;
};

export type ApiRentalTransaction = {
  readonly id: string;
  readonly customer_name: string;
  readonly customer_phone: string;
  readonly address: string;
  readonly event_name: string;
  readonly start_at: string;
  readonly end_at: string;
  readonly grand_total: number;
  readonly status: number;
  readonly created_at: string;
  readonly rental_transaction_items: ApiRentalTransactionItem[];
};

export type OrderListResponse = {
  readonly status: boolean;
  readonly data: ApiRentalTransaction[];
  readonly messages: string[];
  readonly page_number: number;
  readonly total_pages: number;
  readonly page_size: number;
  readonly total_count: number;
  readonly has_previous: boolean;
  readonly has_next: boolean;
};

export type OrderListParams = {
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly type: string;
  readonly status: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly searchTerm: string;
};

export type QuoteData = {
  readonly id: string;
  readonly name: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly location: string;
  readonly category: string;
  readonly selectedItems: string[];
  readonly qty: number;
  readonly pph: number;
  readonly discount: number;
  readonly remark: string;
  readonly grandTotal: number;
  readonly status: number;
  readonly customerPhone: string;
};

export type BaseOrderState = {
  readonly openCreateModal: () => void;
  readonly openEditModal: (quote: QuoteData) => void;
  readonly onRowClick: (quote: QuoteData) => void;
  readonly onBack: () => void;
};

export type OrderProps = BaseOrderState & {
  readonly columns: TableColumn<QuoteData>[];
  readonly paginatedData: QuoteData[];
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly totalCount: number;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEmpty: boolean;
  readonly goToPage: (page: number) => void;
  readonly changePageSize: (size: number) => void;
  readonly setSearchTerm: (searchTerm: string) => void;
  readonly onRowClick: (quote: QuoteData) => void;
};

export type ApiRentalTransactionDetailItem = {
  readonly item_id: string;
  readonly item_name: string;
  readonly qty: number;
  readonly price: number;
  readonly subtotal: number;
  readonly remark: string;
};

export type ApiRentalTransactionProjectItem = {
  readonly id: string;
  readonly item_id: string;
  readonly item_name: string;
  readonly qty: number;
  readonly price: number;
};

export type ApiRentalTransactionProject = {
  readonly id: string;
  readonly name: string;
  readonly remark: string;
  readonly qty: number;
  readonly subtotal: number;
  readonly items: ApiRentalTransactionProjectItem[];
};

export type ApiRentalTransactionDetail = {
  readonly id: string;
  readonly service_type_id: string;
  readonly service_type_name: string;
  readonly customer_name: string;
  readonly customer_phone: string;
  readonly address: string;
  readonly event_name: string;
  readonly start_at: string;
  readonly end_at: string;
  readonly subtotal: number;
  readonly service_fee: number;
  readonly discount: number;
  readonly grand_total: number;
  readonly status: number;
  readonly created_at: string;
  readonly updated_at: string;
  readonly rental_transaction_items: ApiRentalTransactionDetailItem[];
  readonly rental_transaction_project: ApiRentalTransactionProject[];
};

export type OrderDetailResponse = {
  readonly status: boolean;
  readonly data: ApiRentalTransactionDetail;
  readonly messages: string[];
};

export type OrderItemPayload = {
  readonly item_id: string;
  readonly project_id: string | null;
  readonly item_name: string;
  readonly qty: number;
  readonly price: number;
  readonly subtotal: number;
  readonly remark: string;
};

export type ProjectOrderItemPayload = {
  readonly project_id: string;
  readonly qty: number;
  readonly price: number;
  readonly subtotal: number;
  readonly remark: string;
};

export type ProjectOrderCreatePayload = {
  readonly customer_id: string;
  readonly pic_id: string;
  readonly voucher_id: string;
  readonly service_type_id: string;
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
  readonly rental_transaction_items: ProjectOrderItemPayload[];
};

export type OrderCreateResponse = {
  readonly status: boolean;
  readonly data: OrderCreatePayload | null;
  readonly messages: string[];
};

export type OrderCreatePayload = {
  readonly customer_id: string;
  readonly pic_id: string;
  readonly voucher_id: string;
  readonly service_type_id: string;
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

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly openEditModal: (quote: QuoteData) => void;
};
