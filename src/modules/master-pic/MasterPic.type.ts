import type { ApiEnvelope, ApiQueryParams, PaginatedResponse } from "../../types/api.type";

export type ApiPic = {
  id: string;
  name: string | null;
  status: number;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type PicAllResponse = {
  status: boolean;
  data: Array<{ id: string; name: string }>;
  messages: string[];
};

export type PicListResponse = PaginatedResponse<ApiPic>;
export type PicDetailResponse = ApiEnvelope<ApiPic | ApiPic[] | null>;
export type PicCreateResponse = ApiEnvelope<ApiPic | null>;
export type PicListParams = ApiQueryParams;

export type PicCreatePayload = {
  name: string;
  status: number;
};

export type PicUpdatePayload = PicCreatePayload & {
  id: string;
};

export type PicData = {
  id: string;
  name: string | null;
  status: "active" | "inactive";
  createAt: string | null;
  createBy: string | null;
};

export type PicRouteState = {
  pic?: PicData;
  successMessage?: string;
};

export type MasterPicNavigation = {
  goBack: () => void;
  goCreate: () => void;
  goEdit: (pic: PicData) => void;
};

export type MasterPicPagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: PicData[];
  totalCount: number;
  isEmpty: boolean;
  isLoading: boolean;
  isError: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (searchTerm: string) => void;
};

export type MasterPicContainerState = {
  pagination: MasterPicPagination;
  isMoreOpen: boolean;
  toggleMore: () => void;
  goDelete: () => void;
  handleCloseMore: () => void;
};

export type MasterPicProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: PicData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  isEmpty: boolean;
  isLoading: boolean;
  isError: boolean;
  setSearchTerm: (searchTerm: string) => void;
  onCreate: () => void;
  onEdit: (pic: PicData) => void;
  onRowClick: (pic: PicData) => void;
  onMore: () => void;
  isMoreOpen: boolean;
  onCloseMore: () => void;
  onDelete: () => void;
  onBack: () => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (pic: PicData) => void;
};
