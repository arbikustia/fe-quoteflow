import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { useMasterCustomerNavigation, useMasterCustomerContainerState } from "./MasterCustomer.hook";
import { MOCK_CUSTOMERS } from "../../fixture/master-customer";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("MasterCustomer hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useMasterCustomerNavigation", () => {
    it("should handle navigation correctly", () => {
      const { result } = renderHook(() => useMasterCustomerNavigation());

      act(() => {
        result.current.goBack();
      });
      expect(mockNavigate).toHaveBeenCalledWith(-1);

      act(() => {
        result.current.goCreate();
      });
      expect(mockNavigate).toHaveBeenCalledWith("/master-customer/create");

      const mockCustomer = MOCK_CUSTOMERS[0];
      act(() => {
        result.current.goEdit(mockCustomer);
      });
      expect(mockNavigate).toHaveBeenCalledWith(`/master-customer/edit/${mockCustomer.id}`);

      act(() => {
        result.current.goDetail(mockCustomer);
      });
      expect(mockNavigate).toHaveBeenCalledWith(`/master-customer/detail/${mockCustomer.id}`);
    });
  });

  describe("useMasterCustomerContainerState", () => {
    it("should initialize with correct default state", () => {
      const { result } = renderHook(() => useMasterCustomerContainerState());

      expect(result.current.pagination.currentPage).toBe(1);
      expect(result.current.pagination.pageSize).toBe(10);
      expect(result.current.isMoreOpen).toBe(false);
      expect(result.current.pagination.totalCount).toBe(MOCK_CUSTOMERS.length);
      expect(result.current.pagination.paginatedData).toEqual(MOCK_CUSTOMERS.slice(0, 10));
    });

    it("should handle more menu toggle", () => {
      const { result } = renderHook(() => useMasterCustomerContainerState());

      act(() => {
        result.current.toggleMore();
      });
      expect(result.current.isMoreOpen).toBe(true);

      act(() => {
        result.current.handleCloseMore();
      });
      expect(result.current.isMoreOpen).toBe(false);
    });

    it("should handle delete action", () => {
      const { result } = renderHook(() => useMasterCustomerContainerState());

      act(() => {
        result.current.toggleMore();
      });
      expect(result.current.isMoreOpen).toBe(true);

      act(() => {
        result.current.goDelete();
      });
      // goDelete should close the more menu
      expect(result.current.isMoreOpen).toBe(false);
    });

    it("should handle pagination", () => {
      const { result } = renderHook(() => useMasterCustomerContainerState());

      act(() => {
        result.current.pagination.changePageSize(5);
      });
      expect(result.current.pagination.pageSize).toBe(5);

      act(() => {
        result.current.pagination.nextPage();
      });
      expect(result.current.pagination.currentPage).toBe(2);

      act(() => {
        result.current.pagination.prevPage();
      });
      expect(result.current.pagination.currentPage).toBe(1);
    });
  });
});
