import { MOCK_PERMISSION_PROPS } from "@/fixture/permission";
import { fireEvent, render, screen } from "@/libs/unit-test";

import { PermissionComponent } from "./Permission.component";
import type { PermissionState } from "./Permission.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock("@/app/shared/PageLayout", () => ({ PageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
jest.mock("@/components/Select/Select.component", () => ({ Select: () => <div data-testid="user-select" /> }));

const createProps = (): PermissionState => ({ ...MOCK_PERMISSION_PROPS });

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

  it("should open the assign page when the trigger is clicked", () => {
    const props = createProps();

    render(<PermissionComponent {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Assign Permission" }));
    expect(props.onOpenForm).toHaveBeenCalled();
  });

  it("should forward the permission search term", () => {
    const props = createProps();

    render(<PermissionComponent {...props} />);
    fireEvent.change(screen.getByPlaceholderText("Search permission"), { target: { value: "quo" } });
    expect(props.onSearchChange).toHaveBeenCalledWith("quo");
  });

  it("should render loading, error, empty and saved states", () => {
    const { rerender } = render(<PermissionComponent {...createProps()} isLoadingPermission={true} />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading permissions…");
    rerender(<PermissionComponent {...createProps()} errorMessage="Unable to load permissions." />);
    expect(screen.getByRole("alert")).toHaveTextContent("Unable to load permissions.");
    rerender(<PermissionComponent {...createProps()} rows={[]} isEmpty={true} />);
    expect(screen.getByText("No permissions found.")).toBeInTheDocument();
    rerender(<PermissionComponent {...createProps()} formMessage="Permissions saved successfully." />);
    expect(screen.getByText("Permissions saved successfully.")).toBeInTheDocument();
  });
});
