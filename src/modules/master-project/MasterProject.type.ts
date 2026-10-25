import type * as React from "react";
import type { FieldErrors } from "react-hook-form";

import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";
import type { MasterBase } from "../../types/master";

export type ProjectItem = {
  item_id: string;
  item_name?: string | null;
  qty: number;
};

export type ApiProjectItem = {
  id: string;
  item_id: string;
  item_name: string | null;
  qty: number;
  status: number;
};

export type ApiProject = {
  id: string;
  name: string;
  remark: string | null;
  status: number;
  created_at: string | null;
  created_by: string | null;
  items?: ApiProjectItem[] | null;
};

export type ProjectAllResponse = ApiEnvelope<ApiProject[]>;
export type ProjectDetailResponse = ApiEnvelope<ApiProject | null>;
export type ProjectListResponse = PaginatedResponse<ApiProject>;
export type ProjectCreateResponse = ApiEnvelope<ApiProject | null>;
export type ProjectUpdateResponse = ApiEnvelope<ApiProject | null>;

export type ProjectListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

export type ProjectData = MasterBase & {
  name: string;
  remark: string;
  status: "active" | "inactive";
  items: ProjectItem[];
};

export type ProjectListApiState = {
  isLoading: boolean;
  errorMessage: string | null;
  isEnvelopeError: boolean;
  isMissingData: boolean;
  paginatedData: ProjectData[];
  totalPages: number;
  totalCount: number;
};

export type ProjectCreatePayload = {
  name: string;
  remark: string;
  status: number;
  items: ProjectItem[];
};

export type ProjectUpdatePayload = ProjectCreatePayload & {
  id: string;
};

export type ProjectItemOption = {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
};

export type ProjectItemSelection = ProjectItemOption & {
  qty: number;
};

export type ProjectFormStep = 1 | 2 | 3;

export type MasterProjectNavigation = {
  goBack: () => void;
  goCreate: () => void;
  goEdit: (item: ProjectData) => void;
  goDetail: (item: ProjectData) => void;
};

export type MasterProjectPagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: ProjectData[];
  totalCount: number;
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  isMissingData: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (searchTerm: string) => void;
};

export type MasterProjectContainerState = MasterProjectNavigation & {
  pagination: MasterProjectPagination;
  isMoreOpen: boolean;
  toggleMore: () => void;
  handleCloseMore: () => void;
  goDelete: () => void;
};

export type MasterProjectProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: ProjectData[];
  totalCount: number;
  isMoreOpen: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  isMissingData: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  onCreate: () => void;
  onEdit: (project: ProjectData) => void;
  onBack: () => void;
  onMore: () => void;
  onCloseMore: () => void;
  onDelete: () => void;
};


export type InputFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  required?: boolean;
  icon: React.ReactNode;
  type?: string;
  multiline?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export type ProjectFormValues = {
  name: string;
};

export type MasterProjectCreateFormState = {
  step: ProjectFormStep;
  items: ProjectItemOption[];
  selectedItems: ProjectItemSelection[];
  isItemsLoading: boolean;
  itemsError: string | null;
  name: string;
  remark: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  errors: FieldErrors<ProjectFormValues>;
  isSubmitted: boolean;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRemarkChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  nextStep: () => void;
  previousStep: () => void;
  toggleItem: (item: ProjectItemOption) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  handleSubmit: (event: React.SyntheticEvent) => void;
  goBack: () => void;
};

export type ProjectSubmissionParams = {
  id: string | undefined;
  isEdit: boolean;
  name: string;
  remark: string;
  selectedItems: ProjectItemSelection[];
  validateStep2: () => Promise<boolean>;
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
  errors: FieldErrors<ProjectFormValues>;
  isSubmitted: boolean;
  validateStep2: () => Promise<boolean>;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRemarkChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  toggleItem: (item: ProjectItemOption) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  nextStep: () => void;
  previousStep: () => void;
};

export type ProjectRouteState = {
  successMessage?: string;
};

export type ProjectItemSelectionState = {
  selectedItems: ProjectItemSelection[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ProjectItemSelection[]>>;
  toggleItem: (item: ProjectItemOption) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
};



