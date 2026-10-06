import { describe, vi } from "vitest";
import { MasterPicComponent } from "./MasterPic.component";
import test from "../../libs/unit-test";
import { getColumns } from "./MasterPic.columns";

vi.mock("../../app/layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

vi.mock("../../components/Icons", () => ({
  Icons: { Search: () => <div data-testid="icon-search" /> },
}));

vi.mock("../../components/MobileList", () => ({
  MobileList: () => <div data-testid="mobile-list" />,
}));

vi.mock("../../components/Pagination", () => ({
  PaginationFooter: () => <div data-testid="pagination-footer" />,
  PaginationHeader: () => <div data-testid="pagination-header" />,
}));

vi.mock("../../components/Table", () => ({
  default: () => <div data-testid="table" />,
}));

describe("MasterPic Component", () => {
  const mockProps = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    paginatedData: [
      { id: "1", name: "PIC 1", status: "active", createAt: "2024-01-01", createBy: "Admin" },
      { id: "2", name: "PIC 2", status: "inactive", createAt: "2024-01-02", createBy: "Admin" },
    ] as any[],
    goToPage: vi.fn(),
    nextPage: vi.fn(),
    prevPage: vi.fn(),
    changePageSize: vi.fn(),
    totalCount: 2,
    columns: getColumns({ currentPage: 1, pageSize: 10, onEdit: vi.fn() }),
    onCreate: vi.fn(),
    onEdit: vi.fn(),
    onRowClick: vi.fn(),
    onMore: vi.fn(),
    isMoreOpen: false,
    onCloseMore: vi.fn(),
    onDelete: vi.fn(),
    onBack: vi.fn(),
  };

  test.assertSnapshots(MasterPicComponent, [
    {
      props: mockProps,
      desc: "default state",
    },
    {
      props: { ...mockProps, isMoreOpen: true },
      desc: "more open state",
    },
  ]);
});
