import { fireEvent, render, screen } from "@/libs/unit-test";

import MasterUserComponent from "./MasterUser.component";
import type { MasterUserProps, UserData } from "./MasterUser.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const USER: UserData = {
  id: "user-1",
  username: "arbikustia14",
  email: "arbi@example.com",
  role: "Administrator",
  status: "active",
  createdAt: "30 Oktober 2026 22:00",
};

/**
 * Build list view props.
 * @param {Partial<MasterUserProps>} [overrides] - Props to override
 * @returns {MasterUserProps} - Component props
 */
const createProps = (overrides?: Partial<MasterUserProps>): MasterUserProps => ({
  listStatus: "ready",
  users: [USER],
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

describe("MasterUserComponent", () => {
  it("should render users in the table and mobile cards", () => {
    render(<MasterUserComponent {...createProps()} />);

    expect(screen.getAllByText("arbikustia14")).toHaveLength(2);
  });

  it("should open edit from a mobile card and the row action", () => {
    const props = createProps();

    render(<MasterUserComponent {...props} />);
    fireEvent.click(screen.getAllByText("arbikustia14")[0].closest("button") as HTMLButtonElement);
    fireEvent.click(screen.getByRole("button", { name: "Edit user arbikustia14" }));

    expect(props.onEdit).toHaveBeenCalledTimes(2);
  });

  it("should call create and search handlers", () => {
    const props = createProps();

    render(<MasterUserComponent {...props} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Create New" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Create User" }));
    fireEvent.change(screen.getAllByPlaceholderText("Search user")[0], { target: { value: "admin" } });

    expect(props.onCreate).toHaveBeenCalledTimes(2);
    expect(props.onSearchChange).toHaveBeenCalledTimes(1);
  });

  it("should hide create and edit actions without permission", () => {
    render(<MasterUserComponent {...createProps({ canCreate: false, canEdit: false })} />);

    expect(screen.queryByRole("button", { name: "Create New" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create User" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit user arbikustia14" })).not.toBeInTheDocument();
    expect(screen.getAllByText("arbikustia14")[0].closest("button")).toBeDisabled();
  });

  it("should render matching table and card skeletons while loading", () => {
    render(<MasterUserComponent {...createProps({ listStatus: "loading", users: [] })} />);

    const tableSkeleton = screen.getByRole("status", { name: "Loading user table" });

    expect(tableSkeleton.querySelectorAll("th")).toHaveLength(7);
    expect(tableSkeleton.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(screen.getAllByRole("status", { name: "Loading user card" })).toHaveLength(5);
  });

  it.each([
    ["empty", "No users found."],
    ["error", "Unable to load users."],
    ["missing", "User data is unavailable. Please try again."],
  ] as const)("should render the %s message in both layouts", (listStatus, message) => {
    render(<MasterUserComponent {...createProps({ listStatus, users: [] })} />);

    expect(screen.getAllByText(message)).toHaveLength(2);
  });

  it("should show the success toast passed from the form page", () => {
    render(<MasterUserComponent {...createProps({ successMessage: "User created successfully." })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("User created successfully.");
  });
});
