import { MOCK_MAIL_ROWS } from "@/fixture/mail";
import { render, screen } from "@/libs/unit-test";

import { MailMobileCard } from "./Mail.helper";

describe("MailMobileCard", () => {
  it("should render subject, sender, recipient and created date", () => {
    render(<MailMobileCard mail={MOCK_MAIL_ROWS[0]} />);

    expect(screen.getByText("Quotation follow up")).toBeInTheDocument();
    expect(screen.getByText("sender@example.com")).toBeInTheDocument();
    expect(screen.getByText("customer@example.com")).toBeInTheDocument();
  });

  it("should show a dash for missing values", () => {
    render(<MailMobileCard mail={{ ...MOCK_MAIL_ROWS[0], senderEmail: "", recipientEmail: "", createdAt: "" }} />);

    expect(screen.getAllByText("—")).toHaveLength(3);
  });
});
