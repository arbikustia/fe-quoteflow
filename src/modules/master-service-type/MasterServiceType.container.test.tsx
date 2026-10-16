import { render } from "@testing-library/react";
import MasterServiceTypeContainer from "./MasterServiceType.container";
import * as Hook from "./MasterServiceType.hook";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn().mockReturnValue({ pathname: "/master-service-type" }),
  Link: ({ children }: any) => <a>{children}</a>,
}));

describe("MasterServiceType.container", () => {
  it("should match snapshot", () => {
    jest.spyOn(Hook, "useMasterServiceTypeContainerState").mockReturnValue({
      pagination: {
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        paginatedData: [],
        goToPage: jest.fn(),
        nextPage: jest.fn(),
        prevPage: jest.fn(),
        changePageSize: jest.fn(),
        setSearchTerm: jest.fn(),
        totalCount: 0,
        isLoading: false,
        errorMessage: null,
        isEmpty: true,
        isMissingData: false,
      },
      isMoreOpen: false,
      toggleMore: jest.fn(),
      goDelete: jest.fn(),
      handleCloseMore: jest.fn(),
      goBack: jest.fn(),
      goCreate: jest.fn(),
      goEdit: jest.fn(),
      goDetail: jest.fn(),
    });

    const { container } = render(<MasterServiceTypeContainer />);
    
    // We cannot use test.assertSnapshots here because it expects a component type and configs.
    // For container, we can just do traditional snapshot test.
    expect(container).toMatchSnapshot();
  });
});
