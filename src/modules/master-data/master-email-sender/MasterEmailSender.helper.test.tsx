import { fireEvent, render, screen } from "@/libs/unit-test";

import {
  _createEditClickHandler,
  getEmailSenderColumns,
  getEmailSenderRowKey,
  renderEmailSenderMobileCard,
} from "./MasterEmailSender.helper";
import type { EmailSenderData } from "./MasterEmailSender.type";

const EMAIL_SENDER: EmailSenderData = {
  id: "sender-1",
  name: "Finance Sender",
  email: "finance@company.com",
  smtpServer: "smtp.gmail.com:587",
  enableSsl: "yes",
  isDefault: "no",
  status: "inactive",
  createdAt: "04 November 2026 23:04",
};

describe("MasterEmailSender helper", () => {
  it("should call edit without bubbling the click", () => {
    const onEdit = jest.fn();
    const stopPropagation = jest.fn();

    _createEditClickHandler(EMAIL_SENDER, onEdit)({ stopPropagation } as never);

    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(EMAIL_SENDER);
  });

  it("should build columns with the edit action when allowed", () => {
    const onEdit = jest.fn();
    const columns = getEmailSenderColumns(2, 10, true, onEdit);

    expect(columns.map((column) => column.key)).toEqual([
      "no",
      "name",
      "email",
      "smtpServer",
      "enableSsl",
      "isDefault",
      "status",
      "createdAt",
      "actions",
    ]);

    render(<div>{columns.map((column) => <div key={column.key}>{column.render?.(EMAIL_SENDER, 0)}</div>)}</div>);

    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("smtp.gmail.com:587")).toBeInTheDocument();
    expect(screen.getByText("yes")).toHaveClass("bg-information-subtle");
    expect(screen.getByText("no")).toHaveClass("bg-background-subtle");
    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    fireEvent.click(screen.getByRole("button", { name: "Edit email sender Finance Sender" }));
    expect(onEdit).toHaveBeenCalledWith(EMAIL_SENDER);
  });

  it("should hide the action column without edit permission", () => {
    expect(getEmailSenderColumns(1, 10, false, jest.fn()).map((column) => column.key)).not.toContain("actions");
  });

  it("should use the sender id as the row key", () => {
    expect(getEmailSenderRowKey(EMAIL_SENDER)).toBe("sender-1");
  });

  it("should render a mobile card that opens edit when allowed", () => {
    const onEdit = jest.fn();

    render(renderEmailSenderMobileCard({ emailSender: EMAIL_SENDER, canEdit: true, onEdit }));
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("04 November 2026 23:04")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(onEdit).toHaveBeenCalledWith(EMAIL_SENDER);
  });

  it("should disable the mobile card without edit permission", () => {
    render(renderEmailSenderMobileCard({ emailSender: EMAIL_SENDER, canEdit: false, onEdit: jest.fn() }));

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
