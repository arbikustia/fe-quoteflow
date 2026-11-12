import test from "@/libs/unit-test";

import MasterVoucherComponent from "./MasterVoucher.component";
import type { MasterVoucherProps } from "./MasterVoucher.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterVoucherProps = {
  listStatus: "ready",
  vouchers: [
    { id: "voucher-1", name: "Summer Promo", code: "SLABC123", discountPercent: 10, status: "active", createdAt: "30 Oktober 2026 22:00" },
    { id: "voucher-2", name: "Winter Promo", code: "WINTER25", discountPercent: 25, status: "inactive", createdAt: "-" },
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
  onDownload: jest.fn(),
};

describe("MasterVoucherComponent Snapshot Test", () => {
  test.assertSnapshots(MasterVoucherComponent, [
    { desc: "should render voucher rows", props },
    { desc: "should render read-only rows without permissions", props: { ...props, canCreate: false, canEdit: false } },
    { desc: "should render loading skeletons", props: { ...props, listStatus: "loading", vouchers: [] } },
    { desc: "should render empty message", props: { ...props, listStatus: "empty", vouchers: [] } },
  ]);
});
