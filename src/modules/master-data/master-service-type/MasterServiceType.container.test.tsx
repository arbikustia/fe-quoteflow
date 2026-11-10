import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MasterServiceTypeContainer from "./MasterServiceType.container";
import * as Hook from "./MasterServiceType.hook";

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-25T08:41:24+07:00"));
afterAll(() => jest.useRealTimers());

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn().mockReturnValue({ pathname: "/master-service-type" }),
  Link: ({ children }: any) => <a>{children}</a>,
}));

jest.mock("@/hooks/usePagePermission", () => ({
  usePagePermission: jest.fn().mockReturnValue({ canView: true, canCreate: true, canEdit: false, isSuperadmin: false }),
}));

jest.mock("./MasterServiceType.component", () => ({
  MasterServiceTypeComponent: ({ onCreate, onEdit, onRowClick }: any) => (
    <div data-testid="component" data-create={!!onCreate} data-edit={!!onEdit} data-detail={!!onRowClick} />
  ),
}));

describe("MasterServiceType.container", () => {
  it("should render component with permissions", () => {
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

    render(<MasterServiceTypeContainer />);
    const comp = screen.getByTestId("component");
    expect(comp.getAttribute("data-create")).toBe("true");
    expect(comp.getAttribute("data-edit")).toBe("false");
  });
});
