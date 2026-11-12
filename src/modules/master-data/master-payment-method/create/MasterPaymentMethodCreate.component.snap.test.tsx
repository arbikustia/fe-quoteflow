import test from "@/libs/unit-test";

import MasterPaymentMethodCreateComponent from "./MasterPaymentMethodCreate.component";
import type { MasterPaymentMethodCreateProps } from "./MasterPaymentMethodCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterPaymentMethodCreateProps = {
  mode: "create",
  formStatus: "ready",
  values: { name: "BCA", description: "No Admin Fee", isActive: true },
  fieldErrors: {},
  isSubmitting: false,
  onNameChange: jest.fn(),
  onDescriptionChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
};

describe("MasterPaymentMethodCreateComponent Snapshot Test", () => {
  test.assertSnapshots(MasterPaymentMethodCreateComponent, [
    { desc: "should render payment method create form", props },
    { desc: "should render payment method create form while submitting", props: { ...props, isSubmitting: true } },
    { desc: "should render payment method edit form with errors", props: { ...props, mode: "edit", fieldErrors: { description: "Description is required." } } },
    { desc: "should render error message in edit mode", props: { ...props, mode: "edit", formStatus: "error" } },
  ]);
});
