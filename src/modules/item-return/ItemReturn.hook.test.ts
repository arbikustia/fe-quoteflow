import { act, renderHook } from "@/libs/unit-test";
import { useGetRentalReturnsPagedQuery } from "@/services/rental-return.service";

import { useItemReturnList, useItemReturnNavigation, useItemReturnState } from "./ItemReturn.hook";
import type { ReturnRow } from "./ItemReturn.type";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@/services/rental-return.service", () => ({
  useGetRentalReturnsPagedQuery: jest.fn(),
}));

jest.mock("@/services/activity-log.service", () => ({
  useCreateActivityLogMutation: () => [jest.fn().mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) }), { isLoading: false }],
}));

const mockQuery = jest.mocked(useGetRentalReturnsPagedQuery);

describe("ItemReturn.hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useItemReturnList", () => {
    it("should fetch returns and handle pagination", () => {
      mockQuery.mockReturnValue({
        data: {
          status: true,
          data: [],
          messages: [],
          page_number: 1,
          total_pages: 5,
          page_size: 10,
          total_count: 50,
          has_previous: false,
          has_next: true,
        },
        isLoading: false,
        error: undefined,
      } as never);

      const { result } = renderHook(() => useItemReturnList());

      expect(mockQuery).toHaveBeenCalledWith({
        pageNumber: 1,
        pageSize: 10,
        searchTerm: "",
      });

      act(() => {
        result.current.setSearchTerm("order");
      });

      expect(result.current.currentPage).toBe(1);

      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.currentPage).toBe(3);

      act(() => {
        result.current.changePageSize(20);
      });

      expect(result.current.pageSize).toBe(20);
      expect(result.current.currentPage).toBe(1);
    });

    it("should handle error state", () => {
      mockQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: { message: "Network error" },
      } as never);

      const { result } = renderHook(() => useItemReturnList());

      expect(result.current.errorMessage).toBe("Unable to load item returns.");
      expect(result.current.isEmpty).toBe(false);
    });

    it("should map rows and API failure message", () => {
      mockQuery.mockReturnValue({
        data: { status: false, data: [], messages: ["Denied"], total_pages: 0, total_count: 0 },
        isLoading: false,
        error: undefined,
      } as never);

      const { result } = renderHook(() => useItemReturnState());

      expect(result.current.errorMessage).toBe("Denied");
      expect(result.current.rows).toEqual([]);
      expect(typeof result.current.onCreate).toBe("function");
    });

    it("should map successful rows", () => {
      mockQuery.mockReturnValue({
        data: { status: true, data: [{ id: "r-1", return_date: "2026-11-01T08:00:00", notes: "", status: 1, items: [] }], messages: [], total_pages: 1, total_count: 1 },
        isLoading: false,
        error: undefined,
      } as never);

      const { result } = renderHook(() => useItemReturnList());

      expect(result.current.rows[0]?.id).toBe("r-1");
      expect(result.current.isEmpty).toBe(false);
    });
  });

  describe("useItemReturnNavigation", () => {
    it("should navigate to home on back and not to document", () => {
      const { result } = renderHook(() => useItemReturnNavigation());

      result.current.onBack();
      expect(mockNavigate).toHaveBeenCalledWith("/home");
      expect(mockNavigate).not.toHaveBeenCalledWith("/document");
    });

    it("should navigate to create return", () => {
      const { result } = renderHook(() => useItemReturnNavigation());

      result.current.onCreate();
      expect(mockNavigate).toHaveBeenCalledWith("/item-return/create");
    });

    it("should navigate to edit and row click", () => {
      const { result } = renderHook(() => useItemReturnNavigation());
      const row: ReturnRow = {
        id: "return-99",
        customerName: "Customer 99",
        returnDate: "2026-11-03",
        itemCount: 1,
        notes: "test",
        status: "active",
      };

      result.current.onEdit(row);
      expect(mockNavigate).toHaveBeenCalledWith("/item-return/create/return-99");

      result.current.onRowClick(row);
      expect(mockNavigate).toHaveBeenCalledWith("/item-return/create/return-99");
    });
  });
});
