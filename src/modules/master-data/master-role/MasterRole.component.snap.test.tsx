import test from "@/libs/unit-test";

import MasterRoleComponent from "./MasterRole.component";
import type { MasterRoleProps } from "./MasterRole.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterRoleProps = {
  listStatus: "ready",
  roles: [
    { id: "role-1", name: "Administrator", status: "active", createdAt: "30 Oktober 2026 22:00" },
    { id: "role-2", name: "Sales", status: "inactive", createdAt: "-" },
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

describe("MasterRoleComponent Snapshot Test", () => {
  test.assertSnapshots(MasterRoleComponent, [
    { desc: "should render role rows", props },
    { desc: "should render read-only rows without permissions", props: { ...props, canCreate: false, canEdit: false } },
    { desc: "should render loading skeletons", props: { ...props, listStatus: "loading", roles: [] } },
    { desc: "should render empty message", props: { ...props, listStatus: "empty", roles: [] } },
  ]);
});
