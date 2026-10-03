import type { PaymentTypeData } from "../modules/master-payment-type/MasterPaymentType.type";

export const MOCK_PAYMENT_TYPES: PaymentTypeData[] = [
  { id: "1", name: "Payment Type 1", status: "active", createAt: "2024-02-01T00:00:00Z", createBy: "Admin" },
  { id: "2", name: "Payment Type 2", status: "active", createAt: "2024-03-01T00:00:00Z", createBy: "Admin" },
  { id: "3", name: "Payment Type 3", status: "inactive", createAt: "2024-04-01T00:00:00Z", createBy: "Admin" },
  { id: "4", name: "Payment Type 4", status: "active", createAt: "2024-05-01T00:00:00Z", createBy: "Admin" },
  { id: "5", name: "Payment Type 5", status: "active", createAt: "2024-06-01T00:00:00Z", createBy: "Admin" },
  { id: "6", name: "Payment Type 6", status: "inactive", createAt: "2024-07-01T00:00:00Z", createBy: "Admin" },
  { id: "7", name: "Payment Type 7", status: "active", createAt: "2024-08-01T00:00:00Z", createBy: "Admin" },
  { id: "8", name: "Payment Type 8", status: "active", createAt: "2024-09-01T00:00:00Z", createBy: "Admin" },
  { id: "9", name: "Payment Type 9", status: "inactive", createAt: "2024-01-01T00:00:00Z", createBy: "Admin" },
  { id: "10", name: "Payment Type 10", status: "active", createAt: "2024-02-01T00:00:00Z", createBy: "Admin" }
];
