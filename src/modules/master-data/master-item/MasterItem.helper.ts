import jsPDF from "jspdf";
import QRCode from "qrcode";

import type { ItemData } from "./MasterItem.type";

const LABEL_WIDTH_MM = 33;
const LABEL_HEIGHT_MM = 15;
const QR_SIZE_MM = 13;
const LABEL_HORIZONTAL_PADDING_MM = 1;
const LABEL_VERTICAL_PADDING_MM = 1;
const LABEL_QR_TEXT_GAP_MM = 1;
const LABEL_TEXT_OFFSET_MM = QR_SIZE_MM + LABEL_HORIZONTAL_PADDING_MM + LABEL_QR_TEXT_GAP_MM;
const LABEL_NAME_FONT_SIZE = 6;
const LABEL_CATEGORY_FONT_SIZE = LABEL_NAME_FONT_SIZE;
const PIXELS_PER_POINT_AT_EXPORT_SCALE = 3.528;
const PAGE_MARGIN_MM = 15;
const LABEL_GAP_MM = 2;

/**
 * Get label width from longest printed content.
 * @param {jsPDF} document - PDF document
 * @param {ItemData} item - Item label data
 * @returns {number} Label width in millimetres
 */
const _getLabelWidth = (document: jsPDF, item: ItemData): number => {
  document.setFontSize(LABEL_NAME_FONT_SIZE);
  document.setFont("helvetica", "bold");
  const nameWidth = document.getTextWidth(item.name.toUpperCase());

  document.setFont("helvetica", "normal");
  document.setFontSize(LABEL_CATEGORY_FONT_SIZE);
  const categoryWidth = document.getTextWidth(`CAT: ${(item.categoryName ?? "-").toUpperCase()}`);
  const contentWidth = Math.max(nameWidth, categoryWidth) + LABEL_TEXT_OFFSET_MM + (LABEL_HORIZONTAL_PADDING_MM * 2);

  return Math.max(LABEL_WIDTH_MM, contentWidth);
};

/**
 * Get packed label positions without crossing page bounds.
 * @param {number[]} labelWidths - Label widths
 * @param {number} pageWidth - PDF page width
 * @param {number} pageHeight - PDF page height
 * @returns {{page: number, x: number, y: number, width: number}[]} Label positions
 */
const _getLabelPositions = (labelWidths: number[], pageWidth: number, pageHeight: number): { page: number; x: number; y: number; width: number }[] => {
  const maxX = pageWidth - PAGE_MARGIN_MM;
  const maxY = pageHeight - PAGE_MARGIN_MM;
  let page = 0;
  let x = PAGE_MARGIN_MM;
  let y = PAGE_MARGIN_MM;

  return labelWidths.map((width) => {
    if (x > PAGE_MARGIN_MM && x + width > maxX) {
      x = PAGE_MARGIN_MM;
      y += LABEL_HEIGHT_MM + LABEL_GAP_MM;
    }

    if (y + LABEL_HEIGHT_MM > maxY) {
      page += 1;
      x = PAGE_MARGIN_MM;
      y = PAGE_MARGIN_MM;
    }

    const position = { page, x, y, width };

    x += width + LABEL_GAP_MM;

    return position;
  });
};

/**
 * Draw one bordered QR label.
 * @param {jsPDF} document - PDF document
 * @param {ItemData} item - Item label data
 * @param {string} qr - QR data URL
 * @param {{x: number, y: number, width: number}} position - Label position and width
 * @returns {void} No return value
 */
const _drawPdfLabel = (document: jsPDF, item: ItemData, qr: string, position: { x: number; y: number; width: number }): void => {
  const { x, y, width: labelWidth } = position;

  document.rect(x, y, labelWidth, LABEL_HEIGHT_MM);
  document.addImage(qr, "PNG", x + LABEL_HORIZONTAL_PADDING_MM, y + LABEL_VERTICAL_PADDING_MM, QR_SIZE_MM, QR_SIZE_MM);
  const textAreaStart = x + LABEL_TEXT_OFFSET_MM;
  const name = item.name.toUpperCase();
  const category = `CAT: ${(item.categoryName ?? "-").toUpperCase()}`;
  const textTop = y + 4.5;

  document.setFont("helvetica", "bold");
  document.setFontSize(LABEL_NAME_FONT_SIZE);
  document.text(name, textAreaStart, textTop);
  document.setFont("helvetica", "normal");
  document.setFontSize(LABEL_CATEGORY_FONT_SIZE);
  document.text(category, textAreaStart, textTop + 4);
};

/**
 * Create QR data URL from item ID.
 * @param {ItemData} item - Item to encode
 * @returns {Promise<string>} QR image data URL
 */
const _createQrDataUrl = (item: ItemData): Promise<string> => QRCode.toDataURL(item.id, {
  errorCorrectionLevel: "M",
  margin: 0,
  width: 256,
});

/**
 * Trigger browser file download.
 * @param {string} dataUrl - File data URL
 * @param {string} filename - Download filename
 * @returns {void} No return value
 */
const _downloadDataUrl = (dataUrl: string, filename: string): void => {
  const link = document.createElement("a");

  link.href = dataUrl;
  link.download = filename;
  link.click();
};

/**
 * Download item label as JPEG at 33 mm x 15 mm.
 * @param {ItemData} item - Item label data
 * @returns {Promise<void>} Completion promise
 */
// ponytail: image export remains one browser-side drawing operation.
export const downloadItemQrImage = async (item: ItemData): Promise<void> => {
  const pdfDocument = new jsPDF({ format: "a4", unit: "mm" });
  const qr = await _createQrDataUrl(item);
  const width = _getLabelWidth(pdfDocument, item);
  const scale = 10;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  canvas.width = Math.ceil(width * scale);
  canvas.height = LABEL_HEIGHT_MM * scale;
  const qrImage = new Image();

  qrImage.src = qr;
  await new Promise<void>((resolve) => {
    /**
     * Resolve image loading.
     * @returns {void} No return value
     */
    const handleLoad = (): void => resolve();

    qrImage.onload = handleLoad;
  });
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#000000";
  context.lineWidth = 2;
  context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
  context.drawImage(qrImage, LABEL_HORIZONTAL_PADDING_MM * scale, LABEL_VERTICAL_PADDING_MM * scale, QR_SIZE_MM * scale, QR_SIZE_MM * scale);
  context.fillStyle = "#000000";
  context.textBaseline = "alphabetic";
  context.font = `600 ${LABEL_NAME_FONT_SIZE * PIXELS_PER_POINT_AT_EXPORT_SCALE}px Arial`;
  context.fillText(item.name.toUpperCase(), LABEL_TEXT_OFFSET_MM * scale, 4.5 * scale);
  context.font = `${LABEL_CATEGORY_FONT_SIZE * PIXELS_PER_POINT_AT_EXPORT_SCALE}px Arial`;
  context.fillText(`CAT: ${(item.categoryName ?? "-").toUpperCase()}`, LABEL_TEXT_OFFSET_MM * scale, 8.5 * scale);
  _downloadDataUrl(canvas.toDataURL("image/jpeg", 0.95), `qr-${item.id}.jpg`);
};

/**
 * Download selected item labels on A4 grid.
 * @param {ItemData[]} items - Items to print
 * @returns {Promise<void>} Completion promise
 */
export const downloadItemQrPdf = async (items: ItemData[]): Promise<void> => {
  const document = new jsPDF({ format: "a4", unit: "mm" });
  const pageWidth = document.internal.pageSize.getWidth();
  const pageHeight = document.internal.pageSize.getHeight();
  const labelWidths = items.map((item) => _getLabelWidth(document, item));
  const positions = _getLabelPositions(labelWidths, pageWidth, pageHeight);

  for (const [index, item] of items.entries()) {
    const position = positions[index];

    if (position.page > 0 && positions[index - 1]?.page !== position.page) {
      document.addPage();
    }

    const qr = await _createQrDataUrl(item);

    _drawPdfLabel(document, item, qr, position);
  }

  document.save("qr-items.pdf");
};
