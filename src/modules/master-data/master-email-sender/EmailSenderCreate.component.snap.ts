import { jest } from "@jest/globals";

import test from "@/libs/unit-test";

import { EmailSenderCreateComponent } from "./EmailSenderCreate.component";
import type { EmailSenderCreateProps } from "./EmailSenderCreate.type";

const props: EmailSenderCreateProps = {
  name: "Finance Sender",
  email: "finance@company.com",
  smtp_host: "smtp.gmail.com",
  smtp_port: 587,
  smtp_username: "finance",
  smtp_password: "",
  enable_ssl: true,
  is_default: true,
  status: 1,
  isEditMode: false,
  isSubmitting: false,
  errorMessage: null,
  fieldErrors: {},
  onChange: jest.fn(() => jest.fn()),
  onPortChange: jest.fn(),
  onSslChange: jest.fn(),
  onDefaultChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
};

const configs = [
  { props, desc: "Should Render EmailSenderCreateComponent in create mode" },
];

it("EmailSenderCreateComponent matches snapshot", () => {
  test.assertSnapshots(EmailSenderCreateComponent, configs);
});
