import { fireEvent, render, screen } from "@/libs/unit-test";

import { EMAIL_SENDER_FORM_DEFAULT_VALUES } from "./MasterEmailSenderCreate.config";
import MasterEmailSenderCreateComponent from "./MasterEmailSenderCreate.component";
import type { MasterEmailSenderCreateProps } from "./MasterEmailSenderCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

/**
 * Build form view props.
 * @param {Partial<MasterEmailSenderCreateProps>} [overrides] - Props to override
 * @returns {MasterEmailSenderCreateProps} - Component props
 */
const createProps = (overrides?: Partial<MasterEmailSenderCreateProps>): MasterEmailSenderCreateProps => ({
  mode: "create",
  formStatus: "ready",
  values: EMAIL_SENDER_FORM_DEFAULT_VALUES,
  fieldErrors: {},
  isSubmitting: false,
  onTextChange: { name: jest.fn(), email: jest.fn(), smtpHost: jest.fn(), smtpUsername: jest.fn(), smtpPassword: jest.fn() },
  onPortChange: jest.fn(),
  onToggleChange: { enableSsl: jest.fn(), isDefault: jest.fn(), isActive: jest.fn() },
  onSubmit: jest.fn(),
  onBack: jest.fn(),
  ...overrides,
});

describe("MasterEmailSenderCreateComponent", () => {
  it("should render the create form without the status field", () => {
    const props = createProps();

    render(<MasterEmailSenderCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getAllByText("New Email Sender")).toHaveLength(3);
    expect(screen.getAllByRole("switch")).toHaveLength(2);
    expect(screen.getByPlaceholderText("Enter SMTP password")).toBeInTheDocument();
    expect(props.onBack).toHaveBeenCalledTimes(1);
  });

  it("should forward input, switch and submit events", () => {
    const props = createProps();

    render(<MasterEmailSenderCreateComponent {...props} />);
    fireEvent.change(screen.getByPlaceholderText("e.g. Finance Sender"), { target: { value: "Finance" } });
    fireEvent.change(screen.getByPlaceholderText("e.g. smtp.gmail.com"), { target: { value: "smtp.gmail.com" } });
    fireEvent.change(screen.getByLabelText(/SMTP Port/), { target: { value: "465" } });
    fireEvent.click(screen.getByRole("switch", { name: "Default sender" }));
    fireEvent.submit(screen.getByRole("button", { name: "Create Email Sender" }));

    expect(props.onTextChange.name).toHaveBeenCalledTimes(1);
    expect(props.onTextChange.smtpHost).toHaveBeenCalledTimes(1);
    expect(props.onPortChange).toHaveBeenCalledWith(465);
    expect(props.onToggleChange.isDefault).toHaveBeenCalledWith(true, expect.anything());
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show field errors", () => {
    render(<MasterEmailSenderCreateComponent {...createProps({ fieldErrors: { email: "Email is not valid.", smtpPort: "SMTP Port is required." } })} />);

    expect(screen.getByText("Email is not valid.")).toBeInTheDocument();
    expect(screen.getByText("SMTP Port is required.")).toBeInTheDocument();
  });

  it("should show the status badge, switch and optional password in edit mode", () => {
    const props = createProps({ mode: "edit", values: { ...EMAIL_SENDER_FORM_DEFAULT_VALUES, isActive: false }, isSubmitting: true });

    render(<MasterEmailSenderCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("switch", { name: "Email sender status" }));

    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(screen.getByPlaceholderText("Leave blank to keep current password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Updating…" })).toBeDisabled();
    expect(props.onToggleChange.isActive).toHaveBeenCalledWith(true, expect.anything());
  });

  it.each([
    ["loading", "Loading email sender data…"],
    ["error", "Unable to load email sender data. Please try again."],
  ] as const)("should show the %s message instead of the form", (formStatus, message) => {
    render(<MasterEmailSenderCreateComponent {...createProps({ mode: "edit", formStatus })} />);

    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Update Email Sender" })).not.toBeInTheDocument();
  });

  it("should show the submit error toast", () => {
    render(<MasterEmailSenderCreateComponent {...createProps({ errorMessage: "Duplicate email" })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Duplicate email");
  });
});
