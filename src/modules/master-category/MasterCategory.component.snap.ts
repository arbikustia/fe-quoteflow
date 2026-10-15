import test from "@/libs/unit-test";

import type { TableColumn } from "@/components/Table";

import { MasterCategoryComponent } from "./MasterCategory.component";
import type { CategoryData, MasterCategoryProps } from "./MasterCategory.type";

const mockCategories: CategoryData[] = [{ id: "1", categoryName: "Audio System", status: "active", createAt: "2024-02-01", createBy: "Admin" }];
const mockColumns: TableColumn<CategoryData>[] = [{ key: "categoryName", header: "Name" }];
const defaultProps: MasterCategoryProps = {
  paginatedData: mockCategories,
  columns: mockColumns,
  currentPage: 1,
  totalPages: 1,
  pageSize: 5,
  totalCount: 1,
  isLoading: false,
  errorMessage: null,
  isEmpty: false,
  isMissingData: false,
  isMoreOpen: false,
  goToPage: (): void => {},
  nextPage: (): void => {},
  prevPage: (): void => {},
  changePageSize: (): void => {},
  setSearchTerm: (): void => {},
  onCreate: (): void => {},
  onEdit: (): void => {},
  onRowClick: (): void => {},
  onBack: (): void => {},
  onMore: (): void => {},
  onCloseMore: (): void => {},
  onDelete: (): void => {},
};

const configs = [
  { props: defaultProps, desc: "should render category list" },
  {
    props: {
      ...defaultProps,
      paginatedData: [],
      totalCount: 0,
      isEmpty: true,
    },
    desc: "should render empty category list",
  },
];

it("should match MasterCategoryComponent snapshots", () => {
  test.assertSnapshots(MasterCategoryComponent, configs);
});
