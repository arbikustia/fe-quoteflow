import type * as React from "react";

import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";

export type ApiCustomer = {
  readonly id: string;
  readonly name: string;
  readonly address: string | null;
  readonly phone_number: string | null;
  readonly status: number;
  readonly created_at: string | null;
  readonly created_by: string | null;
};

export type CustomerListResponse = ApiEnvelope<PaginatedResponse<ApiCustomer>>;
export type CustomerCreateResponse = ApiEnvelope<ApiCustomer | null>;

export type CustomerListParams = {
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly searchTerm: string;
};

export type CustomerData = {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly phoneNumber: string;
  readonly status: "active" | "inactive";
  readonly createAt: string;
  readonly createBy: string;
};

export type CustomerListApiState = {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEnvelopeError: boolean;
  readonly isMissingData: boolean;
  readonly paginatedData: CustomerData[];
  readonly totalPages: number;
  readonly totalCount: number;
};

export type CustomerCreatePayload = {
  readonly name: string;
  readonly address: string;
  readonly phone_number: string;
};

export type MasterCustomerNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (customer: CustomerData) => void;
  readonly goDetail: (customer: CustomerData) => void;
};

export type MasterCustomerPagination = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: CustomerData[];
  readonly totalCount: number;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEmpty: boolean;
  readonly isMissingData: boolean;
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly setSearchTerm: (searchTerm: string) => void;
};

export type MasterCustomerContainerState = {
  readonly pagination: MasterCustomerPagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly handleCloseMore: () => void;
  readonly goDelete: () => void;
};

export type MasterCustomerProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: CustomerData[];
  readonly totalCount: number;
  readonly columns: TableColumn<CustomerData>[];
  readonly isMoreOpen: boolean;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEmpty: boolean;
  readonly isMissingData: boolean;
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly setSearchTerm: (searchTerm: string) => void;
  readonly onCreate: () => void;
  readonly onEdit: (customer: CustomerData) => void;
  readonly onRowClick: (customer: CustomerData) => void;
  readonly onBack: () => void;
  readonly onMore: () => void;
  readonly onCloseMore: () => void;
  readonly onDelete: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (customer: CustomerData) => void;
};

export type InputFieldProps = {
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly required?: boolean;
  readonly icon: React.ReactNode;
  readonly type?: string;
  readonly multiline?: boolean;
  readonly onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export type MasterCustomerCreateFormState = {
  readonly name: string;
  readonly address: string;
  readonly phoneNumber: string;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleNameChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handlePhoneNumberChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handleAddressChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handleSubmit: (event: React.SyntheticEvent) => void;
  readonly goBack: () => void;
};
