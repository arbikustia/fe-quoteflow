import { act, renderHook } from "@testing-library/react";

import { MOCK_VOUCHERS } from "../../fixture/master-voucher";
import { useGetVouchersQuery } from "@/services/master-voucher.service";
import { useMasterVoucherContainerState, useMasterVoucherNavigation } from "./MasterVoucher.hook";

const mockNavigate = jest.fn();

jest.mock("@/services/master-voucher.service", () => ({
  mapVoucher: (voucher: { readonly id: string; readonly name: string; readonly code: string; readonly discount_percent: number; readonly status: number; readonly created_at: string | null }) => ({
    id: voucher.id,
    name: voucher.name,
    code: voucher.code,
    discountPercent: voucher.discount_percent,
    status: voucher.status === 1 ? "active" : "inactive",
    createAt: voucher.created_at ?? "",
    createBy: "",
  }),
  useGetVouchersQuery: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: (): typeof mockNavigate => mockNavigate,
}));

const mockUseGetVouchersQuery = useGetVouchersQuery as jest.Mock;
const emptyResponse = {
  data: {
    status: true,
    messages: null,
    data: [],
    page_number: 1,
    page_size: 10,
    total_pages: 1,
    total_count: 0,
    has_previous: false,
    has_next: false,
  },
  error: undefined,
  isLoading: false,
};

describe("MasterVoucher hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetVouchersQuery.mockReturnValue(emptyResponse as ReturnType<typeof useGetVouchersQuery>);
  });

  it("should navigate to voucher pages", () => {
    const { result } = renderHook(() => useMasterVoucherNavigation());

    act(() => { result.current.goBack(); });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
    act(() => { result.current.goCreate(); });
    expect(mockNavigate).toHaveBeenCalledWith("/master-voucher/create");
    act(() => { result.current.goEdit(MOCK_VOUCHERS[0]); });
    expect(mockNavigate).toHaveBeenCalledWith("/master-voucher/edit/1");
    act(() => { result.current.goDetail(MOCK_VOUCHERS[1]); });
    expect(mockNavigate).toHaveBeenCalledWith("/master-voucher/detail/2");
  });

  it("should expose empty API state", () => {
    const { result } = renderHook(() => useMasterVoucherContainerState());

    expect(mockUseGetVouchersQuery).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "" });
    expect(result.current.pagination.paginatedData).toEqual([]);
    expect(result.current.pagination.isEmpty).toBe(true);
  });

  it("should map voucher API response", () => {
    mockUseGetVouchersQuery.mockReturnValue({
      ...emptyResponse,
      data: {
        ...emptyResponse.data,
        data: [
          { id: "1", name: "Discount", code: "DISC10", discount_percent: 10, status: 1, created_at: "2026-10-13", updated_at: null },
        ],
        total_count: 1,
      },
    } as ReturnType<typeof useGetVouchersQuery>);

    const { result } = renderHook(() => useMasterVoucherContainerState());

    expect(result.current.pagination.paginatedData[0].code).toBe("DISC10");
    expect(result.current.pagination.totalCount).toBe(1);
  });

  it("should expose loading, error, and missing states", () => {
    mockUseGetVouchersQuery.mockReturnValue({ data: undefined, error: undefined, isLoading: true } as ReturnType<typeof useGetVouchersQuery>);
    const loading = renderHook(() => useMasterVoucherContainerState());
    expect(loading.result.current.pagination.isLoading).toBe(true);
    loading.unmount();

    mockUseGetVouchersQuery.mockReturnValue({ data: undefined, error: { status: 500 }, isLoading: false } as ReturnType<typeof useGetVouchersQuery>);
    const failed = renderHook(() => useMasterVoucherContainerState());
    expect(failed.result.current.pagination.errorMessage).toBe("Unable to load vouchers.");
    failed.unmount();

    mockUseGetVouchersQuery.mockReturnValue({ data: undefined, error: undefined, isLoading: false } as ReturnType<typeof useGetVouchersQuery>);
    const missing = renderHook(() => useMasterVoucherContainerState());
    expect(missing.result.current.pagination.isMissingData).toBe(true);
  });

  it("should update menu and page size", () => {
    const { result } = renderHook(() => useMasterVoucherContainerState());

    act(() => { result.current.toggleMore(); });
    expect(result.current.isMoreOpen).toBe(true);
    act(() => { result.current.goDelete(); });
    expect(result.current.isMoreOpen).toBe(false);
    act(() => { result.current.pagination.changePageSize(5); });
    expect(result.current.pagination.pageSize).toBe(5);
  });
});
