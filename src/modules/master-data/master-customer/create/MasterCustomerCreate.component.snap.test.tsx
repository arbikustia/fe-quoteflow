import test from "@/libs/unit-test";

import MasterCustomerCreateComponent from "./MasterCustomerCreate.component";
import type { MasterCustomerCreateProps } from "./MasterCustomerCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterCustomerCreateProps = {
  mode: "create",
  formStatus: "ready",
  values: { name: "PT Mega Jaya Abadi", email: "admin@megajaya.com", phoneNumber: "081234567890", address: "Jl. Sudirman No. 45, Jakarta Pusat", isActive: true },
  fieldErrors: {},
  isSubmitting: false,
  onNameChange: jest.fn(),
  onEmailChange: jest.fn(),
  onPhoneNumberChange: jest.fn(),
  onAddressChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
};

describe("MasterCustomerCreateComponent Snapshot Test", () => {
  test.assertSnapshots(MasterCustomerCreateComponent, [
    { desc: "should render customer create form", props },
    { desc: "should render customer create form while submitting", props: { ...props, isSubmitting: true } },
    { desc: "should render customer edit form with errors", props: { ...props, mode: "edit", fieldErrors: { email: "Please enter a valid email address." } } },
    { desc: "should render loading message in edit mode", props: { ...props, mode: "edit", formStatus: "loading" } },
  ]);
});
