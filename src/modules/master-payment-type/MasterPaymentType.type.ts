import type * as React from "react";

import type { TableColumn } from "../../components/Table";
import type { PaginationResult } from "../../hooks/usePagination";

export type PaymentTypeData = {
  readonly id: string;
  readonly name: string | null;
  readonly status: "active" | "inactive";
  readonly createAt: string | null;
  readonly createBy: string | null;
};

export type PaymentTypeSubmissionParams = {
  readonly id: string | undefined;
  readonly isEditMode: boolean;
  readonly name: string;
  readonly isActive: boolean;
};

export type PaymentTypeSubmissionState = {
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
};

export type PaymentTypeFormFieldsState = {
  readonly name: string;
  readonly isActive: boolean;
  readonly handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleStatusChange: () => void;
};

export type PaymentTypeListApiState = {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isMissingData: boolean;
  readonly paginatedData: PaymentTypeData[];
  readonly totalPages: number;
  readonly totalCount: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
};

export type MasterPaymentTypeNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (paymentType: PaymentTypeData) => void;
  readonly goDetail: (paymentType: PaymentTypeData) => void;
};

export type MasterPaymentTypePagination = PaginationResult<PaymentTypeData> & {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isMissingData: boolean;
  readonly isEmpty: boolean;
  readonly setSearchTerm: (searchTerm: string) => void;
};

export type MasterPaymentTypeContainerState = MasterPaymentTypeNavigation & {
  readonly pagination: MasterPaymentTypePagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly goDelete: () => void;
  readonly handleCloseMore: () => void;
};

export type MasterPaymentTypeProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: PaymentTypeData[];
  readonly totalCount: number;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isMissingData: boolean;
  readonly isEmpty: boolean;
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly setSearchTerm: (searchTerm: string) => void;
  readonly columns: TableColumn<PaymentTypeData>[];
  readonly onCreate: () => void;
  readonly onEdit: (paymentType: PaymentTypeData) => void;
  readonly onRowClick: (paymentType: PaymentTypeData) => void;
  readonly onMore: () => void;
  readonly isMoreOpen: boolean;
  readonly onCloseMore: () => void;
  readonly onDelete: () => void;
  readonly onBack: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (paymentType: PaymentTypeData) => void;
};
