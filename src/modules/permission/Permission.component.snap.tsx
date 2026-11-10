import { render } from "@/libs/unit-test";

import { PermissionComponent } from "./Permission.component";
import type { PermissionState } from "./Permission.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock("@/app/shared/PageLayout", () => ({ PageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
jest.mock("@/components/Select/Select.component", () => ({ Select: () => <div data-testid="user-select" /> }));

const props: PermissionState = {
  selectedUsername: "admin",
  userOptions: [{ label: "admin", value: "admin" }],
  rows: [{ id: "Document-/quotation-Quotation", menu: "Document", page: "Quotation", url: "/quotation", permission: ["view"] }],
  formPages: [],
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
};

describe("PermissionComponent snapshot", () => {
  it("should match permission list", () => {
    const { asFragment } = render(<PermissionComponent {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
