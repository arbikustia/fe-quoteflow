import test from "@/libs/unit-test";

import MasterOrderTypeComponent from "./MasterOrderType.component";
import type { MasterOrderTypeProps } from "./MasterOrderType.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterOrderTypeProps = {
  listStatus: "ready",
  orderTypes: [
    { id: "order-type-1", name: "Delivery", isHandover: "yes", status: "active", createdAt: "30 Oktober 2026 21:09" },
    { id: "order-type-2", name: "Pickup", isHandover: "no", status: "inactive", createdAt: "-" },
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

describe("MasterOrderTypeComponent Snapshot Test", () => {
  test.assertSnapshots(MasterOrderTypeComponent, [
    { desc: "should render order type rows", props },
    { desc: "should render read-only rows without permissions", props: { ...props, canCreate: false, canEdit: false } },
    { desc: "should render loading skeletons", props: { ...props, listStatus: "loading", orderTypes: [] } },
    { desc: "should render empty message", props: { ...props, listStatus: "empty", orderTypes: [] } },
  ]);
});
