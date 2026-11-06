import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

import MasterOrderTypeContainer from "./MasterOrderType.container";
import * as hooks from "./MasterOrderType.hook";

jest.mock("./MasterOrderType.hook", () => ({
  useMasterOrderTypeNavigation: jest.fn(),
  useMasterOrderTypeContainerState: jest.fn(),
}));

jest.mock("./MasterOrderType.component", () => ({
  MasterOrderTypeComponent: (props: { currentPage: number }) => (
    <div data-testid="mock-component" data-page={props.currentPage} />
  ),
}));

describe("MasterOrderType Container", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render component with hook state", () => {
    jest.mocked(hooks.useMasterOrderTypeNavigation).mockReturnValue({
      goBack: jest.fn(),
      goCreate: jest.fn(),
      goEdit: jest.fn(),
    });

    jest.mocked(hooks.useMasterOrderTypeContainerState).mockReturnValue({
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
      goDelete: jest.fn(),
    });

    render(
      <BrowserRouter>
        <MasterOrderTypeContainer />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("mock-component")).toBeTruthy();
    expect(screen.getByTestId("mock-component").getAttribute("data-page")).toBe("1");
  });
});
