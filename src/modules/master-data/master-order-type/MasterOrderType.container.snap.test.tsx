import { MOCK_API_ORDER_TYPES, MOCK_ORDER_TYPE_LIST_RESPONSE } from "@/fixture/master-order-type";
import { usePagePermission } from "@/hooks/usePagePermission";
import test from "@/libs/unit-test";
import { useGetOrderTypesQuery } from "@/services/master-order-type.service";

import MasterOrderTypeContainer from "./MasterOrderType.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-order-type.service", () => ({ useGetOrderTypesQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

// Dates are rendered in the runner's timezone; null keeps the snapshot stable
const RESPONSE_WITHOUT_DATES = { ...MOCK_ORDER_TYPE_LIST_RESPONSE, data: MOCK_API_ORDER_TYPES.map((orderType) => ({ ...orderType, created_at: null })) };

describe("MasterOrderTypeContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetOrderTypesQuery).mockReturnValue({ data: RESPONSE_WITHOUT_DATES, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  test.assertSnapshots(MasterOrderTypeContainer, [{ desc: "should render the order type list from query data", props: {} }]);
});
