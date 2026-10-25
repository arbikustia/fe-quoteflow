import { MasterServiceTypeComponent } from "./MasterServiceType.component";
import test from "../../libs/unit-test";
import type { MasterServiceTypeProps } from "./MasterServiceType.type";

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-25T08:41:24+07:00"));
afterAll(() => jest.useRealTimers());

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");

  return {
    ...actual,
    useLocation: jest.fn().mockReturnValue({ pathname: "/master-service-type" }),
    useNavigate: jest.fn(),
    Link: ({ children }: any) => <a>{children}</a>,
  };
});

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
  goToPage: jest.fn(),
  nextPage: jest.fn(),
  prevPage: jest.fn(),
  changePageSize: jest.fn(),
  setSearchTerm: jest.fn(),
  totalCount: 1,
  isLoading: false,
  errorMessage: null,
  isEmpty: false,
  isMissingData: false,
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  onRowClick: jest.fn(),
  onMore: jest.fn(),
  isMoreOpen: false,
  onCloseMore: jest.fn(),
  onDelete: jest.fn(),
  onBack: jest.fn(),
};

describe("MasterServiceType.component", () => {
  test.assertSnapshots(MasterServiceTypeComponent, [
    { desc: "should match snapshot", props: defaultProps },
    { desc: "should match snapshot when more menu is open", props: { ...defaultProps, isMoreOpen: true } },
  ]);
});
