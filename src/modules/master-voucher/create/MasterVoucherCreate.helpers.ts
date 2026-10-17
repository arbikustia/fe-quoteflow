const CODE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CODE_RANDOM_LENGTH = 6;
const VOUCHER_CODE_REGEX = /^[A-Za-z0-9]{7,8}$/;

/**
 * Generate cryptographically secure random 8-character voucher code starting with SL.
 * Format: SL + 6 random alphanumeric characters (total 8 chars).
 * @returns {string} Generated voucher code
 */
export const generateSecureVoucherCode = (): string => {
  const prefix = "SL";
  const bytes = new Uint8Array(1);
  const maxUnbiasedByte = Math.floor(256 / CODE_CHARSET.length) * CODE_CHARSET.length;

  if (typeof crypto === "undefined" || !crypto.getRandomValues) {
    throw new Error("Secure random generator is unavailable.");
  }

  let suffix = "";
  while (suffix.length < CODE_RANDOM_LENGTH) {
    crypto.getRandomValues(bytes);

    if (bytes[0] < maxUnbiasedByte) {
      suffix += CODE_CHARSET[bytes[0] % CODE_CHARSET.length];
    }
  }

  return `${prefix}${suffix}`;
};

/**
 * Validate typed voucher code.
 * Must be 7 to 8 alphanumeric characters.
 * @param {string} code - Voucher code to validate
 * @returns {string | null} Error message or null if valid
 */
export const validateTypedVoucherCode = (code: string): string | null => {
  const trimmed = code.trim();
  if (!trimmed) {
    return "Voucher code is required.";
  }

  if (!VOUCHER_CODE_REGEX.test(trimmed)) {
    return "Voucher code must be 7 to 8 alphanumeric characters.";
  }

  return null;
};
