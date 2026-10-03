import type { VoucherData } from "../modules/master-voucher/MasterVoucher.type";

export const MOCK_VOUCHERS: VoucherData[] = [
  { id: "1", code: "VOUCHER001", discountPercent: 5, status: "active", createAt: "2024-02-01T00:00:00Z", createBy: "Admin" },
  { id: "2", code: "VOUCHER002", discountPercent: 10, status: "active", createAt: "2024-03-01T00:00:00Z", createBy: "Admin" },
  { id: "3", code: "VOUCHER003", discountPercent: 15, status: "inactive", createAt: "2024-04-01T00:00:00Z", createBy: "Admin" },
  { id: "4", code: "VOUCHER004", discountPercent: 20, status: "active", createAt: "2024-05-01T00:00:00Z", createBy: "Admin" },
  { id: "5", code: "VOUCHER005", discountPercent: 25, status: "active", createAt: "2024-06-01T00:00:00Z", createBy: "Admin" },
  { id: "6", code: "VOUCHER006", discountPercent: 30, status: "inactive", createAt: "2024-07-01T00:00:00Z", createBy: "Admin" },
  { id: "7", code: "VOUCHER007", discountPercent: 35, status: "active", createAt: "2024-08-01T00:00:00Z", createBy: "Admin" },
  { id: "8", code: "VOUCHER008", discountPercent: 40, status: "active", createAt: "2024-09-01T00:00:00Z", createBy: "Admin" },
  { id: "9", code: "VOUCHER009", discountPercent: 45, status: "inactive", createAt: "2024-01-01T00:00:00Z", createBy: "Admin" },
  { id: "10", code: "VOUCHER010", discountPercent: 50, status: "active", createAt: "2024-02-01T00:00:00Z", createBy: "Admin" }
];
