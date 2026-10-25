import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import QuotationContainer from "./Quotation.container";
import type { QuotationListResponse } from "./Quotation.type";

jest.mock("@/services/quotation.service", () => ({
  useGetQuotationsQuery: (): { data: QuotationListResponse; isLoading: boolean; error: string | null } => ({
    data: {
      status: true,
      data: [
        {
          id: "quo-1",
          transaction_id: "tx-1",
          quotation_no: "QUO-001",
          quotation_date: "2026-10-24T16:44:53.633Z",
          expired_at: "2026-10-24T16:44:53.633Z",
          notes: "",
          status: 0,
          created_at: "2026-10-24T16:44:53.633Z",
          updated_at: "2026-10-24T16:44:53.633Z",
          transaction: {
            id: "tx-1",
            service_type_id: "st-1",
            service_type_name: "Rental",
            customer_name: "John",
            customer_phone: "0812345678",
            address: "Jakarta",
            event_name: "Music Festival",
            start_at: "2026-10-24T16:44:53.633Z",
            end_at: "2026-10-24T16:44:53.633Z",
            subtotal: 10000000,
            service_fee: 500000,
            discount: 0,
            grand_total: 10500000,
            status: 0,
            created_at: "2026-10-24T16:44:53.633Z",
            updated_at: "2026-10-24T16:44:53.633Z",
            rental_transaction_items: [],
            rental_transaction_project: [],
            customer: { id: "c-1", name: "John", address: "Jakarta", phone_number: "0812345678", status: 1, created_at: "", updated_at: "" },
            pic: { id: "p-1", name: "PIC", status: 1, created_at: "", updated_at: "" },
            voucher: { id: "v-1", name: "V", code: "V", discount_percent: 0, status: 1, created_at: "", updated_at: "" },
          },
        },
      ],
      messages: [],
      page_number: 1,
      total_pages: 1,
      page_size: 10,
      total_count: 1,
      has_previous: false,
      has_next: false,
    },
    isLoading: false,
    error: null,
  }),
  mapQuotation: (q: { id: string; transaction_id: string; quotation_no: string; transaction: { event_name: string; customer_phone: string; address: string; start_at: string; end_at: string; grand_total: number } }) => ({
    id: q.id,
    transactionId: q.transaction_id,
    quotationNumber: q.quotation_no,
    name: q.transaction.event_name,
    customerPhone: q.transaction.customer_phone,
    location: q.transaction.address,
    startDate: q.transaction.start_at,
    endDate: q.transaction.end_at,
    grandTotal: q.transaction.grand_total,
  }),
}));

describe("QuotationContainer", () => {
  it("renders QuotationContainer with data", () => {
    render(
      <MemoryRouter>
        <QuotationContainer />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("Music Festival").length).toBeGreaterThan(0);
  });
});
