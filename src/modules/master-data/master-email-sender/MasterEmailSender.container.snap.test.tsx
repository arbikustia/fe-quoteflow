import { MOCK_API_EMAIL_SENDERS, MOCK_EMAIL_SENDER_LIST_RESPONSE } from "@/fixture/master-email-sender";
import { usePagePermission } from "@/hooks/usePagePermission";
import test from "@/libs/unit-test";
import { useGetEmailSendersQuery } from "@/services/email-sender.service";

import MasterEmailSenderContainer from "./MasterEmailSender.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/email-sender.service", () => ({ useGetEmailSendersQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

// Dates are rendered in the runner's timezone; null keeps the snapshot stable
const RESPONSE_WITHOUT_DATES = { ...MOCK_EMAIL_SENDER_LIST_RESPONSE, data: MOCK_API_EMAIL_SENDERS.map((emailSender) => ({ ...emailSender, created_at: null })) };

describe("MasterEmailSenderContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetEmailSendersQuery).mockReturnValue({ data: RESPONSE_WITHOUT_DATES, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  test.assertSnapshots(MasterEmailSenderContainer, [{ desc: "should render the email sender list from query data", props: {} }]);
});
