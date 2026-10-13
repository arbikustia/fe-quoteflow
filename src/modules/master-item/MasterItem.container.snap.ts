import test from "@/libs/unit-test";

import MasterItemContainer from "./MasterItem.container";

const mockMappedItem = {
  id: "1",
  name: "Line Array Speaker",
  category: "Audio System",
  price: 5000000,
  stock: 12,
  image: "https://example.com/a.jpg",
  duration: "3 days",
  remark: "High quality sound",
  unit: "unit",
  status: "active",
  createAt: "2024-01-01",
  createBy: "Admin",
};

jest.mock("./MasterItem.api", () => ({
  _mapItem: jest.fn(() => ({
    id: "1",
    name: "Line Array Speaker",
    category: "Audio System",
    price: 5000000,
    stock: 12,
    image: "https://example.com/a.jpg",
    duration: "3 days",
    remark: "High quality sound",
    unit: "unit",
    status: "active",
    createAt: "2024-01-01",
    createBy: "Admin",
  })),
  useGetItemsQuery: jest.fn(() => ({
    data: {
      status: true,
      messages: null,
      data: {
        data: [mockMappedItem],
        page_number: 1,
        total_pages: 1,
        total_count: 1,
        has_previous: false,
        has_next: false,
      },
    },
    error: undefined,
    isLoading: false,
  })),
}));

const configs = [
  { props: {}, desc: "Should Render MasterItemContainer with default props" },
];

it("MasterItemContainer matches snapshot", () => {
  test.assertSnapshots(MasterItemContainer, configs);
});
