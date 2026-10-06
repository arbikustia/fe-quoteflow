import type { TableColumn } from "../../components/Table";
import type { PaginationResult } from "../../hooks/usePagination";
import type { MasterBase } from "../../types/master";

export type PicData = MasterBase & {
  readonly name: string;
};

export type MasterPicNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (pic: PicData) => void;
  readonly goDetail: (pic: PicData) => void;
};

export type MasterPicContainerState = {
  readonly pagination: PaginationResult<PicData>;
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
