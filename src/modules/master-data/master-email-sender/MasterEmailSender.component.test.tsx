import { fireEvent, render, screen } from "@/libs/unit-test";

import MasterEmailSenderComponent from "./MasterEmailSender.component";
import type { EmailSenderData, MasterEmailSenderProps } from "./MasterEmailSender.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const EMAIL_SENDER: EmailSenderData = {
  id: "sender-1",
  name: "Finance Sender",
  email: "finance@company.com",
  smtpServer: "smtp.gmail.com:587",
  enableSsl: "yes",
  isDefault: "yes",
  status: "active",
  createdAt: "04 November 2026 23:04",
};

/**
 * Build list view props.
 * @param {Partial<MasterEmailSenderProps>} [overrides] - Props to override
 * @returns {MasterEmailSenderProps} - Component props
 */
const createProps = (overrides?: Partial<MasterEmailSenderProps>): MasterEmailSenderProps => ({
  listStatus: "ready",
  emailSenders: [EMAIL_SENDER],
  totalPages: 1,
  totalCount: 1,
  currentPage: 1,
  pageSize: 10,
  canCreate: true,
  canEdit: true,
  onPageChange: jest.fn(),
  onPageSizeChange: jest.fn(),
  onSearchChange: jest.fn(),
  onBack: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  ...overrides,
});

describe("MasterEmailSenderComponent", () => {
  it("should render senders in the table and mobile cards", () => {
    render(<MasterEmailSenderComponent {...createProps()} />);

    expect(screen.getAllByText("Finance Sender")).toHaveLength(2);
    expect(screen.getAllByText("smtp.gmail.com:587")).toHaveLength(2);
  });

  it("should open edit from a mobile card and the row action", () => {
    const props = createProps();

    render(<MasterEmailSenderComponent {...props} />);
    fireEvent.click(screen.getAllByText("Finance Sender")[0].closest("button") as HTMLButtonElement);
    fireEvent.click(screen.getByRole("button", { name: "Edit email sender Finance Sender" }));

    expect(props.onEdit).toHaveBeenCalledTimes(2);
  });

  it("should call create and search handlers", () => {
    const props = createProps();

    render(<MasterEmailSenderComponent {...props} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Create New" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Create Email Sender" }));
    fireEvent.change(screen.getAllByPlaceholderText("Search email sender")[0], { target: { value: "finance" } });

    expect(props.onCreate).toHaveBeenCalledTimes(2);
    expect(props.onSearchChange).toHaveBeenCalledTimes(1);
  });

  it("should hide create and edit actions without permission", () => {
    render(<MasterEmailSenderComponent {...createProps({ canCreate: false, canEdit: false })} />);

    expect(screen.queryByRole("button", { name: "Create New" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create Email Sender" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit email sender Finance Sender" })).not.toBeInTheDocument();
    expect(screen.getAllByText("Finance Sender")[0].closest("button")).toBeDisabled();
  });

  it("should render matching table and card skeletons while loading", () => {
    render(<MasterEmailSenderComponent {...createProps({ listStatus: "loading", emailSenders: [] })} />);

    const tableSkeleton = screen.getByRole("status", { name: "Loading email sender table" });

    expect(tableSkeleton.querySelectorAll("th")).toHaveLength(9);
    expect(tableSkeleton.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(screen.getAllByRole("status", { name: "Loading email sender card" })).toHaveLength(5);
  });

  it.each([
    ["empty", "No email senders found."],
    ["error", "Unable to load email senders."],
    ["missing", "Email sender data is unavailable. Please try again."],
  ] as const)("should render the %s message in both layouts", (listStatus, message) => {
    render(<MasterEmailSenderComponent {...createProps({ listStatus, emailSenders: [] })} />);

    expect(screen.getAllByText(message)).toHaveLength(2);
  });

  it("should show the success toast passed from the form page", () => {
    render(<MasterEmailSenderComponent {...createProps({ successMessage: "Email sender created successfully." })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Email sender created successfully.");
  });
});
