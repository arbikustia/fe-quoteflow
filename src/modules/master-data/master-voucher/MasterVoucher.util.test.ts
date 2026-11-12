import { MOCK_API_VOUCHERS, MOCK_VOUCHER_DETAIL_RESPONSE, MOCK_VOUCHER_LIST_RESPONSE } from "@/fixture/master-voucher";

import type { VoucherData } from "./MasterVoucher.type";
import {
  downloadVoucherImage,
  getVoucherDownloadFilename,
  getVoucherRowNumber,
  normalizeVoucherList,
  normalizeVoucherResponse,
} from "./MasterVoucher.util";

const VOUCHER: VoucherData = {
  id: "voucher-1",
  name: "Summer Promo",
  code: "slabc123",
  discountPercent: 10,
  status: "active",
  createdAt: "-",
};

/** Image stub that loads, or fails, as soon as its source is set. */
class MockImage {
  static shouldFail = false;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  /**
   * Trigger load or error once the source is assigned.
   * @param {string} _source - Image source
   */
  set src(_source: string) {
    setTimeout(() => (MockImage.shouldFail ? this.onerror?.() : this.onload?.()));
  }
}

/**
 * Build a canvas context stub whose text measures the given width.
 * @param {number} textWidth - Width returned by measureText
 * @returns {CanvasRenderingContext2D} - Context stub
 */
const createContext = (textWidth: number): CanvasRenderingContext2D => ({
  fillRect: jest.fn(),
  fillText: jest.fn(),
  measureText: jest.fn(() => ({ width: textWidth })),
  save: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
  drawImage: jest.fn(),
}) as never;

describe("MasterVoucher util", () => {
  it("should return a loading view while the query is loading", () => {
    expect(normalizeVoucherList({ data: undefined, isLoading: true, isError: false })).toEqual({
      listStatus: "loading",
      vouchers: [],
      totalPages: 0,
      totalCount: 0,
    });
  });

  it("should return error and missing views", () => {
    expect(normalizeVoucherList({ data: undefined, isLoading: false, isError: true }).listStatus).toBe("error");
    expect(normalizeVoucherList({ data: undefined, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return a missing view when a row does not match the schema", () => {
    const data = { ...MOCK_VOUCHER_LIST_RESPONSE, data: [{ name: "x" }] } as never;

    expect(normalizeVoucherList({ data, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return an empty view when the page has no vouchers", () => {
    const data = { ...MOCK_VOUCHER_LIST_RESPONSE, data: [], total_count: 0 };

    expect(normalizeVoucherList({ data, isLoading: false, isError: false }).listStatus).toBe("empty");
  });

  it("should normalize vouchers with code, discount, status and date", () => {
    const listView = normalizeVoucherList({ data: MOCK_VOUCHER_LIST_RESPONSE, isLoading: false, isError: false });

    expect(listView.listStatus).toBe("ready");
    expect(listView.totalCount).toBe(2);
    expect(listView.vouchers[0]).toEqual({
      id: "voucher-1",
      name: "Summer Promo",
      code: "SLABC123",
      discountPercent: 10,
      status: "active",
      createdAt: "30 Oktober 2026 22:00",
    });
    expect(listView.vouchers[1]).toMatchObject({ code: "WINTER25", status: "inactive", createdAt: "-" });
  });

  it("should show a placeholder for a missing name and code", () => {
    const data = { ...MOCK_VOUCHER_LIST_RESPONSE, data: [{ ...MOCK_API_VOUCHERS[1], name: "", code: "" }] };

    expect(normalizeVoucherList({ data, isLoading: false, isError: false }).vouchers[0]).toMatchObject({ name: "-", code: "-" });
  });

  it("should number rows across pages", () => {
    expect(getVoucherRowNumber(1, 10, 0)).toBe(1);
    expect(getVoucherRowNumber(3, 20, 4)).toBe(45);
  });

  it("should unwrap a list response to its first voucher", () => {
    const response = { ...MOCK_VOUCHER_DETAIL_RESPONSE, data: [MOCK_API_VOUCHERS[0]] };

    expect(normalizeVoucherResponse(response).data).toEqual(MOCK_API_VOUCHERS[0]);
    expect(normalizeVoucherResponse({ ...response, data: [] }).data).toBeNull();
    expect(normalizeVoucherResponse(MOCK_VOUCHER_DETAIL_RESPONSE).data).toEqual(MOCK_API_VOUCHERS[0]);
  });

  it("should name the download after the uppercased code", () => {
    expect(getVoucherDownloadFilename(VOUCHER)).toBe("voucher-SLABC123.jpeg");
  });
});

describe("downloadVoucherImage", () => {
  const originalImage = global.Image;
  let getContextSpy: jest.SpyInstance;
  let clickSpy: jest.SpyInstance;

  beforeEach(() => {
    MockImage.shouldFail = false;
    global.Image = MockImage as never;
    Object.defineProperty(document, "fonts", { value: { ready: Promise.resolve() }, configurable: true });
    getContextSpy = jest.spyOn(HTMLCanvasElement.prototype, "getContext");
    jest.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/jpeg;base64,x");
    clickSpy = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
  });

  afterEach(() => {
    global.Image = originalImage;
    jest.restoreAllMocks();
  });

  it("should draw the discount and code then download the JPEG", async () => {
    const context = createContext(100);

    getContextSpy.mockReturnValue(context);

    await downloadVoucherImage(VOUCHER);

    expect(context.fillText).toHaveBeenCalledWith("10%", 1230, 480);
    expect(context.fillText).toHaveBeenCalledWith("SLABC123", 1242.5, 647);
    expect(context.font).toBe("900 86px Poppins, Arial, sans-serif");
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("should shrink a code wider than the card", async () => {
    const context = createContext(990);

    getContextSpy.mockReturnValue(context);

    await downloadVoucherImage(VOUCHER);

    expect(context.font).toBe("900 43px Poppins, Arial, sans-serif");
  });

  it("should reject when the canvas or the template is unavailable", async () => {
    getContextSpy.mockReturnValue(null);
    await expect(downloadVoucherImage(VOUCHER)).rejects.toThrow("Voucher image canvas is unavailable.");

    MockImage.shouldFail = true;
    await expect(downloadVoucherImage(VOUCHER)).rejects.toThrow("Voucher template could not be loaded.");
  });
});
