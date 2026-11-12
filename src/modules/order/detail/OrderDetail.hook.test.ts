import { renderHook } from "@/libs/unit-test";

import { useOrderDetail } from "./OrderDetail.hook";

import * as Router from "react-router-dom";
import * as ProjectService from "@/services/master-project.service";
import * as OrderService from "@/services/order.service";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
  useSearchParams: jest.fn(),
}));
jest.mock("@/services/order.service", () => ({ useGetOrderByIdQuery: jest.fn() }));
jest.mock("@/services/master-project.service", () => ({ useGetAllProjectsQuery: jest.fn() }));

const navigate = jest.fn();

/**
 * Mock the router for one render.
 * @param {object | null} state - Route state
 * @param {string} search - Query string
 * @returns {void} - No return value
 */
const mockRoute = (state: { from?: string; returnUrl?: string } | null, search: string): void => {
  jest.mocked(Router.useLocation).mockReturnValue({ state } as never);
  jest.mocked(Router.useSearchParams).mockReturnValue([new URLSearchParams(search)] as never);
};

describe("useOrderDetail", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    jest.mocked(Router.useNavigate).mockReturnValue(navigate);
    jest.mocked(Router.useParams).mockReturnValue({ id: "order-1" });
    jest.mocked(OrderService.useGetOrderByIdQuery).mockReturnValue({ data: { status: true, data: { id: "order-1" } }, isLoading: false } as never);
    jest.mocked(ProjectService.useGetAllProjectsQuery).mockReturnValue({ data: undefined } as never);
  });

  it("should map the order and navigate to edit and back", (): void => {
    mockRoute(null, "");
    const { result } = renderHook(() => useOrderDetail());

    result.current.onEdit?.();
    result.current.onNavigateBack();

    expect(result.current.order).toEqual({ id: "order-1" });
    expect(result.current.projects).toEqual([]);
    expect(result.current.errorMessage).toBeNull();
    expect(navigate).toHaveBeenCalledWith("/order/edit/order-1", { state: { returnUrl: "/order/detail/order-1" } });
    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it("should go back to the return url and hide edit when opened from the report", (): void => {
    mockRoute({ from: "report", returnUrl: "/report" }, "");
    const { result } = renderHook(() => useOrderDetail());

    result.current.onNavigateBack();

    expect(result.current.onEdit).toBeUndefined();
    expect(result.current.breadcrumbs).toEqual(["Report", "Order Detail"]);
    expect(navigate).toHaveBeenCalledWith("/report");
  });
});
