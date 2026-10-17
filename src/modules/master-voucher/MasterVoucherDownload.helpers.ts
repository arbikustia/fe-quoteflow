import voucherTemplate from "../../assets/voucher_template.jpeg";

import type { VoucherData } from "./MasterVoucher.type";

const VOUCHER_WIDTH = 1600;
const VOUCHER_HEIGHT = 800;
const PALE_BLUE = "#F4F8FD";
const NAVY = "#082F5D";
const ORANGE = "#FF8A00";
const CODE_ORANGE = "#F04416";

/**
 * Build a safe JPEG filename for a voucher download.
 * @param {VoucherData} voucher - Voucher row
 * @returns {string} Download filename
 */
export const getVoucherDownloadFilename = (voucher: VoucherData): string =>
  `voucher-${voucher.code.toUpperCase()}.jpeg`;

/**
 * Load an image resource.
 * @param {string} source - Image source URL
 * @returns {Promise<HTMLImageElement>} Loaded image
 */
const _loadImage = (source: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = (): void => resolve(image);
    image.onerror = (): void =>
      reject(new Error("Voucher template could not be loaded."));
    image.src = source;
  });

/**
 * Download a 1600 x 800 JPEG from source template artwork.
 * Only discount and voucher code values are dynamic.
 * @param {VoucherData} voucher - Voucher row data
 * @returns {Promise<void>} Resolves after download starts
 */
export const downloadVoucherTemplate = async (
  voucher: VoucherData,
): Promise<void> => {
  const [template] = await Promise.all([
    _loadImage(voucherTemplate),
    document.fonts.ready,
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = VOUCHER_WIDTH;
  canvas.height = VOUCHER_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Voucher image canvas is unavailable.");
  }

  context.drawImage(template, 0, 0, VOUCHER_WIDTH, VOUCHER_HEIGHT);

  // Template branding, background, ornaments, and layout remain untouched.
  const discountText = `${voucher.discountPercent}%`;
  context.fillStyle = PALE_BLUE;
  context.fillRect(900, 290, 650, 225);
  context.fillStyle = NAVY;
  context.font = "900 190px Poppins, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  context.fillText(discountText, 1230, 480);

  const underlineWidth = Math.ceil(context.measureText(discountText).width);
  context.fillStyle = ORANGE;
  context.fillRect(1230 - underlineWidth / 2, 500, underlineWidth, 7);

  const codeLeft = 995;
  const codeTop = 534;
  const codeRight = 1490;
  const codeBottom = 660;
  const codeWidth = codeRight - codeLeft;
  const codeCenter = (codeLeft + codeRight) / 2;
  const codeText = voucher.code.toUpperCase();

  // Preserve original orange frame and replace only white code-card interior.
  context.fillStyle = "#FFFFFF";
  context.fillRect(codeLeft, codeTop, codeWidth, codeBottom - codeTop);
  context.save();
  context.beginPath();
  context.rect(codeLeft, codeTop, codeWidth, codeBottom - codeTop);
  context.clip();
  context.textAlign = "center";
  context.textBaseline = "alphabetic";

  context.fillStyle = NAVY;
  context.font = "700 24px Poppins, Arial, sans-serif";
  context.fillText("KODE VOUCHER", codeCenter, 561);

  context.fillStyle = CODE_ORANGE;
  context.font = "900 86px Poppins, Arial, sans-serif";
  const renderedCodeWidth = context.measureText(codeText).width;
  const codeFontSize = renderedCodeWidth > codeWidth
    ? Math.floor((86 * codeWidth) / renderedCodeWidth)
    : 86;
  context.font = `900 ${codeFontSize}px Poppins, Arial, sans-serif`;
  context.fillText(codeText, codeCenter, 647);
  context.restore();

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/jpeg", 0.95);
  link.download = getVoucherDownloadFilename(voucher);
  link.click();
};
