import { describe, expect, it } from "@jest/globals";

import { getVoucherDownloadFilename } from "./MasterVoucher.helpers";
import type { VoucherData } from "./MasterVoucher.type";

const VOUCHER: VoucherData = {
  id: "1",
  name: "Promo",
  code: "slght857",
  discountPercent: 10,
  status: "active",
  createAt: "2026-10-17",
  createBy: "Admin",
};

describe("voucher download helpers", () => {
  it("builds an uppercase JPEG filename from row code", () => {
    expect(getVoucherDownloadFilename(VOUCHER)).toBe("voucher-SLGHT857.jpeg");
  });
});
