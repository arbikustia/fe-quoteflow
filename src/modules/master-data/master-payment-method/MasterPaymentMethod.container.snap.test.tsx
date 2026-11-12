import { MOCK_API_PAYMENT_METHODS, MOCK_PAYMENT_METHOD_LIST_RESPONSE } from "@/fixture/master-payment-method";
import { usePagePermission } from "@/hooks/usePagePermission";
import test from "@/libs/unit-test";
import { useGetPaymentMethodsQuery } from "@/services/master-payment-method.service";

import MasterPaymentMethodContainer from "./MasterPaymentMethod.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-payment-method.service", () => ({ useGetPaymentMethodsQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

// Dates are rendered in the runner's timezone; null keeps the snapshot stable
const RESPONSE_WITHOUT_DATES = { ...MOCK_PAYMENT_METHOD_LIST_RESPONSE, data: MOCK_API_PAYMENT_METHODS.map((paymentMethod) => ({ ...paymentMethod, created_at: null })) };

describe("MasterPaymentMethodContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetPaymentMethodsQuery).mockReturnValue({ data: RESPONSE_WITHOUT_DATES, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  test.assertSnapshots(MasterPaymentMethodContainer, [{ desc: "should render the payment method list from query data", props: {} }]);
});
