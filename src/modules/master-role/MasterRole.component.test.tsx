import { render, screen, fireEvent } from "@testing-library/react";
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
    renderWithRouter({ ...defaultProps, paginatedData: [], totalCount: 0, totalPages: 1 });
    expect(screen.getAllByText("No data available").length).toBeGreaterThan(0);
  });

  it("should handle isMoreOpen true", () => {
    renderWithRouter({ ...defaultProps, isMoreOpen: true });
    expect(screen.getByText("New Role")).toBeTruthy();
    expect(screen.getByText("Delete")).toBeTruthy();
  });

  it("calls onBack when back button clicked", () => {
    const onBack = jest.fn();
    renderWithRouter({ ...defaultProps, onBack });
    const backBtn = screen.getByLabelText("Back");
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onMore when more button clicked", () => {
    const onMore = jest.fn();
    renderWithRouter({ ...defaultProps, onMore });
    const moreBtn = screen.getByLabelText("More options");
    fireEvent.click(moreBtn);
    expect(onMore).toHaveBeenCalledTimes(1);
  });

  it("calls onCreate when New Role clicked", () => {
    const onCreate = jest.fn();
    renderWithRouter({ ...defaultProps, isMoreOpen: true, onCreate });
    fireEvent.click(screen.getByText("New Role"));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when Delete clicked", () => {
    const onDelete = jest.fn();
    renderWithRouter({ ...defaultProps, isMoreOpen: true, onDelete });
    fireEvent.click(screen.getByText("Delete"));
    expect(onDelete).toHaveBeenCalledTimes(1);
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
