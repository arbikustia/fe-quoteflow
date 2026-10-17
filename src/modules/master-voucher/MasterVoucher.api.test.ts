import { _mapVoucher } from "./MasterVoucher.api";

const apiVoucher = {
  id: "voucher-1",
  name: "Launch Discount",
  code: "LAUNCH10",
  discount_percent: 10,
  status: 1,
  created_at: "2026-10-13T10:00:00Z",
  updated_at: "2026-10-13T11:00:00Z",
};

describe("MasterVoucher API", () => {
  it("should map API voucher to UI voucher", () => {
    const result = _mapVoucher(apiVoucher);

    expect(result).toEqual({
      id: "voucher-1",
      name: "Launch Discount",
      code: "LAUNCH10",
      discountPercent: 10,
      status: "active",
      createAt: "2026-10-13T10:00:00Z",
      createBy: null,
    });
  });

  it("should map inactive status", () => {
    const result = _mapVoucher({ ...apiVoucher, status: 0 });

    expect(result.status).toBe("inactive");
  });

});
