import { render } from "@/libs/unit-test";
import { BrowserRouter } from "react-router-dom";

import MasterPaymentTypeContainer from "./MasterPaymentType.container";
import { useMasterPaymentTypeNavigation } from "./MasterPaymentType.hook";
import type { MasterPaymentTypeProps } from "./MasterPaymentType.type";

// Mock the hooks
jest.mock("./MasterPaymentType.hook", () => ({
  useMasterPaymentTypeNavigation: jest.fn(),
  useMasterPaymentTypeContainerState: jest.fn(() => ({
    goBack: jest.fn(),
    goCreate: jest.fn(),
    goEdit: jest.fn(),
    pagination: {
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      paginatedData: [{ id: "1", name: "PT1", status: "active", createAt: "2024-01-01", createBy: "Admin" }],
      isLoading: false,
      errorMessage: null,
      isMissingData: false,
      isEmpty: false,
      setSearchTerm: jest.fn(),
      goToPage: jest.fn(),
      nextPage: jest.fn(),
      prevPage: jest.fn(),
      changePageSize: jest.fn(),
      totalCount: 1,
    },
  })),
}));

// Mock the component
jest.mock("./MasterPaymentType.component", () => ({
  MasterPaymentTypeComponent: (props: MasterPaymentTypeProps) => <div data-testid="master-payment-type-component" data-props={JSON.stringify(props)} />,
}));

describe("MasterPaymentType Container", () => {
  it("should render component with correct props", () => {
    jest.mocked(useMasterPaymentTypeNavigation).mockReturnValue({
      goBack: jest.fn(),
      goCreate: jest.fn(),
      goEdit: jest.fn(),
    });

    const { getByTestId } = render(
      <BrowserRouter>
        <MasterPaymentTypeContainer />
      </BrowserRouter>
    );

    const component = getByTestId("master-payment-type-component");
    expect(component).toBeTruthy();
  });
});
