import test from "@/libs/unit-test";

import MasterVoucherCreateComponent from "./MasterVoucherCreate.component";
import type { MasterVoucherCreateProps } from "./MasterVoucherCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterVoucherCreateProps = {
  mode: "create",
  formStatus: "ready",
  values: { name: "Summer Promo", codeMode: "type", code: "SLABC123", discountPercent: 10, isActive: true },
  fieldErrors: {},
  isSubmitting: false,
  onNameChange: jest.fn(),
  onCodeModeChange: jest.fn(),
  onCodeChange: jest.fn(),
  onDiscountChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
};

describe("MasterVoucherCreateComponent Snapshot Test", () => {
  test.assertSnapshots(MasterVoucherCreateComponent, [
    { desc: "should render voucher create form", props },
    { desc: "should render voucher create form in generate mode", props: { ...props, values: { ...props.values, codeMode: "generate", code: "" } } },
    { desc: "should render voucher create form while submitting", props: { ...props, isSubmitting: true } },
    { desc: "should render voucher edit form with errors", props: { ...props, mode: "edit", fieldErrors: { name: "Voucher name is required.", discountPercent: "Discount percentage is required." } } },
    { desc: "should render error message in edit mode", props: { ...props, mode: "edit", formStatus: "error" } },
  ]);
});
