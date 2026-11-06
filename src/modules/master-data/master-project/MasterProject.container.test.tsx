import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@/libs/unit-test";
import { BrowserRouter } from "react-router-dom";

import MasterProjectContainer from "./MasterProject.container";
import * as hooks from "./MasterProject.hook";

jest.mock("./MasterProject.hook", () => ({
  useMasterProjectContainerState: jest.fn(),
}));

jest.mock("./MasterProject.component", () => ({
  MasterProjectComponent: (props: { currentPage: number }) => (
    <div data-page={props.currentPage} data-testid="mock-component" />
  ),
}));

const mockState = {
  pagination: {
    currentPage: 1,
    totalPages: 2,
    pageSize: 10,
    paginatedData: [],
    totalCount: 0,
    isLoading: false,
    errorMessage: null,
    isEmpty: true,
    isMissingData: false,
    goToPage: jest.fn(),
    nextPage: jest.fn(),
    prevPage: jest.fn(),
    changePageSize: jest.fn(),
    setSearchTerm: jest.fn(),
  },
  isMoreOpen: false,
  toggleMore: jest.fn(),
  handleCloseMore: jest.fn(),
  goBack: jest.fn(),
  goCreate: jest.fn(),
  goEdit: jest.fn(),
  goDetail: jest.fn(),
  goDelete: jest.fn(),
};

describe("MasterProjectContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(hooks.useMasterProjectContainerState).mockReturnValue(mockState);
  });

  it("should render component with hook state", () => {
    render(
      <BrowserRouter>
        <MasterProjectContainer />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("mock-component").getAttribute("data-page")).toBe("1");
  });
});
