import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import MasterPaymentTypeContainer from "./MasterPaymentType.container";
import { useMasterPaymentTypeNavigation } from "./MasterPaymentType.hook";

// Mock the hooks
vi.mock("./MasterPaymentType.hook", () => ({
  useMasterPaymentTypeNavigation: vi.fn(),
  useMasterPaymentTypeContainerState: vi.fn(() => ({
    pagination: {
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      paginatedData: [{ id: "1", name: "PT1", status: "active", createAt: "2024-01-01", createBy: "Admin" }],
      goToPage: vi.fn(),
      nextPage: vi.fn(),
      prevPage: vi.fn(),
      changePageSize: vi.fn(),
      totalCount: 1,
    },
    isMoreOpen: false,
    toggleMore: vi.fn(),
    goDelete: vi.fn(),
    handleCloseMore: vi.fn(),
  })),
}));

// Mock the component
vi.mock("./MasterPaymentType.component", () => ({
  MasterPaymentTypeComponent: (props: any) => <div data-testid="master-payment-type-component" data-props={JSON.stringify(props)} />,
}));

describe("MasterPaymentType Container", () => {
  it("should render component with correct props", () => {
    (useMasterPaymentTypeNavigation as any).mockReturnValue({
      goBack: vi.fn(),
      goCreate: vi.fn(),
      goEdit: vi.fn(),
      goDetail: vi.fn(),
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
