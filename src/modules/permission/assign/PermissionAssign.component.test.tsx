import { fireEvent, render, screen } from "@/libs/unit-test";

import { PermissionAssignComponent } from "./PermissionAssign.component";
import type { PermissionAssignState } from "./PermissionAssign.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>);
jest.mock("@/app/shared/PageLayout", () => ({ PageLayout: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div> }));
jest.mock("@/components/Select/Select.component", () => ({ Select: (): React.ReactElement => <div data-testid="user-select" /> }));

const PROPS: PermissionAssignState = {
  username: "admin",
  userOptions: [{ label: "admin", value: "admin" }],
  isLoadingUsers: false,
  formPages: [
    { menu: "Dashboard", number: 1, page: "Dashboard", url: "/home", actions: ["view"], permission: [] },
    { menu: "Document", number: 2, page: "Quotation", url: "/quotation", actions: ["view", "create", "edit"], permission: ["view"] },
  ],
  isAllSelected: false,
  isPartiallySelected: true,
  isSubmitting: false,
  onSelectAllChange: jest.fn(),
  onRowSelectChange: jest.fn(),
  onPermissionChange: jest.fn(),
  onUserChange: jest.fn(),
  onUserSearch: jest.fn(),
  onSubmit: jest.fn().mockResolvedValue(undefined),
  onCancel: jest.fn(),
};

describe("PermissionAssignComponent", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render one checkbox per allowed action", () => {
    render(<PermissionAssignComponent {...PROPS} />);

    expect(screen.getByRole("checkbox", { name: "Dashboard view" })).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Dashboard create" })).toBeNull();
    expect(screen.getByRole("checkbox", { name: "Quotation view" })).toBeChecked();
  });

  it("should forward checkbox changes with the page url", () => {
    render(<PermissionAssignComponent {...PROPS} />);

    fireEvent.click(screen.getByRole("checkbox", { name: "Quotation edit" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all Quotation permissions" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all permissions" }));
    expect(PROPS.onPermissionChange).toHaveBeenCalledWith("/quotation", "edit", true);
    expect(PROPS.onRowSelectChange).toHaveBeenCalledWith("/quotation", true);
    expect(PROPS.onSelectAllChange).toHaveBeenCalledWith(true);
  });

  it("should save, cancel and show the save error", () => {
    render(<PermissionAssignComponent {...PROPS} formMessage="Unable to save permissions." />);

    fireEvent.click(screen.getByRole("button", { name: "Save Permission" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(PROPS.onSubmit).toHaveBeenCalled();
    expect(PROPS.onCancel).toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Unable to save permissions.");
  });

  it("should disable save while submitting", () => {
    render(<PermissionAssignComponent {...PROPS} isSubmitting={true} />);

    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  });
});
