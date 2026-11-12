import test from "@/libs/unit-test";

import MasterProjectComponent from "./MasterProject.component";
import type { MasterProjectProps } from "./MasterProject.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterProjectProps = {
  listStatus: "ready",
  projects: [
    { id: "project-1", name: "Wedding Package", remark: "Full stage setup", status: "active", createdAt: "4 November 2026 19:49", itemCount: 1 },
    { id: "project-2", name: "Meeting Package", remark: "-", status: "inactive", createdAt: "-", itemCount: 0 },
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

describe("MasterProjectComponent Snapshot Test", () => {
  test.assertSnapshots(MasterProjectComponent, [
    { desc: "should render project rows", props },
    { desc: "should render read-only rows without permissions", props: { ...props, canCreate: false, canEdit: false } },
    { desc: "should render loading skeletons", props: { ...props, listStatus: "loading", projects: [] } },
    { desc: "should render empty message", props: { ...props, listStatus: "empty", projects: [] } },
  ]);
});
