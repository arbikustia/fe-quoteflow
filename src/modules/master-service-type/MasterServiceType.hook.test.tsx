import { act, renderHook } from "@testing-library/react";
import { useNavigate } from "react-router-dom";

import { useMasterServiceTypeContainerState, useMasterServiceTypeNavigation } from "./MasterServiceType.hook";
import type { ServiceTypeData } from "./MasterServiceType.type";

const mockServiceTypeApi = jest.fn();
const mockCreateServiceType = jest.fn();

jest.mock("./MasterServiceType.api", () => ({
  _mapServiceType: (serviceType: { readonly id: string; readonly name: string; readonly price: number; readonly is_active: boolean; readonly status: number; readonly created_at: string | null; readonly created_by?: string | null }) => ({
    id: serviceType.id,
    name: serviceType.name,
    price: serviceType.price,
    isActive: serviceType.is_active,
    status: serviceType.status === 1 ? "active" : "inactive",
    createAt: serviceType.created_at ?? "",
    createBy: serviceType.created_by ?? "",
  }),
  useCreateServiceTypeMutation: () => [mockCreateServiceType, { isLoading: false }],
  useGetServiceTypesQuery: (...params: never[]) => mockServiceTypeApi(...params),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

const serviceType: ServiceTypeData = {
  id: "st-1",
  name: "Sound System",
  price: 50000,
  isActive: true,
  status: "active",
  createAt: "2024-01-01",
  createBy: "Admin",
};

const successResponse = {
  data: {
    data: [
      {
        id: "st-1",
        name: "Sound System",
        price: 50000,
        is_active: true,
        status: 1,
        created_at: "2024-01-01",
        updated_at: "2024-01-02",
        created_by: "Admin",
      },
    ],
    page_number: 1,
    total_pages: 2,
    total_count: 1,
    has_previous: false,
    has_next: true,
  },
  error: undefined,
  isLoading: false,
};

describe("MasterServiceType.hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockServiceTypeApi.mockReturnValue(successResponse);
  });

  describe("useMasterServiceTypeNavigation", () => {
    it("should handle navigation correctly", () => {
      const mockNavigate = jest.fn();
      jest.mocked(useNavigate).mockReturnValue(mockNavigate);

      const { result } = renderHook(() => useMasterServiceTypeNavigation());

      act(() => { result.current.goBack(); });
      expect(mockNavigate).toHaveBeenCalledWith(-1);

      act(() => { result.current.goCreate(); });
      expect(mockNavigate).toHaveBeenCalledWith("/master-service-type/create");

      act(() => { result.current.goEdit(serviceType); });
      expect(mockNavigate).toHaveBeenCalledWith("/master-service-type/edit/st-1");

      act(() => { result.current.goDetail(serviceType); });
      expect(mockNavigate).toHaveBeenCalledWith("/master-service-type/detail/st-1");
    });
  });

  describe("useMasterServiceTypeContainerState", () => {
    it("should expose API data state", () => {
      const { result } = renderHook(() => useMasterServiceTypeContainerState());

      expect(mockServiceTypeApi).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "" });
      expect(result.current.pagination.paginatedData).toEqual([serviceType]);
      expect(result.current.pagination.totalPages).toBe(2);
      expect(result.current.pagination.totalCount).toBe(1);
      expect(result.current.pagination.isEmpty).toBe(false);
    });

    it("should expose loading state", () => {
      mockServiceTypeApi.mockReturnValue({ data: undefined, error: undefined, isLoading: true });

      const { result } = renderHook(() => useMasterServiceTypeContainerState());

      expect(result.current.pagination.isLoading).toBe(true);
      expect(result.current.pagination.paginatedData).toEqual([]);
    });

    it("should expose transport error state", () => {
      mockServiceTypeApi.mockReturnValue({ data: undefined, error: { status: 500, data: "Server error" }, isLoading: false });

      const { result } = renderHook(() => useMasterServiceTypeContainerState());

      expect(result.current.pagination.errorMessage).toBe("Unable to load service types.");
      expect(result.current.pagination.isEmpty).toBe(false);
    });

    it("should expose missing response state", () => {
      mockServiceTypeApi.mockReturnValue({ data: undefined, error: undefined, isLoading: false });

      const { result } = renderHook(() => useMasterServiceTypeContainerState());

      expect(result.current.pagination.errorMessage).toBe("No response received from server.");
      expect(result.current.pagination.isMissingData).toBe(true);
    });

    it("should handle menu and pagination controls", () => {
      const { result } = renderHook(() => useMasterServiceTypeContainerState());

      act(() => { result.current.toggleMore(); });
      expect(result.current.isMoreOpen).toBe(true);

      act(() => { result.current.goDelete(); });
      expect(result.current.isMoreOpen).toBe(false);

      act(() => { result.current.pagination.changePageSize(5); });
      expect(result.current.pagination.pageSize).toBe(5);

      act(() => { result.current.pagination.nextPage(); });
      expect(result.current.pagination.currentPage).toBe(2);
    });
  });
});
