import { render, screen } from "@/libs/unit-test";

import { PermissionComponent } from "./Permission.component";
import type { PermissionState } from "./Permission.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock("@/app/shared/PageLayout", () => ({ PageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
jest.mock("@/components/Select/Select.component", () => ({ Select: () => <div data-testid="user-select" /> }));

const createProps = (): PermissionState => ({
  selectedUsername: "admin",
  userOptions: [{ label: "admin", value: "admin" }],
  rows: [{ id: "Document-/quotation-Quotation", menu: "Document", page: "Quotation", url: "/quotation", permission: ["view", "create"] }],
  formPages: [{ menu: "Document", number: 2, page: "Quotation", url: "/document/quotation", permission: ["view"] }],
  isFormOpen: false,
  isLoadingUsers: false,
  isLoadingPermission: false,
  isSubmitting: false,
  isEmpty: false,
  searchTerm: "",
  onUsernameChange: jest.fn(),
  onUserSearch: jest.fn(),
  onSearchChange: jest.fn(),
  onOpenForm: jest.fn(),
  onCloseForm: jest.fn(),
  onPermissionChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
});

describe("PermissionComponent", () => {
  it("should render permission response columns", () => {
    render(<PermissionComponent {...createProps()} />);

    expect(screen.getByText("Menu")).toBeInTheDocument();
    expect(screen.getByText("Page")).toBeInTheDocument();
    expect(screen.getByText("URL")).toBeInTheDocument();
    expect(screen.getByText("Permission")).toBeInTheDocument();
    expect(screen.getByText("Document")).toBeInTheDocument();
    expect(screen.getByText("Quotation")).toBeInTheDocument();
    expect(screen.getByText("/quotation")).toBeInTheDocument();
    expect(screen.getByText("view")).toBeInTheDocument();
    expect(screen.getByText("create")).toBeInTheDocument();
  });

  it("should request user selection before fetching data", () => {
    render(<PermissionComponent {...createProps()} selectedUsername="" rows={[]} />);

    expect(screen.getByText("Select a user to view permissions.")).toBeInTheDocument();
  });

  it("should render assign permission trigger", () => {
    render(<PermissionComponent {...createProps()} />);

    expect(screen.getByRole("button", { name: "Assign Permission" })).toBeInTheDocument();
  });
});
