import test from "@/libs/unit-test";

import { MailComponent } from "./Mail.component";
import type { MailData, MailProps } from "./Mail.type";

jest.mock("../../app/layout", () => ({ children }: { children: React.ReactNode }) => <div data-testid="mock-layout">{children}</div>);

const MAIL_ROWS: MailData[] = [
  {
    id: "mail-1",
    recipient: "customer@example.com",
    subject: "Quotation follow up",
    body: "Hello",
    status: "active",
    createAt: "2026-01-01 10:00",
    createBy: "admin",
  },
];

const props: MailProps = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  paginatedData: MAIL_ROWS,
  totalCount: 1,
  isLoading: false,
  isEmpty: false,
  isMissingData: false,
  goToPage: jest.fn(),
  changePageSize: jest.fn(),
  setSearchTerm: jest.fn(),
  onCompose: jest.fn(),
  onBack: jest.fn(),
};

const configs = [
  { props, desc: "should render mail list" },
  { props: { ...props, isLoading: true }, desc: "should render mail list while loading" },
];

test.assertSnapshots(MailComponent, configs);
