import { act, renderHook } from "@/libs/unit-test";

import { usePaymentNavigation, usePaymentPagination } from "./Payment.hook";

import * as Router from "react-router-dom";
import { useGetPaymentsQuery } from "@/services/payment.service";

jest.mock("react-router-dom", () => ({ useNavigate: jest.fn() }));
jest.mock("@/services/payment.service", () => ({
  mapPaymentSummary: jest.fn((summary) => summary),
  useGetPaymentsQuery: jest.fn(),
}));

const navigate = jest.fn();

/**
 * Mock the payments query result.
 * @param {object} result - Query result
 * @returns {void} - Nothing
 */
const mockQuery = (result: object): void => {
  jest.mocked(useGetPaymentsQuery).mockReturnValue(result as never);
};

describe("usePaymentPagination", (): void => {
  it("should expose empty state when API returns no payments", (): void => {
    mockQuery({ data: { status: true, data: [], total_pages: 0, total_count: 0 }, error: undefined, isLoading: false });
    const { result } = renderHook(() => usePaymentPagination());

    expect(result.current).toMatchObject({ paginatedData: [], totalCount: 0, totalPages: 1, isEmpty: true });
  });

  it("should bound the page and reset it on search or page size change", (): void => {
    mockQuery({ data: { status: true, data: [{ id: "a" }], total_pages: 3, total_count: 25 }, error: undefined, isLoading: false });
    const { result } = renderHook(() => usePaymentPagination());

    act(() => result.current.goToPage(99));
    expect(result.current.currentPage).toBe(3);
    act(() => result.current.setSearchTerm("x"));
    expect(result.current.currentPage).toBe(1);
    act(() => result.current.goToPage(2));
    act(() => result.current.changePageSize(20));
    expect(result.current).toMatchObject({ currentPage: 1, pageSize: 20 });
  });

  it("should resolve query, missing and envelope error messages", (): void => {
    mockQuery({ data: undefined, error: new Error("x"), isLoading: false });
    expect(renderHook(() => usePaymentPagination()).result.current.errorMessage).toBe("Unable to load payments.");

    mockQuery({ data: undefined, error: undefined, isLoading: false });
    expect(renderHook(() => usePaymentPagination()).result.current.errorMessage).toBe("No response received from server.");

    mockQuery({ data: { status: false }, error: undefined, isLoading: false });
    expect(renderHook(() => usePaymentPagination()).result.current.errorMessage).toBe("Payment data is unavailable.");
  });
});

describe("usePaymentNavigation", (): void => {
  it("should navigate back, to create, and to detail with the payment as state", (): void => {
    jest.mocked(Router.useNavigate).mockReturnValue(navigate);
    const { result } = renderHook(() => usePaymentNavigation());
    const payment = { invoiceNo: "INV-1" } as never;

    result.current.onBack();
    result.current.onCreate?.();
    result.current.onDetail?.(payment);
    result.current.onRowClick(payment);

    expect(navigate).toHaveBeenCalledWith("/document");
    expect(navigate).toHaveBeenCalledWith("/document/payment/create");
    expect(navigate).toHaveBeenCalledWith("/document/payment/INV-1", { state: payment });
    expect(navigate).toHaveBeenCalledTimes(4);
  });
});
