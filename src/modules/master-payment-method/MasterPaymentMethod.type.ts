import type * as React from "react";

import type { TableColumn } from "../../components/Table";
import type { PaginationResult } from "../../hooks/usePagination";

export type PaymentMethodData = {
  readonly id: string;
  readonly name: string | null;
  readonly description: string | null;
  readonly status: "active" | "inactive";
  readonly createAt: string | null;
  readonly createBy: string | null;
};

export type PaymentMethodSubmissionParams = {
  readonly id: string | undefined;
  readonly isEditMode: boolean;
  readonly name: string;
  readonly description: string;
  readonly isActive: boolean;
};

export type PaymentMethodSubmissionState = {
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
};

export type PaymentMethodFormFieldsState = {
  readonly name: string;
  readonly description: string;
  readonly isActive: boolean;
  readonly handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readonly handleStatusChange: () => void;
};

export type PaymentMethodDetailData = PaymentMethodData;

export type PaymentMethodListApiState = {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isMissingData: boolean;
  readonly paginatedData: PaymentMethodData[];
  readonly totalPages: number;
  readonly totalCount: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
};

export type MasterPaymentMethodProps = {
  readonly currentPage: number;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isMissingData: boolean;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: PaymentMethodData[];
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly totalCount: number;
  readonly isEmpty: boolean;
  readonly setSearchTerm: (searchTerm: string) => void;
  readonly columns: TableColumn<PaymentMethodData>[];
  readonly onCreate: () => void;
  readonly onEdit: (paymentMethod: PaymentMethodData) => void;
  readonly onRowClick: (paymentMethod: PaymentMethodData) => void;
  readonly onMore: () => void;
  readonly isMoreOpen: boolean;
  readonly onCloseMore: () => void;
  readonly onDelete: () => void;
  readonly onBack: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (paymentMethod: PaymentMethodData) => void;
};

export type MasterPaymentMethodNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (p: PaymentMethodData) => void;
  readonly goDetail: (p: PaymentMethodData) => void;
};

export type MasterPaymentMethodPagination = PaginationResult<PaymentMethodData> & {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isMissingData: boolean;
  readonly isEmpty: boolean;
  readonly setSearchTerm: (searchTerm: string) => void;
};

export type MasterPaymentMethodContainerState = MasterPaymentMethodNavigation & {
  readonly pagination: MasterPaymentMethodPagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly goDelete: () => void;
  readonly handleCloseMore: () => void;
};
