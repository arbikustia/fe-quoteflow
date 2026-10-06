import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type PicData = MasterBase & {
  name: string;
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
  columns: TableColumn<PicData>[];
  onCreate: () => void;
  onEdit: (pic: PicData) => void;
  onRowClick: (pic: PicData) => void;
  
  onMore?: () => void;
  isMoreOpen?: boolean;
  onCloseMore?: () => void;
  onDelete?: () => void;
  onBack: () => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (pic: PicData) => void;
};
