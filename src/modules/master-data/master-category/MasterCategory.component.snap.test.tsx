import test from "@/libs/unit-test";

import MasterCategoryComponent from "./MasterCategory.component";
import type { MasterCategoryProps } from "./MasterCategory.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterCategoryProps = {
  listStatus: "ready",
  categories: [
    { id: "1", categoryName: "Audio System", status: "active", createdAt: "01 Februari 2024 07.00" },
    { id: "2", categoryName: "Lighting System", status: "inactive", createdAt: "-" },
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

describe("MasterCategoryComponent Snapshot Test", () => {
  test.assertSnapshots(MasterCategoryComponent, [
    { desc: "should render category rows", props },
    { desc: "should render read-only rows without permissions", props: { ...props, canCreate: false, canEdit: false } },
    { desc: "should render loading skeletons", props: { ...props, listStatus: "loading", categories: [] } },
    { desc: "should render empty message", props: { ...props, listStatus: "empty", categories: [] } },
  ]);
});
