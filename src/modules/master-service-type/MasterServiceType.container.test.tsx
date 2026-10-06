import { render } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import MasterServiceTypeContainer from "./MasterServiceType.container";
import * as Hook from "./MasterServiceType.hook";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn().mockReturnValue({ pathname: "/master-service-type" }),
  Link: ({ children }: any) => <a>{children}</a>,
}));

describe("MasterServiceType.container", () => {
  it("should match snapshot", () => {
    vi.spyOn(Hook, "useMasterServiceTypeContainerState").mockReturnValue({
      pagination: {
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        paginatedData: [],
        goToPage: vi.fn(),
        nextPage: vi.fn(),
        prevPage: vi.fn(),
        changePageSize: vi.fn(),
        totalCount: 0,
      },
      isMoreOpen: false,
      toggleMore: vi.fn(),
      goDelete: vi.fn(),
      handleCloseMore: vi.fn(),
      goBack: vi.fn(),
      goCreate: vi.fn(),
      goEdit: vi.fn(),
      goDetail: vi.fn(),
    });

    const { container } = render(<MasterServiceTypeContainer />);
    
    // We cannot use test.assertSnapshots here because it expects a component type and configs.
    // For container, we can just do traditional snapshot test.
    expect(container).toMatchSnapshot();
  });
});
