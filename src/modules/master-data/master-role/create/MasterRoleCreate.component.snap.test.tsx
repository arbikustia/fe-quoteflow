import test from "@/libs/unit-test";

import MasterRoleCreateComponent from "./MasterRoleCreate.component";
import type { MasterRoleCreateProps } from "./MasterRoleCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterRoleCreateProps = {
  mode: "create",
  formStatus: "ready",
  values: { name: "Administrator", isActive: true },
  fieldErrors: {},
  isSubmitting: false,
  onNameChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
};

describe("MasterRoleCreateComponent Snapshot Test", () => {
  test.assertSnapshots(MasterRoleCreateComponent, [
    { desc: "should render role create form", props },
    { desc: "should render role create form while submitting", props: { ...props, isSubmitting: true } },
    { desc: "should render role edit form with errors", props: { ...props, mode: "edit", fieldErrors: { name: "Role name is required." } } },
    { desc: "should render error message in edit mode", props: { ...props, mode: "edit", formStatus: "error" } },
  ]);
});
