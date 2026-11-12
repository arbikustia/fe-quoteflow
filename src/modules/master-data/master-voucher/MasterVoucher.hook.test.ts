import type { ChangeEvent } from "react";

import { act, renderHook } from "@/libs/unit-test";

import { useMasterVoucher } from "./MasterVoucher.hook";
import { downloadVoucherImage } from "./MasterVoucher.util";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: (): jest.Mock => mockNavigate,
}));
jest.mock("./MasterVoucher.util", () => ({ downloadVoucherImage: jest.fn() }));

const VOUCHER = { id: "voucher-1", name: "Summer Promo", code: "SLABC123", discountPercent: 10, status: "active", createdAt: "-" } as const;

/**
 * Build a search input change event.
 * @param {string} value - Input value
 * @returns {ChangeEvent<HTMLInputElement>} - Change event
 */
const createSearchEvent = (value: string): ChangeEvent<HTMLInputElement> => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

describe("useMasterVoucher", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should start on the first page with the default page size", () => {
    const { result } = renderHook(useMasterVoucher);

    expect(result.current.queryParams).toEqual({ pageNumber: 1, pageSize: 10, searchTerm: "" });
  });

  it("should change page but never go below the first page", () => {
    const { result } = renderHook(useMasterVoucher);

    act(() => result.current.handlePageChange(3));
    expect(result.current.currentPage).toBe(3);

    act(() => result.current.handlePageChange(0));
    expect(result.current.currentPage).toBe(1);
  });

  it("should reset to the first page when page size or search changes", () => {
    const { result } = renderHook(useMasterVoucher);

    act(() => result.current.handlePageChange(3));
    act(() => result.current.handlePageSizeChange(20));
    expect(result.current.queryParams).toEqual({ pageNumber: 1, pageSize: 20, searchTerm: "" });

    act(() => result.current.handlePageChange(2));
    act(() => result.current.handleSearchChange(createSearchEvent("summer")));
    expect(result.current.queryParams).toEqual({ pageNumber: 1, pageSize: 20, searchTerm: "summer" });
  });

  it("should navigate to master main, create and edit pages by id", () => {
    const { result } = renderHook(useMasterVoucher);

    act(result.current.handleBack);
    act(result.current.handleCreate);
    act(() => result.current.handleEdit(VOUCHER));

    expect(mockNavigate.mock.calls).toEqual([
      ["/master-main"],
      ["/master-voucher/create"],
      ["/master-voucher/edit/voucher-1"],
    ]);
  });

  it("should download the voucher image and alert when it fails", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => undefined);
    const { result } = renderHook(useMasterVoucher);

    jest.mocked(downloadVoucherImage).mockResolvedValueOnce();
    await act(async () => result.current.handleDownload(VOUCHER));
    expect(alertSpy).not.toHaveBeenCalled();

    jest.mocked(downloadVoucherImage).mockRejectedValueOnce(new Error("failed"));
    await act(async () => result.current.handleDownload(VOUCHER));
    expect(downloadVoucherImage).toHaveBeenCalledWith(VOUCHER);
    expect(alertSpy).toHaveBeenCalledWith("Unable to download voucher template.");
  });
});
