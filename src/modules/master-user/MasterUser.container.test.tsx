import * as React from "react";

import test from "../../libs/unit-test";

import { getColumns } from "./MasterUser.columns";
import MasterUserContainer from "./MasterUser.container";
import type { UserData } from "./MasterUser.type";

jest.mock("./MasterUser.hook", () => ({
  useMasterUserContainerState: jest.fn(() => ({
    goBack: jest.fn(), goCreate: jest.fn(), goEdit: jest.fn(), goDetail: jest.fn(),
    pagination: {
      currentPage: 1, totalPages: 1, pageSize: 10, paginatedData: [], totalCount: 0,
      isEmpty: true, isLoading: false, isError: false, goToPage: jest.fn(), nextPage: jest.fn(),
      prevPage: jest.fn(), changePageSize: jest.fn(), setSearchTerm: jest.fn(),
    },
    isMoreOpen: false, toggleMore: jest.fn(), goDelete: jest.fn(), handleCloseMore: jest.fn(),
  })),
}));

jest.mock("./MasterUser.component", () => ({
  MasterUserComponent: (props: object) => React.createElement("div", { "data-testid": "master-user-component", "data-props": JSON.stringify(props) }),
}));

test.assertSnapshots(MasterUserContainer, [{ props: {}, desc: "default state" }]);

describe("getColumns", () => {
  const onEdit = jest.fn();
  const user: UserData = { id: "1", username: "admin1", email: null, role: "Admin", status: "active", createAt: "2024-01-01", createBy: "Admin" };

  it("returns expected columns", () => {
    const columns = getColumns({ currentPage: 1, pageSize: 5, onEdit });
    expect(columns.map((column) => column.key)).toEqual(["no", "username", "role", "status", "createAt", "actions"]);
  });

  it("renders configured column cells", () => {
    const columns = getColumns({ currentPage: 1, pageSize: 5, onEdit });
    columns.filter((column) => column.render).forEach((column) => {
      expect(column.render?.(user, 0)).toBeDefined();
    });
  });
});
