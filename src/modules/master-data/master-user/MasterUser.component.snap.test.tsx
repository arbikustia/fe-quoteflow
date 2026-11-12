import test from "@/libs/unit-test";

import MasterUserComponent from "./MasterUser.component";
import type { MasterUserProps } from "./MasterUser.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterUserProps = {
  listStatus: "ready",
  users: [
    { id: "user-1", username: "arbikustia14", email: "arbi@example.com", role: "Administrator", status: "active", createdAt: "30 Oktober 2026 22:00" },
    { id: "user-2", username: "johndoe", email: "-", role: "Sales", status: "inactive", createdAt: "-" },
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

describe("MasterUserComponent Snapshot Test", () => {
  test.assertSnapshots(MasterUserComponent, [
    { desc: "should render user rows", props },
    { desc: "should render read-only rows without permissions", props: { ...props, canCreate: false, canEdit: false } },
    { desc: "should render loading skeletons", props: { ...props, listStatus: "loading", users: [] } },
    { desc: "should render empty message", props: { ...props, listStatus: "empty", users: [] } },
  ]);
});
