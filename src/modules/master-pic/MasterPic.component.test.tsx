import test from "../../libs/unit-test";
import { getColumns } from "./MasterPic.columns";
import { MasterPicComponent } from "./MasterPic.component";
import type { MasterPicProps, PicData } from "./MasterPic.type";

jest.mock("../../app/layout", () =>
  ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
);

jest.mock("../../components/Icons", () => ({
  Icons: { Search: () => <div data-testid="icon-search" /> },
}));

jest.mock("../../components/MobileList", () => ({
  MobileList: () => <div data-testid="mobile-list" />,
}));

jest.mock("../../components/Pagination", () => ({
  Pagination: () => <div data-testid="pagination" />,
}));

jest.mock("../../components/Table", () => () => <div data-testid="table" />);

describe("MasterPic Component", () => {
  const mockPaginatedData: PicData[] = [
    { id: "1", name: "PIC 1", status: "active", createAt: "2024-01-01", createBy: "Admin" },
    { id: "2", name: "PIC 2", status: "inactive", createAt: "2024-01-02", createBy: "Admin" },
  ];

  const mockProps: MasterPicProps = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    paginatedData: mockPaginatedData,
    goToPage: jest.fn(),
    nextPage: jest.fn(),
    prevPage: jest.fn(),
    changePageSize: jest.fn(),
    setSearchTerm: jest.fn(),
    totalCount: 2,
    isEmpty: false,
    isLoading: false,
    isError: false,
    columns: getColumns({ currentPage: 1, pageSize: 10, onEdit: jest.fn() }),
    onCreate: jest.fn(),
    onEdit: jest.fn(),
    onRowClick: jest.fn(),
    onMore: jest.fn(),
    isMoreOpen: false,
    onCloseMore: jest.fn(),
    onDelete: jest.fn(),
    onBack: jest.fn(),
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
