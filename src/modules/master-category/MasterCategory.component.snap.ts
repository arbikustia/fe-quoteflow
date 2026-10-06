import test from "@/libs/unit-test";

import { MasterCategoryComponent } from "./MasterCategory.component";
import type { CategoryData } from "./MasterCategory.type";
import type { TableColumn } from "../../components/Table";

const mockCategories: CategoryData[] = [
  {
    id: "1",
    categoryName: "Audio System",
    status: "active",
    createAt: "2024-02-01",
    createBy: "Admin",
  },
];
const mockColumns: TableColumn<CategoryData>[] = [{ key: "categoryName", header: "Name" }];

const configs = [
  {
    props: {
      paginatedData: mockCategories,
      columns: mockColumns,
      currentPage: 1,
      totalPages: 1,
      pageSize: 5,
      totalCount: 1,
      goToPage: (): void => {},
      nextPage: (): void => {},
      prevPage: (): void => {},
      changePageSize: (): void => {},
      onCreate: (): void => {},
      onEdit: (): void => {},
      onRowClick: (): void => {},
      onBack: (): void => {},
      onMore: (): void => {},
      isMoreOpen: false,
      onCloseMore: (): void => {},
      onDelete: (): void => {},
    },
    desc: "Should Render MasterCategoryComponent with default props",
  },
  {
    props: {
      paginatedData: [] as CategoryData[],
      columns: [] as TableColumn<CategoryData>[],
      currentPage: 1,
      totalPages: 1,
      pageSize: 5,
      totalCount: 0,
      goToPage: (): void => {},
      nextPage: (): void => {},
      prevPage: (): void => {},
      changePageSize: (): void => {},
      onCreate: (): void => {},
      onEdit: (): void => {},
      onRowClick: (): void => {},
      onBack: (): void => {},
      isMoreOpen: false,
    },
    desc: "Should Render MasterCategoryComponent with empty data",
  },
];

it("MasterCategoryComponent matches snapshot", () => {
  test.assertSnapshots(MasterCategoryComponent, configs);
});
