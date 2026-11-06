import test from "@/libs/unit-test";

import MasterItemContainer from "./MasterItem.container";

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-18T00:31:00+07:00"));

afterAll(() => jest.useRealTimers());

const mockApiItem = {
  id: "1",
  name: "Line Array Speaker",
  category_id: "Audio System",
  price: 5000000,
  stock: 12,
  image: "https://example.com/a.jpg",
  duration: 3,
  remark: "High quality sound",
  status: 1,
  created_at: "2024-01-01",
  created_by: "Admin",
};

jest.mock("@/services/master-item.service", () => ({
  mapItem: jest.fn(() => ({
    id: "1",
    name: "Line Array Speaker",
    categoryId: "Audio System",
    price: 5000000,
    stock: 12,
    image: "https://example.com/a.jpg",
    duration: 3,
    remark: "High quality sound",
    status: "active",
    createAt: "2024-01-01",
    createBy: "Admin",
  })),
  useGetItemsQuery: jest.fn(() => ({
    data: {
      status: true,
      messages: null,
      data: [mockApiItem],
      page_number: 1,
      total_pages: 1,
      total_count: 1,
      has_previous: false,
      has_next: false,
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
