import * as React from "react";

import test from "../../libs/unit-test";

import MasterUserContainer from "./MasterUser.container";

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

