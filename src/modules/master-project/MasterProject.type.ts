import type * as React from "react";

import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";
import type { MasterBase } from "../../types/master";

export type ProjectItem = {
  item_id: string;
  item_name?: string | null;
  qty: number;
};

export type ApiProjectItem = {
  readonly id: string;
  readonly item_id: string;
  readonly item_name: string | null;
  readonly qty: number;
  readonly status: number;
};

export type ApiProject = {
  readonly id: string;
  readonly name: string;
  readonly remark: string | null;
  readonly status: number;
  readonly created_at: string | null;
  readonly created_by: string | null;
  readonly items?: ApiProjectItem[] | null;
};

export type ProjectAllResponse = ApiEnvelope<ApiProject[]>;
export type ProjectDetailResponse = ApiEnvelope<ApiProject | null>;
export type ProjectListResponse = PaginatedResponse<ApiProject>;
export type ProjectCreateResponse = ApiEnvelope<ApiProject | null>;
export type ProjectUpdateResponse = ApiEnvelope<ApiProject | null>;

export type ProjectListParams = {
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly searchTerm: string;
};

export type ProjectData = MasterBase & {
  name: string;
  remark: string;
  status: "active" | "inactive";
  items: ProjectItem[];
};

export type ProjectListApiState = {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEnvelopeError: boolean;
  readonly isMissingData: boolean;
  readonly paginatedData: ProjectData[];
  readonly totalPages: number;
  readonly totalCount: number;
};

export type ProjectCreatePayload = {
  readonly name: string;
  readonly remark: string;
  readonly status: number;
  readonly items: ProjectItem[];
};

export type ProjectUpdatePayload = ProjectCreatePayload & {
  readonly id: string;
};

export type ProjectItemOption = {
  readonly id: string;
  readonly name: string;
  readonly image: string;
  readonly price: number;
  readonly stock: number;
};

export type ProjectItemSelection = ProjectItemOption & {
  readonly qty: number;
};

export type ProjectFormStep = 1 | 2 | 3;

export type MasterProjectNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (item: ProjectData) => void;
  readonly goDetail: (item: ProjectData) => void;
};

export type MasterProjectPagination = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: ProjectData[];
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

export type MasterProjectContainerState = MasterProjectNavigation & {
  readonly pagination: MasterProjectPagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly handleCloseMore: () => void;
  readonly goDelete: () => void;
};

export type MasterProjectProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly ProjectData[];
  readonly totalCount: number;
  readonly columns: TableColumn<ProjectData>[];
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
  readonly onEdit: (project: ProjectData) => void;
  readonly onRowClick: (project: ProjectData) => void;
  readonly onBack: () => void;
  readonly onMore: () => void;
  readonly onCloseMore: () => void;
  readonly onDelete: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (project: ProjectData) => void;
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

export type MasterProjectCreateFormState = {
  readonly step: ProjectFormStep;
  readonly items: readonly ProjectItemOption[];
  readonly selectedItems: readonly ProjectItemSelection[];
  readonly isItemsLoading: boolean;
  readonly itemsError: string | null;
  readonly name: string;
  readonly remark: string;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleNameChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handleRemarkChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly nextStep: () => void;
  readonly previousStep: () => void;
  readonly toggleItem: (item: ProjectItemOption) => void;
  readonly updateItemQuantity: (itemId: string, quantity: number) => void;
  readonly handleSubmit: (event: React.SyntheticEvent) => void;
  readonly goBack: () => void;
};

export type ProjectSubmissionParams = {
  id: string | undefined;
  isEdit: boolean;
  name: string;
  remark: string;
  selectedItems: readonly ProjectItemSelection[];
  step: ProjectFormStep;
  nextStep: () => void;
};

export type ProjectSubmissionState = {
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
};

export type ProjectDraftFormState = {
  step: ProjectFormStep;
  name: string;
  remark: string;
  selectedItems: ProjectItemSelection[];
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRemarkChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  toggleItem: (item: ProjectItemOption) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  nextStep: () => void;
  previousStep: () => void;
};

export type ProjectItemSelectionState = {
  selectedItems: ProjectItemSelection[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ProjectItemSelection[]>>;
  toggleItem: (item: ProjectItemOption) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
};



