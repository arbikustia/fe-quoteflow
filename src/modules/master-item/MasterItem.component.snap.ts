
import test from "@/libs/unit-test";

import type { TableColumn } from "../../components/Table";

import { MasterItemComponent } from "./MasterItem.component";
import type { ItemData } from "./MasterItem.type";

const mockItems: ItemData[] = [
  {
    id: "1",
    name: "Speaker",
    category: "Audio",
    price: 5000000,
    stock: 12,
    image: "https://example.com/a.jpg",
    duration: "3 days",
    remark: "ok",
    unit: "unit",
    status: "active",
    createAt: "2024-01-01",
    createBy: "Admin",
  },
];
const mockColumns: TableColumn<ItemData>[] = [{ key: "name", header: "Item Name" }];

const configs = [
  {
    props: {
      paginatedData: mockItems,
      columns: mockColumns,
      currentPage: 1,
      totalPages: 1,
      pageSize: 5,
      totalCount: 1,
      goToPage: jest.fn(),
      nextPage: jest.fn(),
      prevPage: jest.fn(),
      changePageSize: jest.fn(),
      onCreate: jest.fn(),
      onEdit: jest.fn(),
      onRowClick: jest.fn(),
      onBack: jest.fn(),
      onMore: jest.fn(),
      isMoreOpen: false,
      onCloseMore: jest.fn(),
      onDelete: jest.fn(),
    },
    desc: "Should Render MasterItemComponent with default props",
  },
  {
    props: {
      paginatedData: [] as ItemData[],
      columns: [] as TableColumn<ItemData>[],
      currentPage: 1,
      totalPages: 1,
      pageSize: 5,
      totalCount: 0,
      goToPage: jest.fn(),
      nextPage: jest.fn(),
      prevPage: jest.fn(),
      changePageSize: jest.fn(),
      onCreate: jest.fn(),
      onEdit: jest.fn(),
      onRowClick: jest.fn(),
      onBack: jest.fn(),
      isMoreOpen: false,
    },
    desc: "Should Render MasterItemComponent with empty data",
  },
];

it("MasterItemComponent matches snapshot", () => {
  test.assertSnapshots(MasterItemComponent, configs);
});
