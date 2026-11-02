import { renderHook } from "@testing-library/react";

import { useGetRentalOrdersQuery } from "@/services/rental-order.service";

import { useDashboardOrders } from "./Dashboard.hook";

jest.mock("@/services/rental-order.service", () => ({
  useGetRentalOrdersQuery: jest.fn(),
  mapRentalOrder: jest.fn((order: { id: string; transaction_id: string; order_no: string }) => ({
    id: order.id,
    transactionId: order.transaction_id,
    eventName: order.order_no,
    customerName: "Customer",
    startDate: "2026-11-01",
    endDate: "2026-11-02",
    grandTotal: 1000,
    status: 1,
  })),
}));

const mockQuery = jest.mocked(useGetRentalOrdersQuery);

describe("useDashboardOrders", () => {
  it("should map rental orders and use transaction ID for order detail", (): void => {
    mockQuery.mockImplementation(jest.fn().mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: { status: true, data: [{ id: "rental-1", transaction_id: "transaction-1", order_no: "RO-1", created_at: "2026-11-01" }] },
    }));

    const { result } = renderHook(useDashboardOrders);

    expect(mockQuery).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 3, searchTerm: "" });
    expect(result.current.orders).toEqual([expect.objectContaining({ id: "transaction-1", eventName: "RO-1", grandTotal: 1000 })]);
    expect(result.current.isError).toBe(false);
  });

  it("should report API error instead of empty data", (): void => {
    mockQuery.mockImplementation(jest.fn().mockReturnValue({ isLoading: false, isFetching: false, isError: true }));

    const { result } = renderHook(useDashboardOrders);

    expect(result.current).toEqual({ isLoading: false, isError: true, orders: [] });
  });
});
