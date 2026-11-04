import type { ReactElement } from "react";

import { fireEvent, render, screen, waitFor } from "@/libs/unit-test";
import * as ReactRouterDom from "react-router-dom";

import * as EmailSenderService from "@/services/email-sender.service";

import { EmailSenderCreateComponent } from "./EmailSenderCreate.component";
import { useEmailSenderCreate } from "./EmailSenderCreate.hook";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/services/email-sender.service", () => ({
  useCreateEmailSenderMutation: jest.fn(),
  useUpdateEmailSenderMutation: jest.fn(),
}));

const EmailSenderCreateTestHarness = (): ReactElement => (
  <EmailSenderCreateComponent {...useEmailSenderCreate()} />
);

describe("EmailSenderCreateComponent", () => {
  const createEmailSender = jest.fn();
  const updateEmailSender = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(ReactRouterDom.useLocation).mockReturnValue({
      hash: "",
      key: "default",
      pathname: "/master-email-sender/create",
      search: "",
      state: null,
    });
    jest.mocked(ReactRouterDom.useNavigate).mockReturnValue(jest.fn());
    jest.mocked(ReactRouterDom.useParams).mockReturnValue({});
    (EmailSenderService.useCreateEmailSenderMutation as jest.Mock).mockReturnValue([
      createEmailSender,
      { isLoading: false },
    ]);
    (EmailSenderService.useUpdateEmailSenderMutation as jest.Mock).mockReturnValue([
      updateEmailSender,
      { isLoading: false },
    ]);
  });

  it("should show field errors and stop submission when required inputs are empty", async () => {
    render(<EmailSenderCreateTestHarness />);

    fireEvent.click(screen.getByRole("button", { name: "Create Email Sender" }));

    await waitFor(() => {
      expect(screen.getByText("Name is required.")).toBeTruthy();
    });
    expect(screen.getByText("Email is required.")).toBeTruthy();
    expect(screen.getByText("SMTP Host is required.")).toBeTruthy();
    expect(screen.getByText("SMTP Username is required.")).toBeTruthy();
    expect(screen.getByText("SMTP Password is required.")).toBeTruthy();
    const nameInput = screen.getByRole("textbox", { name: /Name/ });

    expect(nameInput.getAttribute("aria-invalid")).toBe("true");
    expect(nameInput.classList.contains("ant-input-status-error")).toBe(true);
    expect(createEmailSender).not.toHaveBeenCalled();
  });
});
