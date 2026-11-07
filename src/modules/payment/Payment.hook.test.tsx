import { renderHook } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import { useGetPaymentsQuery } from "@/services/payment.service";

import { usePaymentPagination } from "./Payment.hook";

jest.mock("@/services/payment.service", () => ({
  mapPayment: jest.fn(),
  mapPaymentSummary: jest.fn((summary) => summary),
  useGetPaymentsQuery: jest.fn(),
}));

describe("usePaymentPagination", () => {
  it("should expose empty state when API returns no payments", (): void => {
    jest.mocked(useGetPaymentsQuery).mockReturnValue({
      data: {
        status: true,
        data: [],
        messages: [],
        page_number: 1,
        total_pages: 0,
        page_size: 10,
        total_count: 0,
        has_previous: false,
        has_next: false,
      },
      error: undefined,
      isLoading: false,
    } as never);

    const { result } = renderHook(() => usePaymentPagination(), { wrapper: MemoryRouter });

    expect(result.current.paginatedData).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.isEmpty).toBe(true);
  });
});
