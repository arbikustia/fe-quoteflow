import { fireEvent, render, screen } from "@/libs/unit-test";

import { MasterRoleComponent } from "./MasterRole.component";
import { formatRoleDate } from "./MasterRole.helpers";
import type { MasterRoleProps, RoleData } from "./MasterRole.type";

jest.mock("../../app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

jest.mock("../../app/shared/PageLayout", () => ({
  PageLayout: ({ children, headerRight, onBack }: { children: React.ReactNode; headerRight: React.ReactNode; onBack: () => void }) => (
    <section>
      <button type="button" onClick={onBack}>Page Back</button>
      {headerRight}
      {children}
    </section>
  ),
}));

jest.mock("../../components/Pagination", () => ({
  Pagination: () => <div data-testid="pagination" />,
}));

jest.mock("../../components/Table", () => ({
  __esModule: true,
  default: ({ data, onRowClick }: { data: RoleData[]; onRowClick: (role: RoleData) => void }) => (
    <button type="button" onClick={() => onRowClick(data[0])}>Desktop role row</button>
  ),
}));

const mockRole: RoleData = {
  id: "1",
  roleName: "Admin",
  status: "active",
  createAt: "2024-01-01",
  createBy: "System",
};

const createProps = (overrides: Partial<MasterRoleProps> = {}): MasterRoleProps => ({
  paginatedData: [mockRole],
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
  ...overrides,
});

describe("MasterRoleComponent", () => {
  it("should format created date using Indonesian month and 24-hour time", () => {
    expect(formatRoleDate("2026-06-01T21:51:00")).toBe("01 Juni 2026 21:51");
    expect(formatRoleDate("invalid-date")).toBe("invalid-date");
  });

  it("should render role data and forward list actions", () => {
    const props = createProps();
    render(<MasterRoleComponent {...props} />);

    expect(screen.getByText("Admin")).toBeInTheDocument();
    fireEvent.change(screen.getAllByRole("searchbox", { name: "Search role" })[0], { target: { value: "admin" } });
    fireEvent.click(screen.getByText("Admin").closest("button")!);
    fireEvent.click(screen.getByRole("button", { name: "Desktop role row" }));
    fireEvent.click(screen.getByRole("button", { name: "Create Role" }));
    fireEvent.click(screen.getByRole("button", { name: "Page Back" }));

    expect(props.setSearchTerm).toHaveBeenCalledWith("admin");
    expect(props.onEdit).toHaveBeenCalledWith(mockRole);
    expect(props.onRowClick).toHaveBeenCalledWith(mockRole);
    expect(props.onCreate).toHaveBeenCalled();
    expect(props.onBack).toHaveBeenCalled();
  });

  it("should render loading skeletons when isLoading is true", () => {
    render(<MasterRoleComponent {...createProps({ isLoading: true })} />);

    expect(screen.getByRole("status", { name: "Loading cards" })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it.each([
    [{ isMissingData: true }, "Role data is unavailable. Please try again."],
    [{ errorMessage: "Unable to load roles." }, "Unable to load roles."],
    [{ isEmpty: true, paginatedData: [] }, "No roles found."],
  ])("should render list state", (overrides, message) => {
    render(<MasterRoleComponent {...createProps(overrides)} />);

    expect(screen.getAllByText(message)).toHaveLength(2);
  });

  it("should match role list snapshot", () => {
    const { asFragment } = render(<MasterRoleComponent {...createProps()} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
