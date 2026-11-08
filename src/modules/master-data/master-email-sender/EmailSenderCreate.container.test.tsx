import * as React from "react";
import type { ReactElement } from "react";

import { render, screen } from "@/libs/unit-test";

import EmailSenderCreateContainer from "./EmailSenderCreate.container";
import { useEmailSenderCreate } from "./EmailSenderCreate.hook";
import type { EmailSenderCreateProps } from "./EmailSenderCreate.type";

jest.mock("./EmailSenderCreate.hook", () => ({ useEmailSenderCreate: jest.fn() }));

jest.mock("@/app/layout", () => ({
  __esModule: true,
  /**
   * Render a plain wrapper around children.
   *
   * @param {React.PropsWithChildren} props - Layout props
   * @returns {React.ReactElement} Wrapper element
   */
  default: (props: React.PropsWithChildren): ReactElement => (
    <div data-testid="layout">{props.children}</div>
  ),
}));

const formState: EmailSenderCreateProps = {
  name: "",
  email: "",
  smtp_host: "",
  smtp_port: 587,
  smtp_username: "",
  smtp_password: "",
  enable_ssl: true,
  is_default: false,
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

describe("EmailSenderCreateContainer", () => {
  it("should render the layout and the sender form from hook state", () => {
    jest.mocked(useEmailSenderCreate).mockReturnValue(formState);

    render(<EmailSenderCreateContainer />);

    expect(screen.getByTestId("layout")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create Email Sender" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: /SMTP Host/ })).toBeTruthy();
  });
});
