import { MOCK_API_PAYMENT_METHODS } from "@/fixture/master-payment-method";
import test from "@/libs/unit-test";

import MasterPaymentMethodComponent from "./MasterPaymentMethod.component";
import type { MasterPaymentMethodProps } from "./MasterPaymentMethod.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterPaymentMethodProps = {
  listStatus: "ready",
  paymentMethods: [
    { id: "payment-method-1", name: "BCA", description: "No Admin Fee", status: "active", createdAt: "30 Oktober 2026 22:00", source: MOCK_API_PAYMENT_METHODS[0] },
    { id: "payment-method-2", name: "BRI", description: "No description", status: "inactive", createdAt: "-", source: MOCK_API_PAYMENT_METHODS[1] },
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

describe("MasterPaymentMethodComponent Snapshot Test", () => {
  test.assertSnapshots(MasterPaymentMethodComponent, [
    { desc: "should render payment method rows", props },
    { desc: "should render read-only rows without permissions", props: { ...props, canCreate: false, canEdit: false } },
    { desc: "should render loading skeletons", props: { ...props, listStatus: "loading", paymentMethods: [] } },
    { desc: "should render empty message", props: { ...props, listStatus: "empty", paymentMethods: [] } },
  ]);
});
