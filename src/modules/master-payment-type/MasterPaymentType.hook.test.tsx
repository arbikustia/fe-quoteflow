import { act, renderHook } from "@testing-library/react";
import { useNavigate } from "react-router-dom";

import { useCreatePaymentTypeMutation, useGetPaymentTypesQuery } from "./MasterPaymentType.api";
import { useMasterPaymentTypeContainerState, useMasterPaymentTypeCreate, useMasterPaymentTypeNavigation } from "./MasterPaymentType.hook";

const mockNavigate = jest.fn();

jest.mock("./MasterPaymentType.api", () => ({
  useGetPaymentTypesQuery: jest.fn(),
  useCreatePaymentTypeMutation: jest.fn().mockReturnValue([jest.fn(), { isLoading: false }]),
  _mapPaymentType: (paymentType: { readonly id: string; readonly name: string; readonly status: number; readonly created_at: string | null; readonly created_by: string | null }) => ({
    id: paymentType.id,
    name: paymentType.name,
    status: paymentType.status === 1 ? "active" : "inactive",
    createAt: paymentType.created_at ?? "",
    createBy: paymentType.created_by ?? "",
  }),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

const mockUseGetPaymentTypesQuery = jest.mocked(useGetPaymentTypesQuery);
const mockUseNavigate = jest.mocked(useNavigate);

const emptyResponse = {
  data: { status: true, messages: null, data: { data: [], page_number: 1, total_pages: 1, total_count: 0, has_previous: false, has_next: false } },
  error: undefined,
  isLoading: false,
} as never;

describe("MasterPaymentType hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseGetPaymentTypesQuery.mockReturnValue(emptyResponse);
  });

  it("should handle navigation correctly", () => {
    const { result } = renderHook(() => useMasterPaymentTypeNavigation());
    const paymentType = { id: "1", name: "Cash", status: "active" as const, createAt: "2024-01-01", createBy: "Admin" };

    act(() => { result.current.goBack(); result.current.goCreate(); result.current.goEdit(paymentType); result.current.goDetail(paymentType); });

    expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
    expect(mockNavigate).toHaveBeenNthCalledWith(2, "/master-payment-type/create");
    expect(mockNavigate).toHaveBeenNthCalledWith(3, "/master-payment-type/edit/1");
    expect(mockNavigate).toHaveBeenNthCalledWith(4, "/master-payment-type/detail/1");
  });

  it("should initialize with empty API state", () => {
    const { result } = renderHook(() => useMasterPaymentTypeContainerState());

    expect(result.current.pagination.isEmpty).toBe(true);
    expect(result.current.pagination.paginatedData).toEqual([]);
  });

  it("should expose failed envelope message", () => {
    mockUseGetPaymentTypesQuery.mockReturnValue({ data: { status: false, messages: ["Payment type request failed."], data: null }, error: undefined, isLoading: false } as never);

    const { result } = renderHook(() => useMasterPaymentTypeContainerState());

    expect(result.current.pagination.errorMessage).toBe("Payment type request failed.");
    expect(result.current.pagination.isEmpty).toBe(false);
    expect(result.current.pagination.isMissingData).toBe(false);
  });

  it("should expose loading state", () => {
    mockUseGetPaymentTypesQuery.mockReturnValue({ data: undefined, error: undefined, isLoading: true } as never);

    const { result } = renderHook(() => useMasterPaymentTypeContainerState());

    expect(result.current.pagination.isLoading).toBe(true);
  });

  it("should expose missing response state", () => {
    mockUseGetPaymentTypesQuery.mockReturnValue({ data: undefined, error: undefined, isLoading: false } as never);

    const { result } = renderHook(() => useMasterPaymentTypeContainerState());

    expect(result.current.pagination.errorMessage).toBe("No response received from server.");
    expect(result.current.pagination.isMissingData).toBe(true);
  });

  it("should expose missing payload state", () => {
    mockUseGetPaymentTypesQuery.mockReturnValue({ data: { status: true, messages: null, data: null }, error: undefined, isLoading: false } as never);

    const { result } = renderHook(() => useMasterPaymentTypeContainerState());

    expect(result.current.pagination.errorMessage).toBe("Response is missing data payload.");
    expect(result.current.pagination.isMissingData).toBe(true);
  });

  it("should expose transport error state", () => {
    mockUseGetPaymentTypesQuery.mockReturnValue({ data: undefined, error: { status: 500, data: "Server error" }, isLoading: false } as never);

    const { result } = renderHook(() => useMasterPaymentTypeContainerState());

    expect(result.current.pagination.errorMessage).toBe("Unable to load payment types.");
  });

  it("should handle menu and pagination controls", () => {
    const { result } = renderHook(() => useMasterPaymentTypeContainerState());

    act(() => { result.current.toggleMore(); });
    expect(result.current.isMoreOpen).toBe(true);

    act(() => { result.current.goDelete(); });
    expect(result.current.isMoreOpen).toBe(false);

    act(() => { result.current.pagination.changePageSize(5); });
    expect(result.current.pagination.pageSize).toBe(5);

    act(() => { result.current.pagination.setSearchTerm("cash"); });
    expect(mockUseGetPaymentTypesQuery).toHaveBeenLastCalledWith({ pageNumber: 1, pageSize: 5, searchTerm: "cash" });
  });

  it("should submit payment type and expose success state", async () => {
    const mutate = jest.fn().mockReturnValue({ unwrap: jest.fn().mockResolvedValue({ status: true, data: null, messages: null }) });
    jest.mocked(useCreatePaymentTypeMutation).mockReturnValue([mutate, { isLoading: false }] as never);

    const { result } = renderHook(() => useMasterPaymentTypeCreate());

    act(() => { result.current.handleNameChange("Cash"); });
    await act(async () => { await result.current.handleSubmit(); });

    expect(mutate).toHaveBeenCalledWith({ name: "Cash" });
    expect(result.current.successMessage).toBe("Payment type created successfully.");
  });

  it("should expose create error when mutation rejects", async () => {
    const mutate = jest.fn().mockReturnValue({ unwrap: jest.fn().mockRejectedValue(new Error("Request failed")) });
    jest.mocked(useCreatePaymentTypeMutation).mockReturnValue([mutate, { isLoading: false }] as never);

    const { result } = renderHook(() => useMasterPaymentTypeCreate());

    await act(async () => { await result.current.handleSubmit(); });

    expect(result.current.errorMessage).toBe("Unable to create payment type. Please try again.");
  });

  it("should expose create envelope error", async () => {
    const mutate = jest.fn().mockReturnValue({ unwrap: jest.fn().mockResolvedValue({ status: false, data: null, messages: null }) });
    jest.mocked(useCreatePaymentTypeMutation).mockReturnValue([mutate, { isLoading: false }] as never);

    const { result } = renderHook(() => useMasterPaymentTypeCreate());

    await act(async () => { await result.current.handleSubmit(); });

    expect(result.current.errorMessage).toBe("Payment type request failed.");
  });
});
