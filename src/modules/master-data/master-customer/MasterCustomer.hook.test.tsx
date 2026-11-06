import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { act, renderHook } from "@/libs/unit-test";
import { MOCK_CUSTOMERS } from "../../../fixture/master-customer";
import { useMasterCustomerNavigation, useMasterCustomerPagination } from "./MasterCustomer.hook";

const mockNavigate = jest.fn();
const mockUseGetCustomersQuery = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("@/services/master-customer.service", () => ({
  mapCustomer: (customer: {
    id: string;
    name: string;
    email?: string;
    address?: string;
    phone_number?: string;
    status: number;
    created_at?: string;
    created_by?: string;
  }) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email || "",
    address: customer.address || "",
    phoneNumber: customer.phone_number || "",
    status: customer.status === 1 ? "active" : "inactive",
    createAt: customer.created_at || "",
    createBy: customer.created_by || "",
  }),
  useGetCustomersQuery: (...args: never[]) => mockUseGetCustomersQuery(...args),
}));

describe("MasterCustomer hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetCustomersQuery.mockReturnValue({
      data: {
        data: [],
        page_number: 1,
        total_pages: 1,
        total_count: 0,
        has_previous: false,
        has_next: false,
      },
      error: undefined,
      isLoading: false,
    });
  });

  it("should handle navigation", () => {
    const { result } = renderHook(() => useMasterCustomerNavigation());

    act(result.current.goBack);
    expect(mockNavigate).toHaveBeenCalledWith("/master-main");

    act(result.current.goCreate);
    expect(mockNavigate).toHaveBeenCalledWith("/master-customer/create");

    const customer = MOCK_CUSTOMERS[0];
    act(() => result.current.goEdit(customer));
    expect(mockNavigate).toHaveBeenCalledWith(`/master-customer/edit/${customer.id}`, {
      state: { customer },
    });
  });

  it("should expose empty pagination state", () => {
    const { result } = renderHook(() => useMasterCustomerPagination());

    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.paginatedData).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.isMissingData).toBe(false);
  });

  it("should expose missing response state", () => {
    mockUseGetCustomersQuery.mockReturnValue({ data: undefined, error: undefined, isLoading: false });

    const { result } = renderHook(() => useMasterCustomerPagination());

    expect(result.current.errorMessage).toBe("Response is missing data.");
    expect(result.current.isEmpty).toBe(false);
    expect(result.current.isMissingData).toBe(true);
  });

  it("should expose transport error state", () => {
    mockUseGetCustomersQuery.mockReturnValue({
      data: undefined,
      error: { status: 500, data: "Server error" },
      isLoading: false,
    });

    const { result } = renderHook(() => useMasterCustomerPagination());

    expect(result.current.errorMessage).toBe("Unable to load customers.");
    expect(result.current.isEmpty).toBe(false);
  });

  it("should handle pagination controls", () => {
    const { result } = renderHook(() => useMasterCustomerPagination());

    act(() => result.current.changePageSize(5));
    expect(result.current.pageSize).toBe(5);

    act(() => result.current.goToPage(2));
    expect(result.current.currentPage).toBe(1);
  });
});
