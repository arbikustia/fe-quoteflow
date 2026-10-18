import { render } from "@testing-library/react";
import MasterPaymentMethodContainer from "./MasterPaymentMethod.container";
import { useMasterPaymentMethodContainerState, useMasterPaymentMethodNavigation } from "./MasterPaymentMethod.hook";

jest.mock("./MasterPaymentMethod.component", () => ({
  MasterPaymentMethodComponent: (props: any) => <div data-testid="component">{JSON.stringify(props)}</div>,
}));

jest.mock("./MasterPaymentMethod.hook", () => ({
  useMasterPaymentMethodContainerState: jest.fn(),
  useMasterPaymentMethodNavigation: jest.fn(),
}));

describe("MasterPaymentMethod.container", () => {
  it("should render correctly", () => {
    jest.mocked(useMasterPaymentMethodNavigation).mockReturnValue({
      goBack: jest.fn(),
      goCreate: jest.fn(),
      goEdit: jest.fn(),
      goDetail: jest.fn(),
    });

    jest.mocked(useMasterPaymentMethodContainerState).mockReturnValue({
      goBack: jest.fn(),
      goCreate: jest.fn(),
      goEdit: jest.fn(),
      goDetail: jest.fn(),
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

    const { getByTestId } = render(<MasterPaymentMethodContainer />);
    expect(getByTestId("component")).toBeTruthy();
  });
});
