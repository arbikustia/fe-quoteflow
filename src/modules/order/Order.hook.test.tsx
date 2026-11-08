import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { act, renderHook } from "@/libs/unit-test";

import { useOrderPagination, useOrderState } from "./Order.hook";

import * as Router from "react-router-dom";
import * as OrderService from "@/services/order.service";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));
jest.mock("@/services/order.service", () => ({
  mapOrder: jest.fn((order: { id: string; event_name: string }) => ({ id: order.id, name: order.event_name })),
  useGetOrdersQuery: jest.fn(),
}));

describe("Order hooks", (): void => {
  const navigate = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
    jest.mocked(Router.useLocation).mockReturnValue({ pathname: "/order" } as never);
    jest.mocked(Router.useNavigate).mockReturnValue(navigate as never);
    jest.mocked(OrderService.useGetOrdersQuery).mockReturnValue({
      data: {
        status: true,
        data: [{ id: "order-1", event_name: "Annual Meeting" }],
        messages: [],
        page_number: 1,
        total_pages: 3,
        page_size: 10,
        total_count: 21,
        has_previous: false,
        has_next: true,
      },
      isLoading: false,
    } as never);
  });

  it("should paginate, search, and reset the current page", (): void => {
    const { result } = renderHook(() => useOrderPagination());

    expect(result.current.paginatedData).toEqual([{ id: "order-1", name: "Annual Meeting" }]);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.totalCount).toBe(21);
    expect(result.current.isEmpty).toBe(false);

    act((): void => result.current.goToPage(3));
    expect(result.current.currentPage).toBe(3);

    act((): void => result.current.changePageSize(25));
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(25);

    act((): void => result.current.setSearchTerm("annual"));
    expect(OrderService.useGetOrdersQuery).toHaveBeenLastCalledWith(expect.objectContaining({
      pageNumber: 1,
      pageSize: 25,
      searchTerm: "annual",
    }));
  });

  it("should expose query errors and empty successful responses", (): void => {
    jest.mocked(OrderService.useGetOrdersQuery).mockReturnValue({ error: {}, isLoading: false } as never);
    const errorHook = renderHook(() => useOrderPagination());

    expect(errorHook.result.current.errorMessage).toBe("Unable to load orders.");
    expect(errorHook.result.current.isEmpty).toBe(false);

    jest.mocked(OrderService.useGetOrdersQuery).mockReturnValue({
      data: { status: true, data: [], total_pages: 0, total_count: 0 },
      isLoading: false,
    } as never);
    const emptyHook = renderHook(() => useOrderPagination());

    expect(emptyHook.result.current.errorMessage).toBeNull();
    expect(emptyHook.result.current.isEmpty).toBe(true);
  });

  it("should navigate for create, edit, detail, and back actions", (): void => {
    const { result } = renderHook(() => useOrderState());
    const quote = { id: "order-1" } as never;

    expect(result.current.canCreateOrder).toBe(true);
    act((): void => {
      result.current.openCreateModal();
      result.current.openEditModal(quote);
      result.current.onRowClick(quote);
      result.current.onBack();
    });

    expect(navigate).toHaveBeenNthCalledWith(1, "/order/create");
    expect(navigate).toHaveBeenNthCalledWith(2, "/order/edit/order-1");
    expect(navigate).toHaveBeenNthCalledWith(3, "/order/detail/order-1");
    expect(navigate).toHaveBeenNthCalledWith(4, -1);
  });

  it("should disable order creation on the draft route", (): void => {
    jest.mocked(Router.useLocation).mockReturnValue({ pathname: "/order/draft" } as never);

    const { result } = renderHook(() => useOrderState());

    expect(result.current.canCreateOrder).toBe(false);
  });
});
