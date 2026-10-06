import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import MasterPaymentMethodContainer from "./MasterPaymentMethod.container";
import { useMasterPaymentMethodContainerState, useMasterPaymentMethodNavigation } from "./MasterPaymentMethod.hook";

vi.mock("./MasterPaymentMethod.component", () => ({
  MasterPaymentMethodComponent: (props: any) => <div data-testid="component">{JSON.stringify(props)}</div>,
}));

vi.mock("./MasterPaymentMethod.hook", () => ({
  useMasterPaymentMethodContainerState: vi.fn(),
  useMasterPaymentMethodNavigation: vi.fn(),
}));

describe("MasterPaymentMethod.container", () => {
  it("should render correctly", () => {
    vi.mocked(useMasterPaymentMethodNavigation).mockReturnValue({
      goBack: vi.fn(),
      goCreate: vi.fn(),
      goEdit: vi.fn(),
      goDetail: vi.fn(),
    });

    vi.mocked(useMasterPaymentMethodContainerState).mockReturnValue({
      pagination: {
        paginatedData: [],
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        totalCount: 0,
        goToPage: vi.fn(),
        nextPage: vi.fn(),
        prevPage: vi.fn(),
        changePageSize: vi.fn(),
      },
      isMoreOpen: false,
      toggleMore: vi.fn(),
      goDelete: vi.fn(),
      handleCloseMore: vi.fn(),
    });

    const { getByTestId } = render(<MasterPaymentMethodContainer />);
    expect(getByTestId("component")).toBeInTheDocument();
  });
});
