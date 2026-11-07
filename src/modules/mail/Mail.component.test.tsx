import { describe, expect, it, jest } from "@jest/globals";

import { render, screen } from "@/libs/unit-test";
import { BrowserRouter } from "react-router-dom";

import { MailComponent } from "./Mail.component";
import type { MailData, MailProps } from "./Mail.type";

const MOCK_MAILS: MailData[] = [
  {
    id: "mail-1",
    senderEmail: "sender@example.com",
    recipientEmail: "customer@example.com",
    subject: "Quotation follow up",
    status: "active",
    sentAt: "2026-01-01 10:00",
    createdAt: "2026-01-01 10:00",
  },
];

jest.mock("../../components/Pagination", () => ({
  Pagination: () => <div data-testid="pagination" />,
}));

jest.mock("../../app/layout", () => ({ children }: { children: React.ReactNode }) => <div data-testid="mock-layout">{children}</div>);

const buildProps = (overrides: Partial<MailProps> = {}): MailProps => ({
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  paginatedData: MOCK_MAILS,
  totalCount: 1,
  isLoading: false,
  isEmpty: false,
  isMissingData: false,
  goToPage: jest.fn(),
  changePageSize: jest.fn(),
  setSearchTerm: jest.fn(),
  onCompose: jest.fn(),
  onBack: jest.fn(),
  ...overrides,
});

const renderComponent = (props: MailProps): void => {
  render(
    <BrowserRouter>
      <MailComponent {...props} />
    </BrowserRouter>,
  );
};

describe("MailComponent", () => {
  it("should render mail rows", () => {
    renderComponent(buildProps());

    expect(screen.getAllByText("Quotation follow up").length).toBeGreaterThan(0);
    expect(screen.getAllByText("customer@example.com").length).toBeGreaterThan(0);
  });

  it("should render empty state when no mails exist", () => {
    renderComponent(buildProps({ paginatedData: [], isEmpty: true }));

    expect(screen.getAllByText("No mails found.").length).toBeGreaterThan(0);
  });

  it("should render error state when the request fails", () => {
    renderComponent(buildProps({ errorMessage: "Unable to load mails." }));

    expect(screen.getAllByText("Unable to load mails.").length).toBeGreaterThan(0);
  });

  it("should render missing data state when the response has no data", () => {
    renderComponent(buildProps({ isMissingData: true }));

    expect(screen.getAllByText("Mail data is unavailable. Please try again.").length).toBeGreaterThan(0);
  });
});
