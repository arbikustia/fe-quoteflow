import { describe, vi } from "vitest";
import { MasterServiceTypeComponent } from "./MasterServiceType.component";
import test from "../../libs/unit-test";
import type { MasterServiceTypeProps } from "./MasterServiceType.type";

vi.mock("react-router-dom", () => ({
  useLocation: vi.fn().mockReturnValue({ pathname: "/master-service-type" }),
  useNavigate: vi.fn(),
  Link: ({ children }: any) => <a>{children}</a>,
}));

const defaultProps: MasterServiceTypeProps = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  paginatedData: [
    {
      id: "1",
      name: "Standard Delivery",
      price: 50000,
      isActive: true,
      status: "active",
      createAt: "2024-01-01",
      createBy: "Admin",
    },
  ],
  goToPage: vi.fn(),
  nextPage: vi.fn(),
  prevPage: vi.fn(),
  changePageSize: vi.fn(),
  totalCount: 1,
  columns: [],
  onCreate: vi.fn(),
  onEdit: vi.fn(),
  onRowClick: vi.fn(),
  onMore: vi.fn(),
  isMoreOpen: false,
  onCloseMore: vi.fn(),
  onDelete: vi.fn(),
  onBack: vi.fn(),
};

describe("MasterServiceType.component", () => {
  test.assertSnapshots(MasterServiceTypeComponent, [
    { desc: "should match snapshot", props: defaultProps },
    { desc: "should match snapshot when more menu is open", props: { ...defaultProps, isMoreOpen: true } },
  ]);
});
