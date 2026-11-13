import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { MOCK_REPORT_ORDER } from "@/fixture/report";
import { act, renderHook, waitFor } from "@/libs/unit-test";

import { useReportOrderConfirm, useReportOrderExport, useReportOrderNavigation, useReportOrderPagination } from "./Report.hook";

const mockNavigate = jest.fn();
const mockQuery = jest.fn();
const mockExport = jest.fn();
const mockUpdate = jest.fn();
const mockLogEdit = jest.fn();
const mockLogView = jest.fn();
const mockAnchorClick = jest.fn();
const mockRevokeObjectUrl = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: (): jest.Mock => mockNavigate,
}));
jest.mock("@/hooks/useMasterActivityLog", () => ({
  useMasterActivityLog: (): { logEdit: jest.Mock; logView: jest.Mock } => ({ logEdit: mockLogEdit, logView: mockLogView }),
}));
jest.mock("@/services/rental-order.service", () => ({
  mapRentalOrder: (order: unknown): unknown => order,
  useGetRentalOrdersQuery: (...args: unknown[]): unknown => mockQuery(...args),
  useExportRentalOrdersMutation: (): unknown[] => [mockExport, { isLoading: false }],
  useUpdateRentalOrderMutation: (): unknown[] => [mockUpdate, { isLoading: false }],
}));

const wrapper = ({ children }: { children: ReactNode }): ReactNode => <MemoryRouter>{children}</MemoryRouter>;

beforeAll(() => {
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: mockRevokeObjectUrl });
  HTMLAnchorElement.prototype.click = mockAnchorClick;
});

beforeEach(() => {
  jest.clearAllMocks();
  mockLogView.mockResolvedValue(undefined);
  mockLogEdit.mockResolvedValue(undefined);
});

describe("useReportOrderNavigation", () => {
  it("should navigate back", () => {
    const { result } = renderHook(() => useReportOrderNavigation(), { wrapper });

    result.current.goBack();
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});

describe("useReportOrderExport", () => {
  it("should download the order report from the export mutation", async () => {
    mockExport.mockReturnValue({ unwrap: (): Promise<string> => Promise.resolve("blob:report") });
    const { result } = renderHook(() => useReportOrderExport());

    act(() => result.current.onExport());

    await waitFor(() => expect(mockAnchorClick).toHaveBeenCalledTimes(1));
    expect(mockRevokeObjectUrl).toHaveBeenCalledWith("blob:report");
  });

  it("should alert when the export fails", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => undefined);

    mockExport.mockReturnValue({ unwrap: (): Promise<string> => Promise.reject(new Error("network")) });
    const { result } = renderHook(() => useReportOrderExport());

    act(() => result.current.onExport());

    await waitFor(() => expect(alertSpy).toHaveBeenCalled());
    expect(mockAnchorClick).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});

describe("useReportOrderConfirm", () => {
  it("should mark the selected order as done and log the edit", async () => {
    mockUpdate.mockReturnValue({ unwrap: (): Promise<unknown> => Promise.resolve({ status: true }) });
    const { result } = renderHook(() => useReportOrderConfirm());

    act(() => result.current.onEditStatus(MOCK_REPORT_ORDER));
    expect(result.current.confirmOrder).toBe(MOCK_REPORT_ORDER);
    expect(result.current.confirmMessage).toContain("ORDER-001");

    act(() => result.current.onConfirm());

    await waitFor(() => expect(mockLogEdit).toHaveBeenCalledWith("ORDER-001"));
    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ id: "ord-1", status: 2 }));
  });

  it("should do nothing without a selected order and clear on cancel", () => {
    const { result } = renderHook(() => useReportOrderConfirm());

    act(() => result.current.onConfirm());
    expect(mockUpdate).not.toHaveBeenCalled();

    act(() => result.current.onEditStatus(MOCK_REPORT_ORDER));
    act(() => result.current.onCancelConfirm());
    expect(result.current.confirmOrder).toBeNull();
  });

  it("should swallow update failures without logging", async () => {
    mockUpdate.mockReturnValue({ unwrap: (): Promise<unknown> => Promise.reject(new Error("fail")) });
    const { result } = renderHook(() => useReportOrderConfirm());

    act(() => result.current.onEditStatus(MOCK_REPORT_ORDER));
    act(() => result.current.onConfirm());

    await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
    expect(mockLogEdit).not.toHaveBeenCalled();
  });
});

describe("useReportOrderPagination", () => {
  it("should expose loading state and log the view", () => {
    mockQuery.mockReturnValue({ isLoading: true });
    const { result } = renderHook(() => useReportOrderPagination());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isEmpty).toBe(false);
    expect(mockLogView).toHaveBeenCalled();
  });

  it("should expose an error message when the request fails", () => {
    mockQuery.mockReturnValue({ error: {}, isLoading: false });
    const { result } = renderHook(() => useReportOrderPagination());

    expect(result.current.errorMessage).toBe("Unable to load orders.");
  });

  it("should flag a missing response and a missing payload", () => {
    mockQuery.mockReturnValue({ isLoading: false });
    const { result, rerender } = renderHook(() => useReportOrderPagination());

    expect(result.current.isMissingData).toBe(true);
    mockQuery.mockReturnValue({ data: {}, isLoading: false });
    rerender();
    expect(result.current.errorMessage).toBe("Response is missing data payload.");
  });

  it("should expose sorted rows and handle paging, page size and search", () => {
    mockQuery.mockReturnValue({ data: { data: [MOCK_REPORT_ORDER], total_pages: 3, total_count: 21 }, isLoading: false });
    const { result } = renderHook(() => useReportOrderPagination());

    expect(result.current.paginatedData).toEqual([MOCK_REPORT_ORDER]);
    expect(result.current.totalCount).toBe(21);

    act(() => result.current.goToPage(5));
    expect(result.current.currentPage).toBe(3);

    act(() => result.current.changePageSize(20));
    expect(result.current.pageSize).toBe(20);
    expect(result.current.currentPage).toBe(1);

    act(() => result.current.goToPage(2));
    act(() => result.current.setSearchTerm("abc"));
    expect(result.current.currentPage).toBe(1);
    expect(mockQuery).toHaveBeenLastCalledWith({ pageNumber: 1, pageSize: 20, searchTerm: "abc" });
  });

  it("should flag an empty list", () => {
    mockQuery.mockReturnValue({ data: { data: [], total_pages: 0, total_count: 0 }, isLoading: false });
    const { result } = renderHook(() => useReportOrderPagination());

    expect(result.current.isEmpty).toBe(true);
  });
});
