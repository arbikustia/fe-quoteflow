import test from "@/libs/unit-test";

import MasterEmailSenderComponent from "./MasterEmailSender.component";
import type { MasterEmailSenderProps } from "./MasterEmailSender.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterEmailSenderProps = {
  listStatus: "ready",
  emailSenders: [
    {
      id: "sender-1",
      name: "Finance Sender",
      email: "finance@company.com",
      smtpServer: "smtp.gmail.com:587",
      enableSsl: "yes",
      isDefault: "yes",
      status: "active",
      createdAt: "04 November 2026 23:04",
    },
    {
      id: "sender-2",
      name: "Support Sender",
      email: "support@company.com",
      smtpServer: "mail.company.com:465",
      enableSsl: "no",
      isDefault: "no",
      status: "inactive",
      createdAt: "-",
    },
  ],
  totalPages: 1,
  totalCount: 2,
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
};

describe("MasterEmailSenderComponent Snapshot Test", () => {
  test.assertSnapshots(MasterEmailSenderComponent, [
    { desc: "should render email sender rows", props },
    { desc: "should render read-only rows without permissions", props: { ...props, canCreate: false, canEdit: false } },
    { desc: "should render loading skeletons", props: { ...props, listStatus: "loading", emailSenders: [] } },
    { desc: "should render empty message", props: { ...props, listStatus: "empty", emailSenders: [] } },
  ]);
});
