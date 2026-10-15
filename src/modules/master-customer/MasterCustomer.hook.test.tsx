import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

import { MOCK_CUSTOMERS } from "../../fixture/master-customer";
import { useMasterCustomerContainerState, useMasterCustomerNavigation } from "./MasterCustomer.hook";

const mockNavigate = jest.fn();
const mockUseGetCustomersQuery = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("@/services/master-customer.service", () => ({
  mapCustomer: (customer: { readonly id: string; readonly name: string; readonly address: string | null; readonly phone_number: string | null; readonly status: number; readonly created_at: string | null; readonly created_by: string | null }) => ({
    id: customer.id,
    name: customer.name,
    address: customer.address ?? "",
    phoneNumber: customer.phone_number ?? "",
    status: customer.status === 1 ? "active" : "inactive",
    createAt: customer.created_at ?? "",
    createBy: customer.created_by ?? "",
  }),
  useGetCustomersQuery: (...args: unknown[]) => mockUseGetCustomersQuery(...args),
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

  describe("useMasterCustomerNavigation", () => {
    it("should handle navigation correctly", () => {
      const { result } = renderHook(() => useMasterCustomerNavigation());

      act(() => { result.current.goBack(); });
      expect(mockNavigate).toHaveBeenCalledWith(-1);

      act(() => { result.current.goCreate(); });
      expect(mockNavigate).toHaveBeenCalledWith("/master-customer/create");

      const mockCustomer = MOCK_CUSTOMERS[0];
      act(() => { result.current.goEdit(mockCustomer); });
      expect(mockNavigate).toHaveBeenCalledWith(`/master-customer/edit/${mockCustomer.id}`);

      act(() => { result.current.goDetail(mockCustomer); });
      expect(mockNavigate).toHaveBeenCalledWith(`/master-customer/detail/${mockCustomer.id}`);
    });
  });

  describe("useMasterCustomerContainerState", () => {
    it("should initialize with empty API state", () => {
      const { result } = renderHook(() => useMasterCustomerContainerState());

      expect(result.current.pagination.currentPage).toBe(1);
      expect(result.current.pagination.pageSize).toBe(10);
      expect(result.current.pagination.totalCount).toBe(0);
      expect(result.current.pagination.paginatedData).toEqual([]);
      expect(result.current.pagination.isEmpty).toBe(true);
      expect(result.current.pagination.isMissingData).toBe(false);
    });

    it("should expose missing response state", () => {
      mockUseGetCustomersQuery.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
      });

      const { result } = renderHook(() => useMasterCustomerContainerState());

      expect(result.current.pagination.errorMessage).toBe("No response received from server.");
      expect(result.current.pagination.isEmpty).toBe(false);
      expect(result.current.pagination.isMissingData).toBe(true);
    });

    it("should expose missing payload state", () => {
      mockUseGetCustomersQuery.mockReturnValue({
        data: { status: true, messages: null, data: null },
        error: undefined,
        isLoading: false,
      });

      const { result } = renderHook(() => useMasterCustomerContainerState());

      expect(result.current.pagination.errorMessage).toBe("Response is missing data payload.");
      expect(result.current.pagination.isEmpty).toBe(false);
      expect(result.current.pagination.isMissingData).toBe(true);
    });

    it("should expose transport error state", () => {
      mockUseGetCustomersQuery.mockReturnValue({
        data: undefined,
        error: { status: 500, data: "Server error" },
        isLoading: false,
      });

      const { result } = renderHook(() => useMasterCustomerContainerState());

      expect(result.current.pagination.errorMessage).toBe("Unable to load customers.");
      expect(result.current.pagination.isEmpty).toBe(false);
    });

    it("should handle menu and pagination controls", () => {
      const { result } = renderHook(() => useMasterCustomerContainerState());

      act(() => { result.current.toggleMore(); });
      expect(result.current.isMoreOpen).toBe(true);

      act(() => { result.current.goDelete(); });
      expect(result.current.isMoreOpen).toBe(false);

      act(() => { result.current.pagination.changePageSize(5); });
      expect(result.current.pagination.pageSize).toBe(5);

      act(() => { result.current.pagination.goToPage(2); });
      expect(result.current.pagination.currentPage).toBe(1);
    });
  });
});
