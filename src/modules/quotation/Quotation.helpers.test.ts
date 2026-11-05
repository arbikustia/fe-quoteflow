import { describe, expect, it } from "@jest/globals";

import { getQuotationRowNumber, quotationToQuoteData } from "./Quotation.helpers";
import type { ApiQuotation, QuotationData } from "./Quotation.type";

describe("Quotation helpers", () => {
  it("calculates 1-based index across pages", () => {
    expect(getQuotationRowNumber(1, 10, 0)).toBe(1);
    expect(getQuotationRowNumber(1, 10, 4)).toBe(5);
    expect(getQuotationRowNumber(2, 10, 0)).toBe(11);
    expect(getQuotationRowNumber(3, 20, 2)).toBe(43);
  });

  it("converts QuotationData to QuoteData correctly", () => {
    const row: QuotationData = {
      id: "q-1",
      transactionId: "tx-1",
      quotationNumber: "QUO-001",
      customerName: "PT Maju",
      name: "Konser Musik",
      quotationDate: "2026-10-01",
      customerPhone: "0812345678",
      location: "Jakarta",
      startDate: "2026-11-01",
      endDate: "2026-11-02",
      grandTotal: 5000000,
      status: 1,
      items: [{ item_id: "item-1", item_name: "Speaker", qty: 7, price: 500000, subtotal: 3500000, remark: "Main hall" }],
    };

    const quote = quotationToQuoteData(row, new Map([["item-1", "Audio"]]));

    expect(quote.id).toBe("QUO-001");
    expect(quote.name).toBe("Konser Musik");
    expect(quote.customerName).toBe("PT Maju");
    expect(quote.location).toBe("Jakarta");
    expect(quote.startDate).toBe("2026-11-01");
    expect(quote.endDate).toBe("2026-11-02");
    expect(quote.grandTotal).toBe(5000000);
    expect(quote.status).toBe(1);
    expect(quote.pdfItems).toEqual([{ name: "Speaker", category: "Audio", qty: 7, price: 500000, remark: "Main hall" }]);
  });

  it("converts ApiQuotation to QuoteData correctly", () => {
    const apiQuote: ApiQuotation = {
      id: "api-q-1",
      transaction_id: "tx-1",
      quotation_no: "QUO-API-001",
      quotation_date: "2026-10-01",
      expired_at: "2026-10-05",
      notes: "Catatan khusus",
      status: 2,
      created_at: "2026-10-01",
      updated_at: "2026-10-01",
      transaction: {
        id: "tx-1",
        service_type_id: "srv-1",
        service_type_name: "Audio System",
        customer_name: "PT Sonic",
        customer_phone: "081999999",
        address: "Bandung",
        event_name: "Festival Jazz",
        start_at: "2026-11-10",
        end_at: "2026-11-12",
        subtotal: 10000000,
        service_fee: 500000,
        discount: 200000,
        grand_total: 10300000,
        status: 2,
        created_at: "2026-10-01",
        updated_at: "2026-10-01",
        rental_transaction_items: [
          {
            item_id: "item-1",
            item_name: "Speaker Line Array",
            qty: 2,
            price: 5000000,
            subtotal: 10000000,
            remark: "",
          },
        ],
        rental_transaction_project: [],
        rental_handovers: [],
        customer: {
          id: "c-1",
          name: "PT Sonic",
          address: "Bandung",
          phone_number: "081999999",
          status: 1,
          created_at: "2026-10-01",
          updated_at: "2026-10-01",
        },
        pic: {
          id: "pic-1",
          name: "Budi",
          status: 1,
          created_at: "2026-10-01",
          updated_at: "2026-10-01",
        },
        voucher: {
          id: "v-1",
          name: "PROMO",
          status: 1,
          created_at: "2026-10-01",
          updated_at: "2026-10-01",
        },
      },
    };

    const quote = quotationToQuoteData(apiQuote, new Map([["item-1", "Audio System"]]));

    expect(quote.id).toBe("QUO-API-001");
    expect(quote.name).toBe("Festival Jazz");
    expect(quote.customerName).toBe("PT Sonic");
    expect(quote.location).toBe("Bandung");
    expect(quote.category).toBe("Audio System");
    expect(quote.selectedItems).toEqual(["Speaker Line Array"]);
    expect(quote.pdfItems).toEqual([{ name: "Speaker Line Array", category: "Audio System", qty: 2, price: 5000000, remark: "" }]);
    expect(quote.remark).toBe("Catatan khusus");
    expect(quote.grandTotal).toBe(10300000);
    expect(quote.status).toBe(2);
  });
});
