import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MasterUserComponent } from "./MasterUser.component";
import type { UserData } from "./MasterUser.type";

const mockUsers: UserData[] = [
  { id: "1", username: "admin1", role: "Admin", status: "active", createAt: "2024-01-01", createBy: "Admin" },
  { id: "2", username: "user1", role: "User", status: "inactive", createAt: "2024-01-02", createBy: "Admin" },
];

const mockColumns: any[] = [{ key: "username", header: "Username" }];

const defaultProps = {
  paginatedData: mockUsers,
  columns: mockColumns,
  currentPage: 1,
  totalPages: 2,
  pageSize: 5,
  totalCount: 10,
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

const renderWithRouter = (props = defaultProps) =>
  render(
    <MemoryRouter>
      <MasterUserComponent {...props} />
    </MemoryRouter>
  );

describe("MasterUserComponent", () => {
  it("should render without crashing", () => {
    renderWithRouter();
    expect(screen.getAllByText("User List").length).toBeGreaterThan(0);
  });

  it("should handle empty data", () => {
    renderWithRouter({ ...defaultProps, paginatedData: [] as UserData[], totalCount: 0, totalPages: 1 });
    expect(screen.getAllByText("User List").length).toBeGreaterThan(0);
  });

  it("should handle isMoreOpen true", () => {
    renderWithRouter({ ...defaultProps, isMoreOpen: true });
    expect(screen.getByText("New User")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onBack when back button clicked", () => {
    const onBack = jest.fn();
    renderWithRouter({ ...defaultProps, onBack });
    fireEvent.click(screen.getByLabelText("Back"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onMore when more button clicked", () => {
    const onMore = jest.fn();
    renderWithRouter({ ...defaultProps, onMore });
    fireEvent.click(screen.getByLabelText("More options"));
    expect(onMore).toHaveBeenCalledTimes(1);
  });

  it("calls onCreate when New User clicked", () => {
    const onCreate = jest.fn();
    renderWithRouter({ ...defaultProps, isMoreOpen: true, onCreate });
    fireEvent.click(screen.getByText("New User"));
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
    const { asFragment } = renderWithRouter({ ...defaultProps, paginatedData: [] as UserData[], totalCount: 0, totalPages: 1, isMoreOpen: false });
    expect(asFragment()).toMatchSnapshot();
  });
});
