import * as React from "react";

import test from "../../libs/unit-test";

import MasterPicContainer from "./MasterPic.container";

jest.mock("./MasterPic.hook", () => ({
  useMasterPicNavigation: jest.fn(() => ({ goBack: jest.fn(), goCreate: jest.fn(), goEdit: jest.fn(), goDetail: jest.fn() })),
  useMasterPicContainerState: jest.fn(() => ({
    pagination: {
      currentPage: 1, totalPages: 1, pageSize: 10, paginatedData: [], totalCount: 0,
      isEmpty: true, isLoading: false, isError: false, goToPage: jest.fn(), nextPage: jest.fn(),
      prevPage: jest.fn(), changePageSize: jest.fn(), setSearchTerm: jest.fn(),
    },
    isMoreOpen: false, toggleMore: jest.fn(), goDelete: jest.fn(), handleCloseMore: jest.fn(),
  })),
}));

jest.mock("./MasterPic.component", () => ({
  MasterPicComponent: (props: object) => React.createElement("div", { "data-testid": "master-pic-component", "data-props": JSON.stringify(props) }),
}));

test.assertSnapshots(MasterPicContainer, [{ props: {}, desc: "default state" }]);
