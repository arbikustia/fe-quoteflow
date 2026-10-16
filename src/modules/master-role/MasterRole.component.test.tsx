import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MasterRoleComponent } from "./MasterRole.component";
import type { MasterRoleProps, RoleData } from "./MasterRole.type";

jest.mock("../../components/Pagination", () => ({
  Pagination: () => <div data-testid="pagination" />,
}));

const mockRole: RoleData = {
  id: "1",
  roleName: "Admin",
  status: "active",
  createAt: "2024-01-01",
  createBy: "System",
};

const defaultProps: MasterRoleProps = {
  paginatedData: [mockRole],
  columns: [{ key: "roleName", header: "Role Name" }],
  currentPage: 1,
  totalPages: 2,
  pageSize: 10,
  totalCount: 15,
  isLoading: false,
  errorMessage: null,
  isEmpty: false,
  isMissingData: false,
  setSearchTerm: jest.fn(),
  goToPage: jest.fn(),
  nextPage: jest.fn(),
  prevPage: jest.fn(),
  changePageSize: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  onRowClick: jest.fn(),
  onBack: jest.fn(),
  onMore: jest.fn(),
  isMoreOpen: false,
  onCloseMore: jest.fn(),
  onDelete: jest.fn(),
};

describe("MasterRoleComponent", () => {
  const renderWithRouter = (props = defaultProps) => {
    return render(
      <MemoryRouter>
        <MasterRoleComponent {...props} />
      </MemoryRouter>
    );
  };

  it("should render without crashing", () => {
    renderWithRouter();
    expect(screen.getAllByText("Role List").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);
  });

  it("should handle empty data", () => {
    renderWithRouter({ ...defaultProps, paginatedData: [], isEmpty: true, totalCount: 0, totalPages: 1 });
    expect(screen.getAllByText("No roles found.").length).toBeGreaterThan(0);
  });



  it("matches snapshot", () => {
    const { asFragment } = renderWithRouter();
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with empty data and closed menu", () => {
    const { asFragment } = renderWithRouter({ ...defaultProps, paginatedData: [] as RoleData[], totalCount: 0, totalPages: 1, isMoreOpen: false });
    expect(asFragment()).toMatchSnapshot();
  });
});
