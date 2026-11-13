import test from "@/libs/unit-test";

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

describe("PermissionAssignComponent snapshot", () => {
  test.assertSnapshots(PermissionAssignComponent, [
    { props: PROPS, desc: "should render the permission matrix" },
    { props: { ...PROPS, isSubmitting: true, formMessage: "Unable to save permissions." }, desc: "should render the saving state with an error" },
  ]);
});
