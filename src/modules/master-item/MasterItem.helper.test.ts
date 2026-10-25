const mockSave = jest.fn();
const mockAddImage = jest.fn();
const mockAddPage = jest.fn();

jest.mock("jspdf", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    setFont: jest.fn(),
    getTextWidth: jest.fn(() => 10),
    rect: jest.fn(),
    addImage: mockAddImage,
    text: jest.fn(),
    addPage: mockAddPage,
    save: mockSave,
    internal: { pageSize: { getWidth: (): number => 210, getHeight: (): number => 297 } },
  })),
}));
jest.mock("qrcode", () => ({ __esModule: true, default: { toDataURL: jest.fn(() => Promise.resolve("data:image/png;base64,qr")) } }));

import { downloadItemQrPdf } from "./MasterItem.helper";
import type { ItemData } from "./MasterItem.type";

const item: ItemData = { id: "item-1", name: "Speaker", categoryId: "category-1", categoryName: "Audio", price: 100000, stock: 1, image: null, duration: 1, remark: null, status: "active", createAt: null, createBy: null };

describe("MasterItem helper", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("should create and save QR PDF labels", async (): Promise<void> => {
    await downloadItemQrPdf([item]);

    expect(mockAddImage).toHaveBeenCalledTimes(1);
    expect(mockAddPage).not.toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalledWith("qr-items.pdf");
  });
});
