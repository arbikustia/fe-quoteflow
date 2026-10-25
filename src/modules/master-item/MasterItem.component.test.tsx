import { render, screen, fireEvent } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";
import { MasterItemComponent } from "./MasterItem.component";
import type { ItemData } from "./MasterItem.type";

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-18T00:31:00+07:00"));

afterAll(() => jest.useRealTimers());

const mockItems: ItemData[] = [
  { id: "1", name: "Speaker", categoryId: "Audio", categoryName: "Audio", price: 5000000, stock: 12, image: "https://example.com/a.jpg", duration: 3, remark: "ok", status: "active", createAt: "2024-01-01", createBy: "Admin" },
  { id: "2", name: "Light", categoryId: "Lighting", categoryName: "Lighting", price: 600000, stock: 5, image: "https://example.com/b.jpg", duration: 1, remark: "sharp", status: "inactive", createAt: "2024-01-02", createBy: "Admin" },
];

const mockColumns: any[] = [{ key: "name", header: "Item Name" }];

const defaultProps = {
  paginatedData: mockItems,
  columns: mockColumns,
  currentPage: 1,
  totalPages: 2,
  pageSize: 5,
  totalCount: 10,
  isLoading: false,
  errorMessage: null,
  isEmpty: false,
  isMissingData: false,
  goToPage: jest.fn(),
  nextPage: jest.fn(),
  prevPage: jest.fn(),
  changePageSize: jest.fn(),
  setSearchTerm: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  onBack: jest.fn(),
  onMore: jest.fn(),
  isMoreOpen: false,
  onCloseMore: jest.fn(),
  onDelete: jest.fn(),
};

const renderWithRouter = (props = defaultProps) =>
  render(
    <MemoryRouter>
      <MasterItemComponent {...props} />
    </MemoryRouter>
  );

describe("MasterItemComponent", () => {
  it("should render without crashing", () => {
    renderWithRouter();
    expect(screen.getAllByText("Item List").length).toBeGreaterThan(0);
  });

  it("should handle empty data", () => {
    renderWithRouter({ ...defaultProps, paginatedData: [] as ItemData[], totalCount: 0, totalPages: 1 });
    expect(screen.getAllByText("Item List").length).toBeGreaterThan(0);
  });

  it("calls onBack when back button clicked", () => {
    const onBack = jest.fn();
    renderWithRouter({ ...defaultProps, onBack });
    fireEvent.click(screen.getByLabelText("Back"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MasterItemComponent {...defaultProps} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with empty data and closed menu", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MasterItemComponent {...{ ...defaultProps, paginatedData: [] as ItemData[], totalCount: 0, totalPages: 1, isMoreOpen: false }} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
