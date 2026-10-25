import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import MasterCategoryContainer from "./MasterCategory.container";
import * as hooks from "./MasterCategory.hook";

jest.mock("./MasterCategory.hook", () => ({
  useMasterCategoryNavigation: jest.fn(),
  useMasterCategoryContainerState: jest.fn(),
}));

jest.mock("./MasterCategory.component", () => ({
  MasterCategoryComponent: (props: { currentPage: number }) => (
    <div data-testid="mock-component" data-page={props.currentPage} />
  ),
}));

describe("MasterCategory Container", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render component with hook state and columns", () => {
    jest.mocked(hooks.useMasterCategoryNavigation).mockReturnValue({
      goBack: jest.fn(),
      goCreate: jest.fn(),
      goEdit: jest.fn(),
      goDetail: jest.fn(),
    });

    jest.mocked(hooks.useMasterCategoryContainerState).mockReturnValue({
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
        <MasterCategoryContainer />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("mock-component")).toBeTruthy();
  });
});
