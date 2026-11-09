import { act, renderHook } from "@/libs/unit-test";
import { useGetRentalChecklistsQuery, useLazyGetRentalChecklistByIdQuery } from "@/services/rental-checklist.service";
import { useGetRentalOrderOptionsQuery } from "@/services/rental-order.service";
import { useNavigate } from "react-router-dom";

import { useItemChecklistList, useItemChecklistNavigation, useItemChecklistState } from "./ItemChecklist.hook";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("@/services/rental-checklist.service", () => ({
  useGetRentalChecklistsQuery: jest.fn(),
  useLazyGetRentalChecklistByIdQuery: jest.fn(),
}));

jest.mock("@/services/rental-order.service", () => ({
  useGetRentalOrderOptionsQuery: jest.fn(),
}));

jest.mock("@/hooks/useMasterActivityLog", () => ({
  useMasterActivityLog: () => ({
    logView: jest.fn().mockResolvedValue({}),
  }),
}));

describe("ItemChecklist.hook", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLazyGetRentalChecklistByIdQuery as jest.Mock).mockReturnValue([
      jest.fn().mockReturnValue({ unwrap: jest.fn().mockResolvedValue({ status: true, data: { id: "1", order_id: "ord-1", items: [] } }) }),
    ]);
    (useGetRentalOrderOptionsQuery as jest.Mock).mockReturnValue({
      data: { status: true, data: [{ id: "ord-1", invoice: { quotation: { transaction: { customer_name: "Cust 1" } } } }] },
    });
    (useGetRentalChecklistsQuery as jest.Mock).mockImplementation((args) => ({
      data: {
        status: true,
        data: [
          {
            id: "1",
            checklist_no: "CHK-001",
            checklist_date: "2023-01-01",
            status: 2,
            order_id: "ord-1",
            items: [{}],
          },
        ],
        total_pages: args.pageNumber === 1 ? 5 : 5,
        total_count: 1,
      },
      isLoading: false,
      error: null,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle navigation actions", () => {
    const { result } = renderHook(() => useItemChecklistNavigation());

    act(() => {
      result.current.onBack();
    });
    expect(mockNavigate).toHaveBeenCalledWith("/home");

    act(() => {
      result.current.onCreate();
    });
    expect(mockNavigate).toHaveBeenCalledWith("/item-checklist/create");

    act(() => {
      result.current.onRowClick({ id: "1" } as any);
    });
    expect(mockNavigate).toHaveBeenCalledWith("/item-checklist/1");

    act(() => {
      result.current.onEdit({ id: "1" } as any);
    });
    expect(mockNavigate).toHaveBeenCalledWith("/item-checklist/create/1");
  });

  it("should return list state and handle pagination", () => {
    const { result } = renderHook(() => useItemChecklistList());

    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0].customerName).toBe("Cust 1");
    expect(result.current.rows[0].status).toBe("active");

    act(() => {
      result.current.goToPage(2);
    });
    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.setSearchTerm("test");
    });
    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.changePageSize(20);
    });
    expect(result.current.pageSize).toBe(20);
  });

  it("should compose state correctly", () => {
    const { result } = renderHook(() => useItemChecklistState());
    expect(result.current.rows).toBeDefined();
    expect(result.current.onBack).toBeDefined();
  });
});
