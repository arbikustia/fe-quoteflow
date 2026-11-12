import { MOCK_API_ITEMS } from "@/fixture/master-item";
import test from "@/libs/unit-test";

import MasterItemComponent from "./MasterItem.component";
import type { MasterItemProps } from "./MasterItem.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterItemProps = {
  listStatus: "ready",
  items: [
    { id: "item-1", name: "Beam 290", categoryName: "Lighting Equipment", price: 100000, stock: 11, duration: 1, image: "https://cdn.example.com/beam.jpg", remark: "Lighting", status: "active", source: MOCK_API_ITEMS[0] },
    { id: "item-2", name: "Wireless Mic", categoryName: "-", price: 0, stock: 0, duration: 0, image: null, remark: "-", status: "inactive", source: MOCK_API_ITEMS[1] },
  ],
  totalPages: 1,
  totalCount: 2,
  currentPage: 1,
  pageSize: 10,
  canCreate: true,
  canEdit: true,
  selectedItemIds: [],
  isMultiDownloadMode: false,
  onPageChange: jest.fn(),
  onPageSizeChange: jest.fn(),
  onSearchChange: jest.fn(),
  onBack: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  onToggleItem: jest.fn(),
  onStartMultiDownload: jest.fn(),
  onCancelMultiDownload: jest.fn(),
  onDownload: jest.fn(),
  onDownloadSelected: jest.fn(),
};

describe("MasterItemComponent Snapshot Test", () => {
  test.assertSnapshots(MasterItemComponent, [
    { desc: "should render item rows", props },
    { desc: "should render read-only rows without permissions", props: { ...props, canCreate: false, canEdit: false } },
    { desc: "should render the selection column in multi-download mode", props: { ...props, isMultiDownloadMode: true, selectedItemIds: ["item-1"] } },
    { desc: "should render loading skeletons", props: { ...props, listStatus: "loading", items: [] } },
    { desc: "should render empty message", props: { ...props, listStatus: "empty", items: [] } },
  ]);
});
