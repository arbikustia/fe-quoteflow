import test from "@/libs/unit-test";

import MasterUserCreateComponent from "./MasterUserCreate.component";
import type { MasterUserCreateProps } from "./MasterUserCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterUserCreateProps = {
  mode: "create",
  formStatus: "ready",
  values: { username: "arbikustia14", email: "arbi@example.com", password: "secret", role: "Administrator", isActive: true },
  fieldErrors: {},
  isSubmitting: false,
  isPasswordVisible: false,
  roleOptions: [{ label: "Administrator", value: "Administrator" }],
  isRoleOptionsLoading: false,
  onUsernameChange: jest.fn(),
  onEmailChange: jest.fn(),
  onPasswordChange: jest.fn(),
  onTogglePasswordVisibility: jest.fn(),
  onRoleChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
};

describe("MasterUserCreateComponent Snapshot Test", () => {
  test.assertSnapshots(MasterUserCreateComponent, [
    { desc: "should render user create form", props },
    { desc: "should render user create form while submitting", props: { ...props, isSubmitting: true } },
    { desc: "should render user edit form with errors", props: { ...props, mode: "edit", fieldErrors: { username: "Username is required.", email: "Invalid email address." } } },
    { desc: "should render error message in edit mode", props: { ...props, mode: "edit", formStatus: "error" } },
    { desc: "should render visible password and loading roles", props: { ...props, isPasswordVisible: true, isRoleOptionsLoading: true } },
  ]);
});
