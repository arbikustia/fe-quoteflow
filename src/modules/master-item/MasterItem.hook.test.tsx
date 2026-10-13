import { act, renderHook } from "@testing-library/react";

import { useGetItemsQuery } from "./MasterItem.api";
import { useMasterItemContainerState, useMasterItemNavigation, useMasterItemState } from "./MasterItem.hook";
import type { ItemData } from "./MasterItem.type";

const mockNavigate = jest.fn();
const mockedGetItemsQuery = jest.mocked(useGetItemsQuery);

jest.mock("./MasterItem.api", () => ({
  _mapItem: (item: {
    readonly id: string;
    readonly name: string;
    readonly category: string | null;
    readonly price: number | null;
    readonly stock: number | null;
    readonly image: string | null;
    readonly duration: string | null;
    readonly remark: string | null;
    readonly unit: string | null;
    readonly status: number;
    readonly created_at: string | null;
    readonly created_by: string | null;
  }) => ({
    id: item.id,
    name: item.name,
    category: item.category ?? "",
    price: item.price ?? 0,
    stock: item.stock ?? 0,
    image: item.image ?? "",
    duration: item.duration ?? "",
    remark: item.remark ?? "",
    unit: item.unit ?? "",
    status: item.status === 1 ? "active" : "inactive",
    createAt: item.created_at ?? "",
    createBy: item.created_by ?? "",
  }),
  useGetItemsQuery: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const successfulEmptyResponse = {
  data: {
    status: true,
    messages: null,
    data: {
      data: [],
      page_number: 1,
      total_pages: 1,
      total_count: 0,
      has_previous: false,
      has_next: false,
    },
  },
  error: undefined,
  isLoading: false,
};

describe("MasterItem hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("useMasterItemState", () => {
    it("initial state", () => {
      const { result } = renderHook(() => useMasterItemState());
      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.editingItem).toBeNull();
      expect(result.current.isConfirmModalOpen).toBe(false);
      expect(result.current.deletingItem).toBeNull();
    });

    it("openCreateModal and closeModal", () => {
      const { result } = renderHook(() => useMasterItemState());
      act(() => result.current.openCreateModal());
      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingItem).toBeNull();
      act(() => result.current.closeModal());
      expect(result.current.isModalOpen).toBe(false);
      act(() => { jest.advanceTimersByTime(250); });
      expect(result.current.editingItem).toBeNull();
    });

    it("openEditModal sets editingItem", () => {
      const mockItem: ItemData = {
        id: "1",
        name: "Speaker",
        category: "Audio",
        price: 5000000,
        stock: 12,
        image: "https://example.com/a.jpg",
        duration: "3 days",
        remark: "ok",
        unit: "unit",
        status: "active",
        createAt: "2024-01-01",
        createBy: "Admin",
      };
      const { result } = renderHook(() => useMasterItemState());
      act(() => result.current.openEditModal(mockItem));
      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingItem).toEqual(mockItem);
      act(() => result.current.closeModal());
      expect(result.current.isModalOpen).toBe(false);
      act(() => { jest.advanceTimersByTime(250); });
      expect(result.current.editingItem).toBeNull();
    });

    it("openConfirmModal and closeConfirmModal", () => {
      const mockItem: ItemData = {
        id: "1",
        name: "Speaker",
        category: "Audio",
        price: 5000000,
        stock: 12,
        image: "https://example.com/a.jpg",
        duration: "3 days",
        remark: "ok",
        unit: "unit",
        status: "active",
        createAt: "2024-01-01",
        createBy: "Admin",
      };
      const { result } = renderHook(() => useMasterItemState());
      act(() => result.current.openConfirmModal(mockItem));
      expect(result.current.isConfirmModalOpen).toBe(true);
      expect(result.current.deletingItem).toEqual(mockItem);
      act(() => result.current.closeConfirmModal());
      expect(result.current.isConfirmModalOpen).toBe(false);
      act(() => { jest.advanceTimersByTime(250); });
      expect(result.current.deletingItem).toBeNull();
    });

    it("onConfirmDelete closes confirm modal", () => {
      const mockItem: ItemData = {
        id: "1",
        name: "Speaker",
        category: "Audio",
        price: 5000000,
        stock: 12,
        image: "https://example.com/a.jpg",
        duration: "3 days",
        remark: "ok",
        unit: "unit",
        status: "active",
        createAt: "2024-01-01",
        createBy: "Admin",
      };
      const { result } = renderHook(() => useMasterItemState());
      act(() => result.current.openConfirmModal(mockItem));
      expect(result.current.isConfirmModalOpen).toBe(true);
      act(() => result.current.onConfirmDelete());
      expect(result.current.isConfirmModalOpen).toBe(false);
      act(() => { jest.advanceTimersByTime(250); });
      expect(result.current.deletingItem).toBeNull();
    });
  });

  describe("useMasterItemNavigation", () => {
    it("should handle navigation correctly", () => {
      const { result } = renderHook(() => useMasterItemNavigation());

      act(() => { result.current.goBack(); });
      expect(mockNavigate).toHaveBeenCalledWith(-1);

      act(() => { result.current.goCreate(); });
      expect(mockNavigate).toHaveBeenCalledWith("/master-item/create");

      const mockItem: ItemData = {
        id: "1",
        name: "Speaker",
        category: "Audio",
        price: 5000000,
        stock: 12,
        image: "https://example.com/a.jpg",
        duration: "3 days",
        remark: "ok",
        unit: "unit",
        status: "active",
        createAt: "2024-01-01",
        createBy: "Admin",
      };
      act(() => { result.current.goEdit(mockItem); });
      expect(mockNavigate).toHaveBeenCalledWith(`/master-item/edit/${mockItem.id}`);

      act(() => { result.current.goDetail(mockItem); });
      expect(mockNavigate).toHaveBeenCalledWith(`/master-item/detail/${mockItem.id}`);
    });
  });

  describe("useMasterItemContainerState", () => {
    it("should initialize with empty API state", () => {
      mockedGetItemsQuery.mockReturnValue(successfulEmptyResponse);

      const { result } = renderHook(() => useMasterItemContainerState());

      expect(result.current.pagination.currentPage).toBe(1);
      expect(result.current.pagination.pageSize).toBe(10);
      expect(result.current.pagination.totalCount).toBe(0);
      expect(result.current.pagination.paginatedData).toEqual([]);
      expect(result.current.pagination.isEmpty).toBe(true);
      expect(result.current.pagination.isMissingData).toBe(false);
    });

    it("should expose failed envelope message", () => {
      mockedGetItemsQuery.mockReturnValue({
        data: { status: false, messages: ["Item request failed."], data: null },
        error: undefined,
        isLoading: false,
      });

      const { result } = renderHook(() => useMasterItemContainerState());

      expect(result.current.pagination.errorMessage).toBe("Item request failed.");
      expect(result.current.pagination.isEmpty).toBe(false);
      expect(result.current.pagination.isMissingData).toBe(false);
    });

    it("should expose missing payload state", () => {
      mockedGetItemsQuery.mockReturnValue({
        data: { status: true, messages: null, data: null },
        error: undefined,
        isLoading: false,
      });

      const { result } = renderHook(() => useMasterItemContainerState());

      expect(result.current.pagination.errorMessage).toBe("Response is missing data payload.");
      expect(result.current.pagination.isEmpty).toBe(false);
      expect(result.current.pagination.isMissingData).toBe(true);
    });

    it("should expose transport error state", () => {
      mockedGetItemsQuery.mockReturnValue({
        data: undefined,
        error: { status: 500, data: "Server error" },
        isLoading: false,
      });

      const { result } = renderHook(() => useMasterItemContainerState());

      expect(result.current.pagination.errorMessage).toBe("Unable to load items.");
      expect(result.current.pagination.isEmpty).toBe(false);
    });

    it("should handle menu and pagination controls", () => {
      mockedGetItemsQuery.mockReturnValue(successfulEmptyResponse);

      const { result } = renderHook(() => useMasterItemContainerState());

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