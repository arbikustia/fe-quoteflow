import test from "@/libs/unit-test";

import MasterCustomerComponent from "./MasterCustomer.component";
import type { MasterCustomerProps } from "./MasterCustomer.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterCustomerProps = {
  listStatus: "ready",
  customers: [
    { id: "1", name: "PT Mega Jaya Abadi", email: "admin@megajaya.com", address: "Jl. Sudirman No. 45", phoneNumber: "081234567890", status: "active" },
    { id: "2", name: "Budi Santoso", email: "—", address: "Jl. Diponegoro No. 88", phoneNumber: "085612345678", status: "inactive" },
  ],
  totalPages: 1,
  totalCount: 2,
  currentPage: 1,
  pageSize: 10,
  onPageChange: jest.fn(),
  onPageSizeChange: jest.fn(),
  onSearchChange: jest.fn(),
  onBack: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
};

describe("MasterCustomerComponent Snapshot Test", () => {
  test.assertSnapshots(MasterCustomerComponent, [
    { desc: "should render customer rows", props },
    { desc: "should render loading skeletons", props: { ...props, listStatus: "loading", customers: [] } },
    { desc: "should render empty message", props: { ...props, listStatus: "empty", customers: [] } },
  ]);
});
