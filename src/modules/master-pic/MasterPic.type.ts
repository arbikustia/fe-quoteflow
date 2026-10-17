import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope, ApiQueryParams, PaginatedResponse } from "../../types/api.type";

export type ApiPic = {
  readonly id: string;
  readonly name: string | null;
  readonly status: number;
  readonly created_by: string | null;
  readonly created_at: string | null;
  readonly updated_at: string | null;
};

export type PicListResponse = PaginatedResponse<ApiPic>;
export type PicDetailResponse = ApiEnvelope<ApiPic | ApiPic[] | null>;
export type PicCreateResponse = ApiEnvelope<ApiPic | null>;
export type PicListParams = ApiQueryParams;

export type PicCreatePayload = {
  readonly name: string;
  readonly status: number;
};

export type PicUpdatePayload = PicCreatePayload & {
  readonly id: string;
};

export type PicData = {
  readonly id: string;
  readonly name: string | null;
  readonly status: "active" | "inactive";
  readonly createAt: string | null;
  readonly createBy: string | null;
};

export type MasterPicNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (pic: PicData) => void;
  readonly goDetail: (pic: PicData) => void;
};

export type MasterPicPagination = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: PicData[];
  readonly totalCount: number;
  readonly isEmpty: boolean;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly setSearchTerm: (searchTerm: string) => void;
};

export type MasterPicContainerState = {
  readonly pagination: MasterPicPagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly goDelete: () => void;
  readonly handleCloseMore: () => void;
};

export type MasterPicProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: PicData[];
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly totalCount: number;
  readonly isEmpty: boolean;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly setSearchTerm: (searchTerm: string) => void;
  readonly columns: TableColumn<PicData>[];
  readonly onCreate: () => void;
  readonly onEdit: (pic: PicData) => void;
  readonly onRowClick: (pic: PicData) => void;
  readonly onMore: () => void;
  readonly isMoreOpen: boolean;
  readonly onCloseMore: () => void;
  readonly onDelete: () => void;
  readonly onBack: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (pic: PicData) => void;
};
