import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@/libs/unit-test";
import { BrowserRouter } from "react-router-dom";
import MasterCustomerContainer from "./MasterCustomer.container";
import * as hooks from "./MasterCustomer.hook";

jest.mock("@/hooks/usePagePermission", () => ({
  usePagePermission: () => ({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false }),
}));

jest.mock("./MasterCustomer.hook", () => ({
  useMasterCustomerNavigation: jest.fn(),
  useMasterCustomerPagination: jest.fn(),
}));

jest.mock("./MasterCustomer.component", () => ({
  MasterCustomerComponent: (props: { totalCount: number }) => (
    <div data-testid="mock-component" data-count={props.totalCount} />
  ),
}));

describe("MasterCustomer Container", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render component with hook state", () => {
    jest.mocked(hooks.useMasterCustomerNavigation).mockReturnValue({
      goBack: jest.fn(),
      goCreate: jest.fn(),
      goEdit: jest.fn(),
    });

    jest.mocked(hooks.useMasterCustomerPagination).mockReturnValue({
      currentPage: 1,
      totalPages: 2,
      pageSize: 10,
      paginatedData: [],
      totalCount: 5,
      isLoading: false,
      errorMessage: undefined,
      isEmpty: false,
      isMissingData: false,
      goToPage: jest.fn(),
      changePageSize: jest.fn(),
      setSearchTerm: jest.fn(),
    });

    render(
      <BrowserRouter>
        <MasterCustomerContainer />
      </BrowserRouter>
    );

    expect(screen.getByTestId("mock-component").getAttribute("data-count")).toBe("5");
  });
});
