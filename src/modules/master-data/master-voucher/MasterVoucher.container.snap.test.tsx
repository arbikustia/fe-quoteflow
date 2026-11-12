import { MOCK_API_VOUCHERS, MOCK_VOUCHER_LIST_RESPONSE } from "@/fixture/master-voucher";
import { usePagePermission } from "@/hooks/usePagePermission";
import test from "@/libs/unit-test";
import { useGetVouchersQuery } from "@/services/master-voucher.service";

import MasterVoucherContainer from "./MasterVoucher.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-voucher.service", () => ({ useGetVouchersQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

// Dates are rendered in the runner's timezone; null keeps the snapshot stable
const RESPONSE_WITHOUT_DATES = { ...MOCK_VOUCHER_LIST_RESPONSE, data: MOCK_API_VOUCHERS.map((voucher) => ({ ...voucher, created_at: null })) };

describe("MasterVoucherContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetVouchersQuery).mockReturnValue({ data: RESPONSE_WITHOUT_DATES, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  test.assertSnapshots(MasterVoucherContainer, [{ desc: "should render the voucher list from query data", props: {} }]);
});
