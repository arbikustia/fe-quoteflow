import { act, renderHook } from "@testing-library/react";

import { useMasterPaymentMethodContainerState, useMasterPaymentMethodNavigation } from "./MasterPaymentMethod.hook";

const mocks = {
  navigate: jest.fn(),
  useGetPaymentMethodsQuery: jest.fn(),
};

jest.mock("./MasterPaymentMethod.api", () => ({
  _mapPaymentMethod: (paymentMethod: {
    readonly id: string;
    readonly name: string;
    readonly description: string | null;
    readonly status: number;
    readonly created_at: string | null;
    readonly created_by: string | null;
  }) => ({
    id: paymentMethod.id,
    name: paymentMethod.name,
    description: paymentMethod.description ?? "",
    status: paymentMethod.status === 1 ? "active" : "inactive",
    createAt: paymentMethod.created_at ?? "",
    createBy: paymentMethod.created_by ?? "",
  }),
  useGetPaymentMethodsQuery: (...args: unknown[]) => mocks.useGetPaymentMethodsQuery(...args),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
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

describe("MasterPaymentMethod hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useMasterPaymentMethodNavigation", () => {
    it("should handle navigation correctly", () => {
      const { result } = renderHook(() => useMasterPaymentMethodNavigation());

      act(() => { result.current.goBack(); });
      expect(mocks.navigate).toHaveBeenCalledWith(-1);

      act(() => { result.current.goCreate(); });
      expect(mocks.navigate).toHaveBeenCalledWith("/master-payment-method/create");

      const mockPaymentMethod = { id: "pm-1", name: "Test", description: "Test", status: "active" as const, createAt: "2024-01-01", createBy: "Admin" };
      act(() => { result.current.goEdit(mockPaymentMethod); });
      expect(mocks.navigate).toHaveBeenCalledWith("/master-payment-method/edit/pm-1");

      act(() => { result.current.goDetail(mockPaymentMethod); });
      expect(mocks.navigate).toHaveBeenCalledWith("/master-payment-method/detail/pm-1");
    });
  });

  describe("useMasterPaymentMethodContainerState", () => {
    it("should initialize with empty API state", () => {
      mocks.useGetPaymentMethodsQuery.mockReturnValue(successfulEmptyResponse);

      const { result } = renderHook(() => useMasterPaymentMethodContainerState());

      expect(result.current.pagination.currentPage).toBe(1);
      expect(result.current.pagination.pageSize).toBe(10);
      expect(result.current.pagination.totalCount).toBe(0);
      expect(result.current.pagination.paginatedData).toEqual([]);
      expect(result.current.pagination.isEmpty).toBe(true);
      expect(result.current.pagination.isMissingData).toBe(false);
    });

    it("should expose failed envelope message", () => {
      mocks.useGetPaymentMethodsQuery.mockReturnValue({
        data: { status: false, messages: ["Payment method request failed."], data: null },
        error: undefined,
        isLoading: false,
      });

      const { result } = renderHook(() => useMasterPaymentMethodContainerState());

      expect(result.current.pagination.errorMessage).toBe("Payment method request failed.");
      expect(result.current.pagination.isEmpty).toBe(false);
      expect(result.current.pagination.isMissingData).toBe(false);
    });

    it("should expose missing payload state", () => {
      mocks.useGetPaymentMethodsQuery.mockReturnValue({
        data: { status: true, messages: null, data: null },
        error: undefined,
        isLoading: false,
      });

      const { result } = renderHook(() => useMasterPaymentMethodContainerState());

      expect(result.current.pagination.errorMessage).toBe("Response is missing data payload.");
      expect(result.current.pagination.isEmpty).toBe(false);
      expect(result.current.pagination.isMissingData).toBe(true);
    });

    it("should expose transport error state", () => {
      mocks.useGetPaymentMethodsQuery.mockReturnValue({
        data: undefined,
        error: { status: 500, data: "Server error" },
        isLoading: false,
      });

      const { result } = renderHook(() => useMasterPaymentMethodContainerState());

      expect(result.current.pagination.errorMessage).toBe("Unable to load payment methods.");
      expect(result.current.pagination.isEmpty).toBe(false);
    });

    it("should handle menu and pagination controls", () => {
      mocks.useGetPaymentMethodsQuery.mockReturnValue(successfulEmptyResponse);

      const { result } = renderHook(() => useMasterPaymentMethodContainerState());

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