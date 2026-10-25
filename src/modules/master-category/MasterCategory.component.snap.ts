import test from "@/libs/unit-test";

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-18T01:01:00+07:00"));

afterAll(() => jest.useRealTimers());

import { MasterCategoryComponent } from "./MasterCategory.component";
import type { CategoryData, MasterCategoryProps } from "./MasterCategory.type";

const mockCategories: CategoryData[] = [{ id: "1", categoryName: "Audio System", status: "active", createAt: "2024-02-01", createBy: "Admin" }];
const defaultProps: MasterCategoryProps = {
  paginatedData: mockCategories,
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
