import React from "react";

import test from "@/libs/unit-test";

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-18T01:01:00+07:00"));

afterAll(() => jest.useRealTimers());

import { MasterCategoryComponent } from "./MasterCategory.component";
import type { CategoryData, MasterCategoryProps } from "./MasterCategory.type";

jest.mock("../../../app/layout", () => ({
  __esModule: true,
  /**
   * Render mock layout wrapper.
   *
   * @param {React.PropsWithChildren} props - Layout props
   * @returns {React.ReactElement} Layout wrapper
   */
  default: ({ children }: React.PropsWithChildren): React.ReactElement =>
    React.createElement("div", {}, children),
}));

const mockCategories: CategoryData[] = [
  {
    id: "1",
    categoryName: "Audio System",
    status: "active",
    createAt: "2024-02-01",
    createBy: "Admin",
  },
];

/** No-op handler used by mock props. */
const noop = (): void => {};

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
  goToPage: noop,
  nextPage: noop,
  prevPage: noop,
  changePageSize: noop,
  setSearchTerm: noop,
  onCreate: noop,
  onEdit: noop,
  onBack: noop,
  onMore: noop,
  onCloseMore: noop,
  onDelete: noop,
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
