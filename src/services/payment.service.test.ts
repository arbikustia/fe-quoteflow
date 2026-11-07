import { mapPayment, mapPaymentSummary } from "./payment.service";
import type { ApiPayment, ApiPaymentSummary } from "@/modules/payment/Payment.type";

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

  it("uses a numeric fallback when amount is missing", () => {
    const payment = { ...PAYMENT, amount: undefined } as unknown as ApiPayment;

    expect(mapPayment(payment).amount).toBe(0);
  });
});

describe("mapPaymentSummary", () => {
  it("maps the invoice payment summary to a table row", () => {
    const summary: ApiPaymentSummary = {
      invoice_id: "invoice-1",
      invoice_no: "INV-1",
      customer_name: "ADE PUTRI",
      grand_total: 1000000,
      total_paid: 400000,
      remaining_amount: 600000,
      status: "Partial",
      payments: [
        { id: "payment-1", payment_method_id: "method-1", payment_method_name: "Cash", amount: 400000, paid_at: "2026-11-07", notes: "DP" },
      ],
    };

    expect(mapPaymentSummary(summary)).toEqual(
      expect.objectContaining({
        id: "invoice-1",
        invoiceNo: "INV-1",
        customerName: "ADE PUTRI",
        amount: 400000,
        paidAt: "2026-11-07",
        remainingAmount: 600000,
        statusLabel: "Partial",
        status: "inactive",
      }),
    );
  });

  it("marks the invoice as active when nothing is left to pay", () => {
    const summary = {
      invoice_id: "invoice-2",
      invoice_no: "INV-2",
      customer_name: "BUDI",
      grand_total: 500000,
      total_paid: 500000,
      remaining_amount: 0,
      status: "Paid",
      payments: [],
    } as unknown as ApiPaymentSummary;

    const row = mapPaymentSummary(summary);

    expect(row.status).toBe("active");
    expect(row.paidAt).toBe("");
  });
});
