import { z } from "zod";

import voucherTemplate from "@/assets/voucher_template.jpeg";

import { VOUCHER_IMAGE } from "./MasterVoucher.config";
import type { VoucherData, VoucherListQueryState, VoucherListStatus, VoucherListView, VoucherMutationResponse, VoucherRawResponse } from "./MasterVoucher.type";
import { VoucherListItemSchema } from "./MasterVoucher.type";

const VoucherListSchema = z.array(VoucherListItemSchema);

/**
 * Build an empty list view for a state without rows.
 * @param {VoucherListStatus} listStatus - List state to render
 * @returns {VoucherListView} - List view without rows
 */
const _createEmptyListView = (listStatus: VoucherListStatus): VoucherListView => ({
  listStatus,
  vouchers: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Normalize the paged voucher query into list view data (single upstream fallback).
 * @param {VoucherListQueryState} queryState - RTK Query data and flags
 * @returns {VoucherListView} - Normalized list view data
 */
export const normalizeVoucherList = (queryState: VoucherListQueryState): VoucherListView => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return _createEmptyListView("loading");
  }

  if (isError) {
    return _createEmptyListView("error");
  }

  const parsedVouchers = VoucherListSchema.safeParse(data?.data);

  if (!data || !parsedVouchers.success) {
    return _createEmptyListView("missing");
  }

  return {
    listStatus: parsedVouchers.data.length === 0 ? "empty" : "ready",
    vouchers: parsedVouchers.data,
    totalPages: data.total_pages,
    totalCount: data.total_count,
  };
};

/**
 * Calculate the display row number of a voucher table row.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} - One-based row number across pages
 */
export const getVoucherRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => {
  return (currentPage - 1) * pageSize + rowIndex + 1;
};

/**
 * Normalize a voucher detail / mutation response: the backend sends one voucher or a list of one.
 * @param {VoucherRawResponse} response - Raw response
 * @returns {VoucherMutationResponse} - Response with a single voucher or null
 */
export const normalizeVoucherResponse = (response: VoucherRawResponse): VoucherMutationResponse => ({
  ...response,
  data: Array.isArray(response.data) ? (response.data[0] ?? null) : response.data,
});

/**
 * Build the JPEG filename of a voucher download.
 * @param {VoucherData} voucher - Voucher row
 * @returns {string} - Download filename
 */
export const getVoucherDownloadFilename = (voucher: VoucherData): string => `voucher-${voucher.code.toUpperCase()}.jpeg`;

/**
 * Load the voucher template artwork.
 * @param {string} source - Image source URL
 * @returns {Promise<HTMLImageElement>} - Loaded image
 */
const _loadImage = (source: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();

    /**
     * Resolve with the loaded image.
     * @returns {void}
     */
    image.onload = (): void => resolve(image);
    /**
     * Reject when the image cannot be loaded.
     * @returns {void}
     */
    image.onerror = (): void => reject(new Error("Voucher template could not be loaded."));
    image.src = source;
  });

/**
 * Draw the discount percentage with its underline.
 * @param {CanvasRenderingContext2D} context - Canvas context
 * @param {number} discountPercent - Discount value
 * @returns {void}
 */
const _drawVoucherDiscount = (context: CanvasRenderingContext2D, discountPercent: number): void => {
  const discountText = `${discountPercent}%`;

  context.fillStyle = VOUCHER_IMAGE.PALE_BLUE;
  context.fillRect(900, 290, 650, 225);
  context.fillStyle = VOUCHER_IMAGE.NAVY;
  context.font = "900 190px Poppins, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  context.fillText(discountText, 1230, 480);

  const underlineWidth = Math.ceil(context.measureText(discountText).width);

  context.fillStyle = VOUCHER_IMAGE.ORANGE;
  context.fillRect(1230 - underlineWidth / 2, 500, underlineWidth, 7);
};

/**
 * Draw the voucher code card, shrinking the code to fit the card width.
 * @param {CanvasRenderingContext2D} context - Canvas context
 * @param {string} code - Voucher code
 * @returns {void}
 */
const _drawVoucherCode = (context: CanvasRenderingContext2D, code: string): void => {
  const [left, top, right, bottom] = [995, 534, 1490, 660];
  const width = right - left;
  const center = (left + right) / 2;
  const codeText = code.toUpperCase();

  context.fillStyle = VOUCHER_IMAGE.WHITE;
  context.fillRect(left, top, width, bottom - top);
  context.save();
  context.beginPath();
  context.rect(left, top, width, bottom - top);
  context.clip();
  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  context.fillStyle = VOUCHER_IMAGE.NAVY;
  context.font = "700 24px Poppins, Arial, sans-serif";
  context.fillText("KODE VOUCHER", center, 561);
  context.fillStyle = VOUCHER_IMAGE.CODE_ORANGE;
  context.font = `900 ${VOUCHER_IMAGE.CODE_FONT_SIZE}px Poppins, Arial, sans-serif`;

  const renderedWidth = context.measureText(codeText).width;
  const fontSize = renderedWidth > width ? Math.floor((VOUCHER_IMAGE.CODE_FONT_SIZE * width) / renderedWidth) : VOUCHER_IMAGE.CODE_FONT_SIZE;

  context.font = `900 ${fontSize}px Poppins, Arial, sans-serif`;
  context.fillText(codeText, center, 647);
  context.restore();
};

/**
 * Download a JPEG of the voucher template; only the discount and code are dynamic.
 * @param {VoucherData} voucher - Voucher row
 * @returns {Promise<void>} - Resolves once the download starts
 */
export const downloadVoucherImage = async (voucher: VoucherData): Promise<void> => {
  const [template] = await Promise.all([_loadImage(voucherTemplate), document.fonts.ready]);
  const canvas = document.createElement("canvas");

  canvas.width = VOUCHER_IMAGE.WIDTH;
  canvas.height = VOUCHER_IMAGE.HEIGHT;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Voucher image canvas is unavailable.");
  }

  context.drawImage(template, 0, 0, VOUCHER_IMAGE.WIDTH, VOUCHER_IMAGE.HEIGHT);
  _drawVoucherDiscount(context, voucher.discountPercent);
  _drawVoucherCode(context, voucher.code);

  const link = document.createElement("a");

  link.href = canvas.toDataURL("image/jpeg", VOUCHER_IMAGE.JPEG_QUALITY);
  link.download = getVoucherDownloadFilename(voucher);
  link.click();
};
