import type { PaymentListResponse } from "@/modules/payment/Payment.type";

export const MOCK_PAYMENT_RESPONSE: PaymentListResponse = {
  status: true,
  data: [
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      invoice_id: "INV-001",
      payment_method_id: "BCA",
      amount: 1000000,
      paid_at: "2026-10-27 18:11:02",
      reference_no: "SLO872",
      notes: "string",
      status: 0,
      created_at: "2026-10-27 18:11:02",
      updated_at: "2026-10-27 18:11:02",
    },
  ],
  messages: ["string"],
  page_number: 0,
  total_pages: 0,
  page_size: 0,
  total_count: 0,
  has_previous: true,
  has_next: true,
};
