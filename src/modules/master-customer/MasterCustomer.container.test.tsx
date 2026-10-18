import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

import MasterCustomerContainer from "./MasterCustomer.container";
import * as hooks from "./MasterCustomer.hook";

jest.mock("./MasterCustomer.hook", () => ({
  useMasterCustomerNavigation: jest.fn(),
  useMasterCustomerContainerState: jest.fn(),
}));

jest.mock("./MasterCustomer.component", () => ({
  MasterCustomerComponent: (props: { readonly currentPage: number }) => (
    <div data-testid="mock-component" data-page={props.currentPage} />
  ),
}));

describe("MasterCustomer Container", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render component with hook state and columns", () => {
    jest.mocked(hooks.useMasterCustomerNavigation).mockReturnValue({
      goBack: jest.fn(),
      goCreate: jest.fn(),
      goEdit: jest.fn(),
      goDetail: jest.fn(),
    });

    jest.mocked(hooks.useMasterCustomerContainerState).mockReturnValue({
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
        <MasterCustomerContainer />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("mock-component")).toBeTruthy();
  });
});
