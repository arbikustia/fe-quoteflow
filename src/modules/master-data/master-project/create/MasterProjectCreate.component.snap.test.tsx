import test from "@/libs/unit-test";

import { PROJECT_FORM_DEFAULT_VALUES } from "./MasterProjectCreate.config";
import MasterProjectCreateComponent from "./MasterProjectCreate.component";
import type { MasterProjectCreateProps, ProjectFormValues } from "./MasterProjectCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const VALUES: ProjectFormValues = {
  ...PROJECT_FORM_DEFAULT_VALUES,
  name: "Wedding Package",
  price: 5000000,
  remark: "Full stage setup",
  selectedItems: [{ id: "item-1", name: "Beam 290", image: "", price: 100000, stock: 11, qty: 2 }],
};

const props: MasterProjectCreateProps = {
  mode: "create",
  formStatus: "ready",
  itemsStatus: "ready",
  itemOptions: [{ id: "item-1", name: "Beam 290", image: "", price: 100000, stock: 11 }],
  step: "items",
  values: VALUES,
  fieldErrors: {},
  isSubmitting: false,
  onItemToggle: jest.fn(),
  onItemQuantityChange: jest.fn(),
  onNameChange: jest.fn(),
  onPriceChange: jest.fn(),
  onRemarkChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onStepBack: jest.fn(),
  onBack: jest.fn(),
};

describe("MasterProjectCreateComponent Snapshot Test", () => {
  test.assertSnapshots(MasterProjectCreateComponent, [
    { desc: "should render the item step", props },
    { desc: "should render the information step with errors", props: { ...props, step: "information", fieldErrors: { name: "Project name is required." } } },
    { desc: "should render the edit information step with status switch", props: { ...props, mode: "edit", step: "information" } },
    { desc: "should render the preview step while submitting", props: { ...props, step: "preview", isSubmitting: true } },
    { desc: "should render the form state message", props: { ...props, formStatus: "loading" } },
  ]);
});
