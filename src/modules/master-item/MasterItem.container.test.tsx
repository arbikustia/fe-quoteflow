import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { getColumns } from "./MasterItem.columns";
import MasterItemContainer from "./MasterItem.container";
import { useGetItemsQuery } from "@/services/master-item.service";
import type { ItemData } from "./MasterItem.type";

jest.mock("@/services/master-item.service", () => ({
  useGetItemsQuery: jest.fn(),
  useCreateItemMutation: jest.fn(),
  mapItem: (item: {
    readonly id: string;
    readonly name: string;
    readonly category_id: string | null;
    readonly price: number | null;
    readonly stock: number | null;
    readonly image: string | null;
    readonly duration: string | null;
    readonly remark: string | null;
    readonly unit: string | null;
    readonly status: number;
    readonly created_at: string | null;
    readonly created_by: string | null;
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

describe("getColumns", () => {
  const mockOnEdit = jest.fn();
  const base: ItemData = {
    id: "1",
    name: "Speaker",
    categoryId: "Audio",
    categoryName: "Audio System",
    price: 5000000,
    stock: 12,
    image: "https://example.com/a.jpg",
    duration: 3,
    remark: "ok",
    status: "active",
    createAt: "2024-01-01",
    createBy: "Admin",
  };
  const inactive: ItemData = {
    id: "2",
    name: "Light",
    categoryId: "Lighting",
    categoryName: "Lighting System",
    price: 600000,
    stock: 5,
    image: "https://example.com/b.jpg",
    duration: 1,
    remark: "sharp",
    status: "inactive",
    createAt: "2024-01-02",
    createBy: "Admin",
  };

  it("returns 10 columns with correct keys", () => {
    const cols = getColumns({
      currentPage: 1,
      pageSize: 5,
      onEdit: mockOnEdit,
    });
    expect(cols).toHaveLength(10);
    expect(cols.map((c) => c.key)).toEqual([
      "no",
      "image",
      "name",
      "categoryName",
      "price",
      "stock",
      "duration",
      "status",
      "remark",
      "actions",
    ]);
  });

  it("no column render calculates correct number", () => {
    const cols = getColumns({
      currentPage: 2,
      pageSize: 5,
      onEdit: mockOnEdit,
    });
    const noCol = cols.find((c) => c.key === "no")!;
    const el = (noCol.render as any)(base, 0) as any;
    const { container } = render(<MemoryRouter>{el}</MemoryRouter>);
    expect(container.textContent).toBe("6");
    const el2 = (noCol.render as any)(base, 4) as any;
    const { container: c2 } = render(<MemoryRouter>{el2}</MemoryRouter>);
    expect(c2.textContent).toBe("10");
  });

  it("status column renders active and inactive", () => {
    const cols = getColumns({
      currentPage: 1,
      pageSize: 5,
      onEdit: mockOnEdit,
    });
    const statusCol = cols.find((c) => c.key === "status")!;
    const activeEl = (statusCol.render as any)(base) as any;
    const { container: ca } = render(<MemoryRouter>{activeEl}</MemoryRouter>);
    expect(ca.textContent).toBe("active");
    expect(ca.innerHTML).toContain("bg-green-100");
    const inactiveEl = (statusCol.render as any)(inactive) as any;
    const { container: ci } = render(<MemoryRouter>{inactiveEl}</MemoryRouter>);
    expect(ci.textContent).toBe("inactive");
    expect(ci.innerHTML).toContain("bg-red-100");
  });

  it("price column formats correctly", () => {
    const cols = getColumns({
      currentPage: 1,
      pageSize: 5,
      onEdit: mockOnEdit,
    });
    const priceCol = cols.find((c) => c.key === "price")!;
    expect((priceCol.render as any)(base)).toBe(
      "Rp " + base.price.toLocaleString("id-ID"),
    );
  });

  it("actions column calls onEdit with stopPropagation", () => {
    const onEdit = jest.fn();
    const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit });
    const actionsCol = cols.find((c) => c.key === "actions")!;
    const el = (actionsCol.render as any)(base) as any;
    const { container } = render(<MemoryRouter>{el}</MemoryRouter>);
    const button = container.querySelector("button")!;
    fireEvent.click(button);
    expect(onEdit).toHaveBeenCalledWith(base);
  });

  it("image column renders clickable file name", () => {
    const cols = getColumns({
      currentPage: 1,
      pageSize: 5,
      onEdit: mockOnEdit,
    });
    const imageColumn = cols.find((column) => column.key === "image")!;
    const element = (imageColumn.render as any)(base) as any;
    const { container } = render(<MemoryRouter>{element}</MemoryRouter>);
    const link = container.querySelector("a")!;
    expect(link).toBeTruthy();
    expect(link.textContent).toBe("a.jpg");
    expect(link.getAttribute("href")).toBe(base.image);
    expect(link.getAttribute("target")).toBe("_blank");
  });
});