import { describe, expect, it, jest } from "@jest/globals";

import type { QuoteData } from "@/modules/order/Order.type";
import { generateInvoicePDF, generateQuotationPDF, generateQuotePDF } from "./pdfGenerator";

const mockSave = jest.fn();
const mockText = jest.fn();
const mockAddImage = jest.fn();
const mockSetFontSize = jest.fn();
const mockSetFont = jest.fn();
const mockAddPage = jest.fn();

jest.mock("jspdf", () => {
  return jest.fn().mockImplementation(() => ({
    save: mockSave,
    text: mockText,
    addImage: mockAddImage,
    setFontSize: mockSetFontSize,
    setFont: mockSetFont,
    addPage: mockAddPage,
  }));
});

jest.mock("jspdf-autotable", () => jest.fn());

const mockQuote: QuoteData = {
  id: "Q-123",
  name: "Mega Event",
  startDate: "2026-11-01",
  endDate: "2026-11-02",
  location: "Jakarta",
  category: "Audio System",
  selectedItems: ["Speaker"],
  qty: 1,
  pph: 11,
  discount: 100000,
  remark: "Special note",
  grandTotal: 15000000,
  status: 1,
  customerPhone: "0812345678",
};

describe("pdfGenerator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Simulate Image in JSDOM (resolve empty frame in test)
    // @ts-expect-error Image mock
    global.Image = class {
      onerror: () => void = () => {};
      set src(_val: string) {
        setTimeout(() => this.onerror(), 5);
      }
    };
  });

  it("generateQuotePDF should save as Invoice by default with PENAWARAN HARGA title", async () => {
    await generateQuotePDF(mockQuote);

    expect(mockSave).toHaveBeenCalledWith("Invoice-Q-123.pdf");
    expect(mockText).toHaveBeenCalledWith("PENAWARAN HARGA", 105, 40, { align: "center" });
  });

  it("generateQuotationPDF should save as Quotation with QUOTATION title", async () => {
    await generateQuotationPDF(mockQuote);

    expect(mockSave).toHaveBeenCalledWith("Quotation-Q-123.pdf");
    expect(mockText).toHaveBeenCalledWith("QUOTATION", 105, 40, { align: "center" });
  });

  it("generateInvoicePDF should save as Invoice with INVOICE title", async () => {
    await generateInvoicePDF(mockQuote);

    expect(mockSave).toHaveBeenCalledWith("Invoice-Q-123.pdf");
    expect(mockText).toHaveBeenCalledWith("INVOICE", 105, 40, { align: "center" });
  });
});
