import { MOCK_ITEM_LIST_RESPONSE } from "@/fixture/master-item";

import type { ItemLabel } from "./MasterItem.type";
import {
  _getLabelPositions,
  _getLabelWidth,
  downloadItemLabel,
  downloadItemQrImage,
  downloadItemQrPdf,
  formatRupiah,
  getItemRowNumber,
  normalizeItemList,
} from "./MasterItem.util";

const mockSave = jest.fn();
const mockAddImage = jest.fn();
const mockAddPage = jest.fn();
const mockText = jest.fn();

jest.mock("jspdf", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    setFont: jest.fn(),
    getTextWidth: jest.fn(() => 10),
    rect: jest.fn(),
    addImage: mockAddImage,
    text: mockText,
    addPage: mockAddPage,
    save: mockSave,
    internal: { pageSize: { getWidth: (): number => 210, getHeight: (): number => 297 } },
  })),
}));
jest.mock("qrcode", () => ({ __esModule: true, default: { toDataURL: jest.fn(() => Promise.resolve("data:image/png;base64,qr")) } }));

const LABEL: ItemLabel = { id: "item-1", name: "Speaker", categoryName: "Audio" };

describe("MasterItem util", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return loading, error and missing views", () => {
    expect(normalizeItemList({ data: undefined, isLoading: true, isError: false })).toEqual({ listStatus: "loading", items: [], totalPages: 0, totalCount: 0 });
    expect(normalizeItemList({ data: undefined, isLoading: false, isError: true }).listStatus).toBe("error");
    expect(normalizeItemList({ data: { ...MOCK_ITEM_LIST_RESPONSE, status: false }, isLoading: false, isError: false }).listStatus).toBe("error");
    expect(normalizeItemList({ data: undefined, isLoading: false, isError: false }).listStatus).toBe("missing");
    expect(normalizeItemList({ data: { ...MOCK_ITEM_LIST_RESPONSE, data: [{ id: "x" }] } as never, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return an empty view when the page has no items", () => {
    expect(normalizeItemList({ data: { ...MOCK_ITEM_LIST_RESPONSE, data: [] }, isLoading: false, isError: false }).listStatus).toBe("empty");
  });

  it("should normalize items once with placeholders for missing values", () => {
    const listView = normalizeItemList({ data: MOCK_ITEM_LIST_RESPONSE, isLoading: false, isError: false });

    expect(listView.listStatus).toBe("ready");
    expect(listView.totalCount).toBe(2);
    expect(listView.items[0]).toMatchObject({ id: "item-1", categoryName: "Lighting Equipment", price: 100000, remark: "Lighting", status: "active" });
    expect(listView.items[1]).toMatchObject({ categoryName: "-", price: 0, stock: 0, duration: 0, image: null, remark: "-", status: "inactive" });
    expect(listView.items[1].source).toEqual(MOCK_ITEM_LIST_RESPONSE.data[1]);
  });

  it("should number rows and format prices", () => {
    expect(getItemRowNumber(2, 10, 0)).toBe(11);
    expect(formatRupiah(100000)).toBe("Rp 100.000");
  });

  it("should size labels to the longest line, never below the minimum width", () => {
    const pdfDocument = { setFontSize: jest.fn(), setFont: jest.fn(), getTextWidth: jest.fn(() => 40) };

    expect(_getLabelWidth(pdfDocument as never, LABEL)).toBe(57);
    pdfDocument.getTextWidth.mockReturnValue(1);
    expect(_getLabelWidth(pdfDocument as never, LABEL)).toBe(33);
  });

  it("should wrap labels to the next row and the next page", () => {
    const positions = _getLabelPositions([100, 100, 100], 240, 49);

    expect(positions).toEqual([
      { page: 0, x: 15, y: 15, width: 100 },
      { page: 0, x: 117, y: 15, width: 100 },
      { page: 1, x: 15, y: 15, width: 100 },
    ]);
  });

  it("should save one PDF with a page per overflow", async () => {
    await downloadItemQrPdf(Array.from({ length: 120 }, (_value, index) => ({ ...LABEL, id: `item-${index}` })));

    expect(mockAddImage).toHaveBeenCalledTimes(120);
    expect(mockAddPage).toHaveBeenCalled();
    expect(mockText).toHaveBeenCalledWith("CAT: AUDIO", expect.any(Number), expect.any(Number));
    expect(mockSave).toHaveBeenCalledWith("qr-items.pdf");
  });

  it("should skip the image download without a canvas context", async () => {
    jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    await expect(downloadItemQrImage(LABEL)).resolves.toBeUndefined();
  });

  it("should draw the label on a canvas and download it as JPEG", async () => {
    const context = { canvas: { width: 330, height: 150 }, fillRect: jest.fn(), strokeRect: jest.fn(), drawImage: jest.fn(), fillText: jest.fn() };
    const click = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);

    jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context as never);
    jest.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/jpeg;base64,label");
    jest.spyOn(window, "Image").mockImplementation(() => {
      const image = {} as HTMLImageElement;

      Object.defineProperty(image, "src", { set: (): void => image.onload?.(new Event("load")) });

      return image;
    });

    await downloadItemQrImage(LABEL);

    expect(context.fillText).toHaveBeenCalledWith("SPEAKER", expect.any(Number), expect.any(Number));
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("should route each format to its downloader", async () => {
    await downloadItemLabel(LABEL, "pdf");
    expect(mockSave).toHaveBeenCalledTimes(1);

    jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    await expect(downloadItemLabel(LABEL, "image")).resolves.toBeUndefined();
    expect(() => downloadItemLabel(LABEL, "svg" as never)).toThrow("Unknown download format: svg");
  });
});
