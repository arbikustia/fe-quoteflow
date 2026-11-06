import { render } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import MasterPaymentMethodContainer from "./MasterPaymentMethod.container";
import { useMasterPaymentMethodContainerState } from "./MasterPaymentMethod.hook";
import type { MasterPaymentMethodProps } from "./MasterPaymentMethod.type";

jest.mock("./MasterPaymentMethod.component", () => ({
  MasterPaymentMethodComponent: (props: MasterPaymentMethodProps) => <div data-testid="component">{JSON.stringify(props)}</div>,
}));

jest.mock("./MasterPaymentMethod.hook", () => ({ useMasterPaymentMethodContainerState: jest.fn() }));

describe("MasterPaymentMethod.container", () => {
  it("should render correctly", () => {
    jest.mocked(useMasterPaymentMethodContainerState).mockReturnValue({
      goBack: jest.fn(),
      goCreate: jest.fn(),
      goEdit: jest.fn(),
      pagination: {
        paginatedData: [],
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        totalCount: 0,
        isLoading: false,
        errorMessage: null,
        isMissingData: false,
        isEmpty: false,
        setSearchTerm: jest.fn(),
        goToPage: jest.fn(),
        nextPage: jest.fn(),
        prevPage: jest.fn(),
        changePageSize: jest.fn(),
      },
      isMoreOpen: false,
      toggleMore: jest.fn(),
      goDelete: jest.fn(),
      handleCloseMore: jest.fn(),
    });

    const { getByTestId } = render(<MemoryRouter><MasterPaymentMethodContainer /></MemoryRouter>);
    expect(getByTestId("component")).toBeTruthy();
  });
});
