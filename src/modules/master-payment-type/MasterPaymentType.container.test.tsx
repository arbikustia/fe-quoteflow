import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import MasterPaymentTypeContainer from "./MasterPaymentType.container";
import { useMasterPaymentTypeNavigation } from "./MasterPaymentType.hook";

// Mock the hooks
jest.mock("./MasterPaymentType.hook", () => ({
  useMasterPaymentTypeNavigation: jest.fn(),
  useMasterPaymentTypeContainerState: jest.fn(() => ({
    pagination: {
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      paginatedData: [{ id: "1", name: "PT1", status: "active", createAt: "2024-01-01", createBy: "Admin" }],
      goToPage: jest.fn(),
      nextPage: jest.fn(),
      prevPage: jest.fn(),
      changePageSize: jest.fn(),
      totalCount: 1,
    },
    isMoreOpen: false,
    toggleMore: jest.fn(),
    goDelete: jest.fn(),
    handleCloseMore: jest.fn(),
  })),
}));

// Mock the component
jest.mock("./MasterPaymentType.component", () => ({
  MasterPaymentTypeComponent: (props: any) => <div data-testid="master-payment-type-component" data-props={JSON.stringify(props)} />,
}));

describe("MasterPaymentType Container", () => {
  it("should render component with correct props", () => {
    (useMasterPaymentTypeNavigation as any).mockReturnValue({
      goBack: jest.fn(),
      goCreate: jest.fn(),
      goEdit: jest.fn(),
      goDetail: jest.fn(),
    });

    const { getByTestId } = render(
      <BrowserRouter>
        <MasterPaymentTypeContainer />
      </BrowserRouter>
    );

    const component = getByTestId("master-payment-type-component");
    expect(component).toBeDefined();
  });
});
