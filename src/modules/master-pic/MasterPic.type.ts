import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";
import type { MasterBase } from "../../types/master";

export type ApiPic = {
  readonly id: string;
  readonly name: string;
  readonly status: number;
  readonly created_by: string | null;
  readonly created_at: string | null;
  readonly updated_at: string | null;
};

export type PicListParams = {
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly searchTerm: string;
};

export type PicListResponse = PaginatedResponse<ApiPic>;
export type PicCreatePayload = {
  readonly name: string;
};
export type PicCreateResponse = ApiEnvelope<ApiPic | null>;

export type PicData = MasterBase & {
  readonly name: string;
};

export type PicListApiState = {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isMissingData: boolean;
  readonly paginatedData: PicData[];
  readonly totalPages: number;
  readonly totalCount: number;
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
  readonly setSearchTerm: (searchTerm: string) => void;
  readonly totalCount: number;
  readonly columns: TableColumn<PicData>[];
  readonly onCreate: () => void;
  readonly onEdit: (pic: PicData) => void;
  readonly onRowClick: (pic: PicData) => void;
  readonly onMore: () => void;
  readonly isMoreOpen: boolean;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEmpty: boolean;
  readonly isMissingData: boolean;
  readonly onCloseMore: () => void;
  readonly onDelete: () => void;
  readonly onBack: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (pic: PicData) => void;
};
