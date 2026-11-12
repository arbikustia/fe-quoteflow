import test from "@/libs/unit-test";

import MasterOrderTypeCreateComponent from "./MasterOrderTypeCreate.component";
import type { MasterOrderTypeCreateProps } from "./MasterOrderTypeCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterOrderTypeCreateProps = {
  mode: "create",
  formStatus: "ready",
  values: { name: "Delivery", isHandover: true, isActive: true },
  fieldErrors: {},
  isSubmitting: false,
  onNameChange: jest.fn(),
  onToggleChange: { isHandover: jest.fn(), isActive: jest.fn() },
  onSubmit: jest.fn(),
  onBack: jest.fn(),
};

describe("MasterOrderTypeCreateComponent Snapshot Test", () => {
  test.assertSnapshots(MasterOrderTypeCreateComponent, [
    { desc: "should render order type create form", props },
    { desc: "should render order type create form while submitting", props: { ...props, isSubmitting: true } },
    { desc: "should render order type edit form with errors", props: { ...props, mode: "edit", fieldErrors: { name: "Order type name is required." } } },
    { desc: "should render loading message in edit mode", props: { ...props, mode: "edit", formStatus: "loading" } },
  ]);
});
