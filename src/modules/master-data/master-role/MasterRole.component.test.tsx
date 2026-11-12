import { fireEvent, render, screen } from "@/libs/unit-test";

import MasterRoleComponent from "./MasterRole.component";
import type { MasterRoleProps, RoleData } from "./MasterRole.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const ROLE: RoleData = {
  id: "role-1",
  name: "Administrator",
  status: "active",
  createdAt: "30 Oktober 2026 22:00",
};

/**
 * Build list view props.
 * @param {Partial<MasterRoleProps>} [overrides] - Props to override
 * @returns {MasterRoleProps} - Component props
 */
const createProps = (overrides?: Partial<MasterRoleProps>): MasterRoleProps => ({
  listStatus: "ready",
  roles: [ROLE],
  totalPages: 1,
  totalCount: 1,
  currentPage: 1,
  pageSize: 10,
  canCreate: true,
  canEdit: true,
  onPageChange: jest.fn(),
  onPageSizeChange: jest.fn(),
  onSearchChange: jest.fn(),
  onBack: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  ...overrides,
});

describe("MasterRoleComponent", () => {
  it("should render roles in the table and mobile cards", () => {
    render(<MasterRoleComponent {...createProps()} />);

    expect(screen.getAllByText("Administrator")).toHaveLength(2);
  });

  it("should open edit from a mobile card and the row action", () => {
    const props = createProps();

    render(<MasterRoleComponent {...props} />);
    fireEvent.click(screen.getAllByText("Administrator")[0].closest("button") as HTMLButtonElement);
    fireEvent.click(screen.getByRole("button", { name: "Edit role Administrator" }));

    expect(props.onEdit).toHaveBeenCalledTimes(2);
  });

  it("should call create and search handlers", () => {
    const props = createProps();

    render(<MasterRoleComponent {...props} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Create New" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Create Role" }));
    fireEvent.change(screen.getAllByPlaceholderText("Search role")[0], { target: { value: "admin" } });

    expect(props.onCreate).toHaveBeenCalledTimes(2);
    expect(props.onSearchChange).toHaveBeenCalledTimes(1);
  });

  it("should hide create and edit actions without permission", () => {
    render(<MasterRoleComponent {...createProps({ canCreate: false, canEdit: false })} />);

    expect(screen.queryByRole("button", { name: "Create New" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create Role" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit role Administrator" })).not.toBeInTheDocument();
    expect(screen.getAllByText("Administrator")[0].closest("button")).toBeDisabled();
  });

  it("should render matching table and card skeletons while loading", () => {
    render(<MasterRoleComponent {...createProps({ listStatus: "loading", roles: [] })} />);

    const tableSkeleton = screen.getByRole("status", { name: "Loading role table" });

    expect(tableSkeleton.querySelectorAll("th")).toHaveLength(5);
    expect(tableSkeleton.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(screen.getAllByRole("status", { name: "Loading role card" })).toHaveLength(5);
  });

  it.each([
    ["empty", "No roles found."],
    ["error", "Unable to load roles."],
    ["missing", "Role data is unavailable. Please try again."],
  ] as const)("should render the %s message in both layouts", (listStatus, message) => {
    render(<MasterRoleComponent {...createProps({ listStatus, roles: [] })} />);

    expect(screen.getAllByText(message)).toHaveLength(2);
  });

  it("should show the success toast passed from the form page", () => {
    render(<MasterRoleComponent {...createProps({ successMessage: "Role created successfully." })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Role created successfully.");
  });
});
