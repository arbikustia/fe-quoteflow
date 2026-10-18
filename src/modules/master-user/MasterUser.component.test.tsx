import * as React from "react";

import test from "../../libs/unit-test";

import { MasterUserComponent } from "./MasterUser.component";
import type { MasterUserProps, UserData } from "./MasterUser.type";

jest.mock("../../app/layout", () =>
  ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
);

jest.mock("../../app/shared/PageLayout", () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="page-layout">{children}</div>,
}));

jest.mock("../../components/Pagination", () => ({
  Pagination: () => <div data-testid="pagination" />,
}));

jest.mock("../../components/SearchFilter", () => ({
  SearchFilter: () => <input data-testid="search-filter" />,
}));

jest.mock("../../components/Table", () => () => <div data-testid="table" />);

const users: UserData[] = [
  { id: "1", username: "admin1", email: null, role: "Admin", status: "active", createAt: "2024-01-01", createBy: "Admin" },
];

const props: MasterUserProps = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  paginatedData: users,
  totalCount: 1,
  columns: [],
  isEmpty: false,
  isLoading: false,
  isError: false,
  goToPage: jest.fn(),
  nextPage: jest.fn(),
  prevPage: jest.fn(),
  changePageSize: jest.fn(),
  setSearchTerm: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  onRowClick: jest.fn(),
  onBack: jest.fn(),
};

test.assertSnapshots(MasterUserComponent, [
  { props, desc: "default state" },
  { props: { ...props, paginatedData: [], isEmpty: true }, desc: "empty state" },
]);
