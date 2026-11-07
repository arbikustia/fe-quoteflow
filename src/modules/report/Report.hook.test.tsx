import { act, renderHook, waitFor } from "@testing-library/react";

import apiClient from "@/libs/api/ApiClient/ApiClient";

import { useReportOrderExport } from "./Report.hook";

jest.mock("@/libs/api/ApiClient/ApiClient", () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockGet = apiClient.get as jest.Mock;
const mockCreateObjectUrl = jest.fn(() => "blob:report");
const mockRevokeObjectUrl = jest.fn();
const mockAnchorClick = jest.fn();

beforeAll(() => {
  Object.defineProperty(URL, "createObjectURL", { configurable: true, value: mockCreateObjectUrl });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: mockRevokeObjectUrl });
  HTMLAnchorElement.prototype.click = mockAnchorClick;
});

describe("useReportOrderExport", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockResolvedValue({ data: new Blob(["excel"], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }) });
  });

  it("should download the order report excel from the export endpoint", async () => {
    const { result } = renderHook(() => useReportOrderExport());

    act(() => result.current.onExport());

    await waitFor(() => expect(mockAnchorClick).toHaveBeenCalledTimes(1));
    expect(mockGet).toHaveBeenCalledWith("/api/rental-order/export", { responseType: "blob" });
    expect(mockCreateObjectUrl).toHaveBeenCalledTimes(1);
    expect(mockRevokeObjectUrl).toHaveBeenCalledWith("blob:report");
    expect(result.current.isExporting).toBe(false);
  });

  it("should report a failed export without leaving the button busy", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => undefined);
    mockGet.mockRejectedValue(new Error("network"));

    const { result } = renderHook(() => useReportOrderExport());

    act(() => result.current.onExport());

    await waitFor(() => expect(alertSpy).toHaveBeenCalled());
    expect(mockAnchorClick).not.toHaveBeenCalled();
    expect(result.current.isExporting).toBe(false);
    alertSpy.mockRestore();
  });
});
