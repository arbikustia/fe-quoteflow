import jsPDF from "jspdf";
import QRCode from "qrcode";
import { z } from "zod";

import { ITEM_QR_LABEL } from "./MasterItem.config";
import type {
  ItemDownloadFormat,
  ItemLabel,
  ItemLabelPosition,
  ItemListQueryState,
  ItemListStatus,
  ItemListView,
} from "./MasterItem.type";
import { ItemListItemSchema } from "./MasterItem.type";

const ItemListSchema = z.array(ItemListItemSchema);

const LABEL_TEXT_OFFSET_MM = ITEM_QR_LABEL.QR_SIZE_MM + ITEM_QR_LABEL.HORIZONTAL_PADDING_MM + ITEM_QR_LABEL.QR_TEXT_GAP_MM;

/**
 * Build an empty list view for a state without rows.
 * @param {ItemListStatus} listStatus - List state to render
 * @returns {ItemListView} - List view without rows
 */
const _createEmptyListView = (listStatus: ItemListStatus): ItemListView => ({
  listStatus,
  items: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Normalize the paged item query into list view data (single upstream fallback).
 * @param {ItemListQueryState} queryState - RTK Query data and flags
 * @returns {ItemListView} - Normalized list view data
 */
export const normalizeItemList = (queryState: ItemListQueryState): ItemListView => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return _createEmptyListView("loading");
  }

  if (isError || data?.status === false) {
    return _createEmptyListView("error");
  }

  const parsedItems = ItemListSchema.safeParse(data?.data);

  if (!data || !parsedItems.success) {
    return _createEmptyListView("missing");
  }

  return {
    listStatus: parsedItems.data.length === 0 ? "empty" : "ready",
    items: parsedItems.data,
    totalPages: data.total_pages,
    totalCount: data.total_count,
  };
};

/**
 * Calculate the display row number of an item table row.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} - One-based row number across pages
 */
export const getItemRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => {
  return (currentPage - 1) * pageSize + rowIndex + 1;
};

/**
 * Format an amount as Indonesian Rupiah.
 * @param {number} amount - Amount in Rupiah
 * @returns {string} - Formatted amount, e.g. `Rp 100.000`
 */
export const formatRupiah = (amount: number): string => `Rp ${amount.toLocaleString("id-ID")}`;

/**
 * Build the category line printed on a QR label.
 * @param {ItemLabel} item - Item label data
 * @returns {string} - Category line
 */
const _getLabelCategory = (item: ItemLabel): string => `CAT: ${item.categoryName.toUpperCase()}`;

/**
 * Get the label width from its longest printed line.
 * @param {jsPDF} pdfDocument - PDF document used to measure text
 * @param {ItemLabel} item - Item label data
 * @returns {number} - Label width in millimetres
 */
export const _getLabelWidth = (pdfDocument: jsPDF, item: ItemLabel): number => {
  pdfDocument.setFontSize(ITEM_QR_LABEL.FONT_SIZE_PT);
  pdfDocument.setFont("helvetica", "bold");
  const nameWidth = pdfDocument.getTextWidth(item.name.toUpperCase());

  pdfDocument.setFont("helvetica", "normal");
  const categoryWidth = pdfDocument.getTextWidth(_getLabelCategory(item));
  const contentWidth = Math.max(nameWidth, categoryWidth) + LABEL_TEXT_OFFSET_MM + ITEM_QR_LABEL.HORIZONTAL_PADDING_MM * 2;

  return Math.max(ITEM_QR_LABEL.MIN_WIDTH_MM, contentWidth);
};

/**
 * Pack labels left to right, top to bottom, starting a new page when one is full.
 * @param {number[]} labelWidths - Label widths in millimetres
 * @param {number} pageWidth - PDF page width
 * @param {number} pageHeight - PDF page height
 * @returns {ItemLabelPosition[]} - Label positions
 */
export const _getLabelPositions = (labelWidths: number[], pageWidth: number, pageHeight: number): ItemLabelPosition[] => {
  const { PAGE_MARGIN_MM, HEIGHT_MM, LABEL_GAP_MM } = ITEM_QR_LABEL;
  const maxX = pageWidth - PAGE_MARGIN_MM;
  const maxY = pageHeight - PAGE_MARGIN_MM;
  let page = 0;
  let x: number = PAGE_MARGIN_MM;
  let y: number = PAGE_MARGIN_MM;

  return labelWidths.map((width) => {
    if (x > PAGE_MARGIN_MM && x + width > maxX) {
      x = PAGE_MARGIN_MM;
      y += HEIGHT_MM + LABEL_GAP_MM;
    }

    if (y + HEIGHT_MM > maxY) {
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
 * Draw one bordered QR label on the PDF.
 * @param {jsPDF} pdfDocument - PDF document
 * @param {ItemLabel} item - Item label data
 * @param {string} qrDataUrl - QR image data URL
 * @param {ItemLabelPosition} position - Label position and width
 * @returns {void}
 */
const _drawPdfLabel = (pdfDocument: jsPDF, item: ItemLabel, qrDataUrl: string, position: ItemLabelPosition): void => {
  const { x, y, width } = position;
  const textX = x + LABEL_TEXT_OFFSET_MM;

  pdfDocument.rect(x, y, width, ITEM_QR_LABEL.HEIGHT_MM);
  pdfDocument.addImage(
    qrDataUrl,
    "PNG",
    x + ITEM_QR_LABEL.HORIZONTAL_PADDING_MM,
    y + ITEM_QR_LABEL.VERTICAL_PADDING_MM,
    ITEM_QR_LABEL.QR_SIZE_MM,
    ITEM_QR_LABEL.QR_SIZE_MM,
  );
  pdfDocument.setFont("helvetica", "bold");
  pdfDocument.setFontSize(ITEM_QR_LABEL.FONT_SIZE_PT);
  pdfDocument.text(item.name.toUpperCase(), textX, y + ITEM_QR_LABEL.NAME_BASELINE_MM);
  pdfDocument.setFont("helvetica", "normal");
  pdfDocument.text(_getLabelCategory(item), textX, y + ITEM_QR_LABEL.CATEGORY_BASELINE_MM);
};

/**
 * Encode the item id as a QR image.
 * @param {ItemLabel} item - Item to encode
 * @returns {Promise<string>} - QR image data URL
 */
const _createQrDataUrl = (item: ItemLabel): Promise<string> => QRCode.toDataURL(item.id, {
  errorCorrectionLevel: "M",
  margin: 0,
  width: 256,
});

/**
 * Load an image from a data URL.
 * @param {string} dataUrl - Image data URL
 * @returns {Promise<HTMLImageElement>} - Loaded image
 */
const _loadImage = (dataUrl: string): Promise<HTMLImageElement> => new Promise((resolve) => {
  const image = new Image();

  /**
   * Resolve once the image has loaded.
   * @returns {void}
   */
  const handleLoad = (): void => resolve(image);

  image.onload = handleLoad;
  image.src = dataUrl;
});

/**
 * Trigger a browser file download.
 * @param {string} dataUrl - File data URL
 * @param {string} fileName - Download file name
 * @returns {void}
 */
const _downloadDataUrl = (dataUrl: string, fileName: string): void => {
  const link = document.createElement("a");

  link.href = dataUrl;
  link.download = fileName;
  link.click();
};

/**
 * Draw one QR label on a canvas at export scale.
 * @param {CanvasRenderingContext2D} context - Canvas context
 * @param {ItemLabel} item - Item label data
 * @param {HTMLImageElement} qrImage - Loaded QR image
 * @returns {void}
 */
const _drawCanvasLabel = (context: CanvasRenderingContext2D, item: ItemLabel, qrImage: HTMLImageElement): void => {
  const scale = ITEM_QR_LABEL.IMAGE_SCALE;
  const fontSize = ITEM_QR_LABEL.FONT_SIZE_PT * ITEM_QR_LABEL.PIXELS_PER_POINT_AT_EXPORT_SCALE;
  const { width, height } = context.canvas;
  const qrSize = ITEM_QR_LABEL.QR_SIZE_MM * scale;

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "#000000";
  context.lineWidth = 2;
  context.strokeRect(1, 1, width - 2, height - 2);
  context.drawImage(qrImage, ITEM_QR_LABEL.HORIZONTAL_PADDING_MM * scale, ITEM_QR_LABEL.VERTICAL_PADDING_MM * scale, qrSize, qrSize);
  context.fillStyle = "#000000";
  context.textBaseline = "alphabetic";
  context.font = `600 ${fontSize}px Arial`;
  context.fillText(item.name.toUpperCase(), LABEL_TEXT_OFFSET_MM * scale, ITEM_QR_LABEL.NAME_BASELINE_MM * scale);
  context.font = `${fontSize}px Arial`;
  context.fillText(_getLabelCategory(item), LABEL_TEXT_OFFSET_MM * scale, ITEM_QR_LABEL.CATEGORY_BASELINE_MM * scale);
};

/**
 * Download one item QR label as a JPEG image.
 * @param {ItemLabel} item - Item label data
 * @returns {Promise<void>} - Resolves when the download starts
 */
export const downloadItemQrImage = async (item: ItemLabel): Promise<void> => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  const width = _getLabelWidth(new jsPDF({ format: "a4", unit: "mm" }), item);
  const qrImage = await _loadImage(await _createQrDataUrl(item));

  canvas.width = Math.ceil(width * ITEM_QR_LABEL.IMAGE_SCALE);
  canvas.height = ITEM_QR_LABEL.HEIGHT_MM * ITEM_QR_LABEL.IMAGE_SCALE;
  _drawCanvasLabel(context, item, qrImage);
  _downloadDataUrl(canvas.toDataURL("image/jpeg", ITEM_QR_LABEL.IMAGE_QUALITY), `qr-${item.id}.jpg`);
};

/**
 * Download item QR labels packed on A4 pages as one PDF.
 * @param {ItemLabel[]} items - Items to print
 * @returns {Promise<void>} - Resolves when the PDF is saved
 */
export const downloadItemQrPdf = async (items: ItemLabel[]): Promise<void> => {
  const pdfDocument = new jsPDF({ format: "a4", unit: "mm" });
  const labelWidths = items.map((item) => _getLabelWidth(pdfDocument, item));
  const positions = _getLabelPositions(labelWidths, pdfDocument.internal.pageSize.getWidth(), pdfDocument.internal.pageSize.getHeight());
  const qrDataUrls = await Promise.all(items.map(_createQrDataUrl));

  items.forEach((item, index) => {
    const position = positions[index];

    if (index > 0 && positions[index - 1].page !== position.page) {
      pdfDocument.addPage();
    }

    _drawPdfLabel(pdfDocument, item, qrDataUrls[index], position);
  });

  pdfDocument.save(ITEM_QR_LABEL.PDF_FILE_NAME);
};

/**
 * Download one item QR label in the requested format.
 * @param {ItemLabel} item - Item label data
 * @param {ItemDownloadFormat} format - Image or PDF
 * @returns {Promise<void>} - Resolves when the download starts
 */
export const downloadItemLabel = (item: ItemLabel, format: ItemDownloadFormat): Promise<void> => {
  switch (format) {
    case "image":
      return downloadItemQrImage(item);
    case "pdf":
      return downloadItemQrPdf([item]);
    default: {
      const unknownFormat: never = format;

      throw new Error(`Unknown download format: ${String(unknownFormat)}`);
    }
  }
};
