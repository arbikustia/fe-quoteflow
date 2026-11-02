import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

import { MOCK_ORDER_TYPES } from "../../fixture/master-order-type";
import { useMasterOrderTypeContainerState, useMasterOrderTypeNavigation } from "./MasterOrderType.hook";

const mockNavigate = jest.fn();
const mockUseGetOrderTypesQuery = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("@/services/master-order-type.service", () => ({
  mapOrderType: (orderType: { id: string; name: string; is_handover: boolean; status: number; created_at: string | null; created_by?: string | null }) => ({
    id: orderType.id,
    name: orderType.name,
    isHandover: Boolean(orderType.is_handover),
    status: orderType.status === 1 ? "active" : "inactive",
    createAt: orderType.created_at ?? "",
    createBy: orderType.created_by ?? "",
  }),
  useGetOrderTypesQuery: (...args: unknown[]) => mockUseGetOrderTypesQuery(...args),
}));

describe("MasterOrderType hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetOrderTypesQuery.mockReturnValue({
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

  describe("useMasterOrderTypeNavigation", () => {
    it("should handle navigation correctly", () => {
      const { result } = renderHook(() => useMasterOrderTypeNavigation());

      act(() => { result.current.goBack(); });
      expect(mockNavigate).toHaveBeenCalledWith(-1);

      act(() => { result.current.goCreate(); });
      expect(mockNavigate).toHaveBeenCalledWith("/master-order-type/create");

      const mockOrderType = MOCK_ORDER_TYPES[0];
      act(() => { result.current.goEdit(mockOrderType); });
      expect(mockNavigate).toHaveBeenCalledWith(`/master-order-type/edit/${mockOrderType.id}`, { state: { orderType: mockOrderType } });
    });
  });

  describe("useMasterOrderTypeContainerState", () => {
    it("should initialize with empty API state", () => {
      const { result } = renderHook(() => useMasterOrderTypeContainerState());

      expect(result.current.pagination.currentPage).toBe(1);
      expect(result.current.pagination.pageSize).toBe(10);
      expect(result.current.pagination.totalCount).toBe(0);
      expect(result.current.pagination.paginatedData).toEqual([]);
      expect(result.current.pagination.isEmpty).toBe(true);
      expect(result.current.pagination.isMissingData).toBe(false);
    });

    it("should handle pagination operations", () => {
      mockUseGetOrderTypesQuery.mockReturnValue({
        data: {
          data: [{ id: "1", name: "Rental", is_handover: true, status: 1, created_at: "2026-11-01", created_by: "Admin" }],
          page_number: 1,
          total_pages: 3,
          total_count: 25,
          has_previous: true,
          has_next: true,
        },
        error: undefined,
        isLoading: false,
      });

      const { result } = renderHook(() => useMasterOrderTypeContainerState());

      expect(result.current.pagination.paginatedData).toHaveLength(1);
      expect(result.current.pagination.totalCount).toBe(25);
      expect(result.current.pagination.totalPages).toBe(3);

      act(() => { result.current.pagination.nextPage(); });
      expect(result.current.pagination.currentPage).toBe(2);

      act(() => { result.current.pagination.prevPage(); });
      expect(result.current.pagination.currentPage).toBe(1);

      act(() => { result.current.pagination.changePageSize(20); });
      expect(result.current.pagination.pageSize).toBe(20);
      expect(result.current.pagination.currentPage).toBe(1);

      act(() => { result.current.pagination.setSearchTerm("Rental"); });
      expect(result.current.pagination.currentPage).toBe(1);
    });

    it("should handle toggleMore and closeMore", () => {
      const { result } = renderHook(() => useMasterOrderTypeContainerState());

      expect(result.current.isMoreOpen).toBe(false);

      act(() => { result.current.toggleMore(); });
      expect(result.current.isMoreOpen).toBe(true);

      act(() => { result.current.handleCloseMore(); });
      expect(result.current.isMoreOpen).toBe(false);

      act(() => { result.current.goDelete(); });
      expect(result.current.isMoreOpen).toBe(false);
    });
  });
});
