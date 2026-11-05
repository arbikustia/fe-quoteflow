import { describe, expect, it } from "@jest/globals";

import { invoiceToQuoteData } from "./Invoice.helpers";
import type { ApiInvoice, InvoiceData } from "./Invoice.type";

describe("Invoice helpers", () => {
  it("converts InvoiceData to QuoteData correctly", () => {
    const row: InvoiceData = {
      id: "inv-1",
      transactionId: "tx-1",
      invoiceNumber: "INV-001",
      invoiceDate: "2026-10-01",
      dueDate: "2026-10-15",
      customerName: "PT Maju Bersama",
      name: "Pameran Industri",
      customerPhone: "08123456789",
      location: "ICE BSD",
      startDate: "2026-11-01",
      endDate: "2026-11-03",
      grandTotal: 15000000,
      status: 1,
      notes: "Invoice DP 50%",
    };

    const quote = invoiceToQuoteData(row);

    expect(quote.id).toBe("INV-001");
    expect(quote.name).toBe("Pameran Industri");
    expect(quote.location).toBe("ICE BSD");
    expect(quote.startDate).toBe("2026-11-01");
    expect(quote.endDate).toBe("2026-11-03");
    expect(quote.grandTotal).toBe(15000000);
    expect(quote.status).toBe(1);
    expect(quote.remark).toBe("Invoice DP 50%");
  });

  it("converts ApiInvoice to QuoteData correctly", () => {
    const apiInvoice: ApiInvoice = {
      id: "api-inv-1",
      transaction_id: "tx-1",
      invoice_no: "INV-API-001",
      invoice_date: "2026-10-01",
      due_date: "2026-10-15",
      notes: "Full payment",
      status: 2,
      created_at: "2026-10-01",
      updated_at: "2026-10-01",
      quotation: {
        id: "q-1",
        transaction_id: "tx-1",
        quotation_no: "QUO-001",
        quotation_date: "2026-09-20",
        expired_at: "2026-09-25",
        notes: "",
        status: 2,
        created_at: "2026-09-20",
        updated_at: "2026-09-20",
        transaction: {
          id: "tx-1",
          service_type_id: "srv-1",
          service_type_name: "Audio Visual",
          customer_name: "PT Multi Solusi",
          customer_phone: "08198765432",
          address: "Surabaya Expo Center",
          event_name: "Expo Digital 2026",
          start_at: "2026-11-20",
          end_at: "2026-11-22",
          subtotal: 20000000,
          service_fee: 1000000,
          discount: 500000,
          grand_total: 20500000,
          status: 2,
          created_at: "2026-09-20",
          updated_at: "2026-09-20",
          rental_transaction_items: [
            {
              item_id: "item-1",
              item_name: "LED Videowall P2.9",
              category_name: "Visual",
              qty: 1,
              price: 20000000,
              subtotal: 20000000,
              remark: "",
            },
          ],
          rental_transaction_project: [],
          rental_handovers: [],
          customer: {
            id: "c-1",
            name: "PT Multi Solusi",
            status: 1,
            created_at: "2026-09-20",
            updated_at: "2026-09-20",
            address: "Surabaya",
            phone_number: "08198765432",
          },
          pic: {
            id: "pic-1",
            name: "Doni",
            status: 1,
            created_at: "2026-09-20",
            updated_at: "2026-09-20",
          },
          voucher: {
            id: "v-1",
            name: "DISC",
            status: 1,
            created_at: "2026-09-20",
            updated_at: "2026-09-20",
          },
        },
      },
      payments: [],
    };

    const quote = invoiceToQuoteData(apiInvoice);

    expect(quote.id).toBe("INV-API-001");
    expect(quote.name).toBe("Expo Digital 2026");
    expect(quote.location).toBe("Surabaya Expo Center");
    expect(quote.category).toBe("Audio Visual");
    expect(quote.selectedItems).toEqual(["LED Videowall P2.9"]);
    expect(quote.grandTotal).toBe(20500000);
    expect(quote.status).toBe(2);
    expect(quote.remark).toBe("Full payment");
  });
});
