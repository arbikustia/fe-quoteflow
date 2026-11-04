import { act, renderHook } from "@testing-library/react";

import { useGetRentalReturnsPagedQuery } from "@/services/rental-return.service";

import { mapReturn, useItemReturnList, useItemReturnNavigation } from "./ItemReturn.hook";
import type { ApiReturn, ReturnRow } from "./ItemReturn.type";

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

  describe("mapReturn", () => {
    it("should map active return correctly", () => {
      const item: ApiReturn = {
        id: "return-1",
        order_id: "order-123",
        return_date: "2026-11-03T10:00:00.000Z",
        notes: "Good condition",
        status: 1,
        created_at: "2026-11-03T10:00:00.000Z",
        updated_at: "2026-11-03T10:00:00.000Z",
        items: [
          {
            id: "item-1",
            return_id: "return-1",
            item_id: "inv-1",
            qty: 2,
            condition: "good",
            notes: "",
            file_url: "",
            file_name: "",
            status: 1,
            created_at: "2026-11-03T10:00:00.000Z",
            updated_at: "2026-11-03T10:00:00.000Z",
          },
        ],
      };

      const mapped = mapReturn(item);

      expect(mapped.id).toBe("return-1");
      expect(mapped.orderId).toBe("order-123");
      expect(mapped.itemCount).toBe(1);
      expect(mapped.status).toBe("active");
      expect(mapped.notes).toBe("Good condition");
    });

    it("should map inactive and null status", () => {
      const itemInactive: ApiReturn = {
        id: "return-2",
        order_id: "order-456",
        return_date: "2026-11-03T10:00:00.000Z",
        notes: "",
        status: 0,
        created_at: "",
        updated_at: "",
        items: [],
      };

      expect(mapReturn(itemInactive).status).toBe("inactive");
      expect(mapReturn(itemInactive).notes).toBe("-");

      const itemNull: ApiReturn = {
        ...itemInactive,
        status: null,
      };

      expect(mapReturn(itemNull).status).toBe("unavailable");
    });
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
      } as unknown as ReturnType<typeof useGetRentalReturnsPagedQuery>);

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
      } as unknown as ReturnType<typeof useGetRentalReturnsPagedQuery>);

      const { result } = renderHook(() => useItemReturnList());

      expect(result.current.errorMessage).toBe("Unable to load item returns.");
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
        orderId: "order-99",
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
