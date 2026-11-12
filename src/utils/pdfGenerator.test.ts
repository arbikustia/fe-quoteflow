import { describe, expect, it, jest } from "@jest/globals";
import autoTable from "jspdf-autotable";

import type { QuoteData } from "@/modules/order/Order.type";
import { generateInvoicePDF, generateQuotationPDF, generateQuotePDF } from "./pdfGenerator";

const mockSave = jest.fn();
const mockText = jest.fn();
const mockAddImage = jest.fn();
const mockSetFontSize = jest.fn();
const mockSetFont = jest.fn();
const mockAddPage = jest.fn();
const mockAutoTable = jest.mocked(autoTable);

jest.mock("jspdf", () => {
  return jest.fn().mockImplementation(() => ({
    save: mockSave,
    text: mockText,
    addImage: mockAddImage,
    setFontSize: mockSetFontSize,
    setFont: mockSetFont,
    addPage: mockAddPage,
    output: jest.fn(() => new Blob()),
  }));
});

URL.createObjectURL = jest.fn(() => "blob:pdf");

jest.mock("jspdf-autotable", () => jest.fn());

const mockQuote: QuoteData = {
  id: "Q-123",
  name: "Mega Event",
  customerName: "Citra Bunga Lestari",
  startDate: "2026-11-01",
  endDate: "2026-11-02",
  location: "Jakarta",
  category: "Audio System",
  selectedItems: ["Speaker"],
  qty: 1,
  pph: 11,
  discount: 2,
  serviceFee: 250000,
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

  it("generateQuotationPDF should group transaction items under gray category rows", async () => {
    await generateQuotationPDF({
      ...mockQuote,
      pdfItems: [
        { name: "Speaker", category: "Audio", qty: 2, price: 500000, remark: "Main" },
        { name: "Mixer", category: "Audio", qty: 1, price: 750000, remark: "" },
        { name: "Moving Head", category: "Lighting", qty: 4, price: 250000, remark: "Stage" },
      ],
    });

    expect(mockSave).toHaveBeenCalledWith("Quotation-Q-123.pdf");
    expect(mockText).toHaveBeenCalledWith("QUOTATION", 105, 40, { align: "center" });
    expect(mockText).toHaveBeenCalledWith(": Bpk/ Ibu Citra Bunga Lestari", 45, 58);
    expect(mockText).toHaveBeenCalledWith(": 1 November 2026 - 2 November 2026", 45, 68);
    expect(mockText).toHaveBeenCalledWith("Remark", 14, 78);
    expect(mockText).toHaveBeenCalledWith(": Special note", 45, 78);
    const tableOptions = mockAutoTable.mock.calls.at(-1)?.[1];
    expect(tableOptions?.body?.slice(0, 5)).toEqual([
      [{ content: "Audio", colSpan: 6, styles: { fontStyle: "bold", fillColor: [240, 240, 240], textColor: [0, 0, 0], halign: "left" } }],
      [{ content: "1", styles: { halign: "center" } }, "Speaker", { content: "2", styles: { halign: "center" } }, { content: "Units", styles: { halign: "center" } }, { content: "500.000", styles: { halign: "right" } }, "Main"],
      [{ content: "2", styles: { halign: "center" } }, "Mixer", { content: "1", styles: { halign: "center" } }, { content: "Unit", styles: { halign: "center" } }, { content: "750.000", styles: { halign: "right" } }, ""],
      [{ content: "Lighting", colSpan: 6, styles: { fontStyle: "bold", fillColor: [240, 240, 240], textColor: [0, 0, 0], halign: "left" } }],
      [{ content: "3", styles: { halign: "center" } }, "Moving Head", { content: "4", styles: { halign: "center" } }, { content: "Units", styles: { halign: "center" } }, { content: "250.000", styles: { halign: "right" } }, "Stage"],
    ]);
    expect(tableOptions?.body).toContainEqual(expect.arrayContaining([expect.objectContaining({ content: "Voucher" })]));
    expect(tableOptions?.body).toContainEqual(expect.arrayContaining([expect.objectContaining({ content: "Rp -110.000 (2%)" })]));
    expect(tableOptions?.body).toContainEqual(expect.arrayContaining([expect.objectContaining({ content: "Service Fee" })]));
    expect(tableOptions?.body).toContainEqual(expect.arrayContaining([expect.objectContaining({ content: "Rp 250.000" })]));
    expect(tableOptions?.columnStyles?.[4]).toEqual({ cellWidth: 35, halign: "right" });
    expect(tableOptions?.body?.at(-1)).toEqual(expect.arrayContaining([expect.objectContaining({ content: "Total" })]));
    expect(JSON.stringify(tableOptions?.body)).not.toContain("Special note");
  });

  it("generateQuotationPDF should render project quantity as one and item remark", async () => {
    await generateQuotationPDF({
      ...mockQuote,
      pdfProjects: [{
        name: "Audio Package",
        qty: 4,
        price: 5000000,
        remark: "Project remark",
        items: [{ name: "Mixer", qty: 2, remark: "FOH item" }],
      }],
    });

    const tableOptions = mockAutoTable.mock.calls.at(-1)?.[1];
    expect(tableOptions?.body?.slice(0, 2)).toEqual([
      [{ content: "1", styles: { halign: "center" } }, { content: "Audio Package", styles: { fontStyle: "bold" } }, { content: "1", styles: { halign: "center" } }, { content: "Unit", styles: { halign: "center" } }, { content: "5.000.000", styles: { halign: "right" } }, "Project remark"],
      ["", { content: "  • Mixer", styles: { fontStyle: "normal" } }, { content: "2", styles: { halign: "center" } }, { content: "Units", styles: { halign: "center" } }, "", "FOH item"],
    ]);
  });

  it("generateInvoicePDF should save as Invoice with INVOICE title", async () => {
    await generateInvoicePDF(mockQuote);

    expect(mockSave).toHaveBeenCalledWith("Invoice-Q-123.pdf");
    expect(mockText).toHaveBeenCalledWith("INVOICE", 105, 40, { align: "center" });
  });
});
