import { mapPayment } from "./payment.service";
import type { ApiPayment } from "@/modules/payment/Payment.type";

const PAYMENT: ApiPayment = {
  id: "payment-1",
  invoice_id: "invoice-1",
  payment_method_id: "method-1",
  amount: 100000,
  paid_at: "2026-11-07",
  reference_no: "REF-1",
  notes: "",
  status: 1,
  created_at: "2026-11-07",
  updated_at: "2026-11-07",
};

describe("mapPayment", () => {
  it("uses fallback values when invoice customer data is missing", () => {
    const payment = {
      ...PAYMENT,
      invoice: { invoice_no: "INV-1" },
    } as ApiPayment;

    expect(mapPayment(payment)).toEqual(expect.objectContaining({
      invoiceNo: "INV-1",
      customerName: "-",
    }));
  });
});
