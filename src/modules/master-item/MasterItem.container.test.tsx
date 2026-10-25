import { fireEvent, render, screen } from "@/libs/unit-test";
import { BrowserRouter } from "react-router-dom";
import MasterItemContainer from "./MasterItem.container";
import { useGetItemsQuery } from "@/services/master-item.service";

jest.mock("@/services/master-item.service", () => ({
  useGetItemsQuery: jest.fn(),
  useCreateItemMutation: jest.fn(),
  mapItem: (item: {
    id: string;
    name: string;
    category_id: string | null;
    price: number | null;
    stock: number | null;
    image: string | null;
    duration: string | null;
    remark: string | null;
    unit: string | null;
    status: number;
    created_at: string | null;
    created_by: string | null;
  }) => ({
    id: item.id,
    name: item.name,
    categoryId: item.category_id ?? "",
    price: item.price ?? 0,
    stock: item.stock ?? 0,
    image: item.image ?? "",
    duration: item.duration ?? 0,
    remark: item.remark ?? "",
    status: item.status === 1 ? "active" : "inactive",
    createAt: item.created_at ?? "",
    createBy: item.created_by ?? "",
  }),
}));

const mockQueryResult = {
  data: {
    status: true,
    messages: null,
    data: [
      {
        id: "1",
        name: "Line Array Speaker",
        category_id: "Audio System",
        price: 5000000,
        stock: 12,
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=200&auto=format&fit=crop",
        duration: 3,
        remark: "High quality sound",
        status: 1,
        created_at: "2024-01-01 10:00",
        created_by: "Admin",
      },
    ],
    page_number: 1,
    total_pages: 2,
    page_size: 10,
    total_count: 11,
    has_previous: false,
    has_next: true,
  },
  error: undefined,
  isLoading: false,
  refetch: jest.fn(),
};

describe("MasterItem Container", () => {
  it("should render component while query resolves from API", () => {
    jest.mocked(useGetItemsQuery).mockReturnValue(
      mockQueryResult as ReturnType<typeof useGetItemsQuery>,
    );

    render(
      <BrowserRouter>
        <MasterItemContainer />
      </BrowserRouter>,
    );

    expect(screen.getAllByText("Line Array Speaker")).toHaveLength(3);
    expect(useGetItemsQuery).toHaveBeenCalledWith({
      pageNumber: 1,
      pageSize: 10,
      searchTerm: "",
    });
  });

  it("should refetch with search term when search input changes", () => {
    jest.mocked(useGetItemsQuery).mockReturnValue(
      mockQueryResult as ReturnType<typeof useGetItemsQuery>,
    );

    render(
      <BrowserRouter>
        <MasterItemContainer />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getAllByPlaceholderText("Search item")[0], {
      target: { value: "speaker" },
    });

    expect(useGetItemsQuery).toHaveBeenLastCalledWith({
      pageNumber: 1,
      pageSize: 10,
      searchTerm: "speaker",
    });
  });
});
