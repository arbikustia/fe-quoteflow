import test from "@/libs/unit-test";

import MasterPicComponent from "./MasterPic.component";
import type { MasterPicProps } from "./MasterPic.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterPicProps = {
  listStatus: "ready",
  pics: [
    { id: "pic-1", name: "Aurora", status: "active", createdAt: "04 November 2026 20:57" },
    { id: "pic-2", name: "Kristofer", status: "inactive", createdAt: "-" },
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

describe("MasterPicComponent Snapshot Test", () => {
  test.assertSnapshots(MasterPicComponent, [
    { desc: "should render PIC rows", props },
    { desc: "should render read-only rows without permissions", props: { ...props, canCreate: false, canEdit: false } },
    { desc: "should render loading skeletons", props: { ...props, listStatus: "loading", pics: [] } },
    { desc: "should render empty message", props: { ...props, listStatus: "empty", pics: [] } },
  ]);
});
