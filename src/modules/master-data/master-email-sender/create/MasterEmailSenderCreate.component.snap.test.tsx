import test from "@/libs/unit-test";

import MasterEmailSenderCreateComponent from "./MasterEmailSenderCreate.component";
import type { MasterEmailSenderCreateProps } from "./MasterEmailSenderCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterEmailSenderCreateProps = {
  mode: "create",
  formStatus: "ready",
  values: {
    name: "Finance Sender",
    email: "finance@company.com",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "finance",
    smtpPassword: "",
    enableSsl: true,
    isDefault: false,
    isActive: true,
  },
  fieldErrors: {},
  isSubmitting: false,
  onTextChange: { name: jest.fn(), email: jest.fn(), smtpHost: jest.fn(), smtpUsername: jest.fn(), smtpPassword: jest.fn() },
  onPortChange: jest.fn(),
  onToggleChange: { enableSsl: jest.fn(), isDefault: jest.fn(), isActive: jest.fn() },
  onSubmit: jest.fn(),
  onBack: jest.fn(),
};

describe("MasterEmailSenderCreateComponent Snapshot Test", () => {
  test.assertSnapshots(MasterEmailSenderCreateComponent, [
    { desc: "should render email sender create form", props },
    { desc: "should render email sender create form while submitting", props: { ...props, isSubmitting: true } },
    { desc: "should render email sender edit form with errors", props: { ...props, mode: "edit", fieldErrors: { name: "Name is required." } } },
    { desc: "should render loading message in edit mode", props: { ...props, mode: "edit", formStatus: "loading" } },
  ]);
});
