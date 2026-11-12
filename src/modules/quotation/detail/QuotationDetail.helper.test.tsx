import { render, screen } from "@/libs/unit-test";

import type { ApiQuotationCustomer, ApiQuotationReference, ApiQuotationTransaction } from "../Quotation.type";

import { renderCustomerSection, renderDetailField, renderHandoversSection, renderReferenceSection, renderTransactionSection, renderVoucherSection } from "./QuotationDetail.helper";

const REFERENCE: ApiQuotationReference = { id: "r1", name: "Sinta", status: 0, created_at: "2026-01-01", updated_at: "2026-01-02", code: "OCT10", discount_percent: 10 };

describe("QuotationDetail helper", (): void => {
  it("should render a detail field", (): void => {
    render(renderDetailField("Label", "Value"));

    expect(screen.getByText("Label")).toBeTruthy();
    expect(screen.getByText("Value")).toBeTruthy();
  });

  it("should render customer, reference, voucher and handover sections", (): void => {
    const customer: ApiQuotationCustomer = { id: "c1", name: "Acme", address: "", phone_number: "0812", status: 1, created_at: "", updated_at: "" };

    render(
      <div>
        {renderCustomerSection(customer)}
        {renderReferenceSection("PIC", REFERENCE)}
        {renderVoucherSection(REFERENCE)}
        {renderHandoversSection()}
      </div>,
    );

    expect(screen.getByText("Acme")).toBeTruthy();
    expect(screen.getAllByText("Sinta").length).toBeGreaterThan(0);
    expect(screen.getByText("OCT10")).toBeTruthy();
  });

  it("should render the transaction section", (): void => {
    const transaction = { event_name: "Gala", service_type_name: "REGULER", customer_name: "Acme", start_at: "2026-11-01", end_at: "2026-11-02", status: 1, created_at: "2026-11-01", updated_at: "2026-11-01" } as ApiQuotationTransaction;

    render(renderTransactionSection(transaction));

    expect(screen.getByText("Gala")).toBeTruthy();
  });
});
