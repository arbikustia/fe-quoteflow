import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import { InvoiceDetailComponent } from "./InvoiceDetail.component";

import { MOCK_INVOICES } from "@/fixture/invoices";
import type { ApiInvoice, InvoiceDetailState } from "../Invoice.type";

const INVOICE: ApiInvoice = MOCK_INVOICES[0];

const createProps = (invoice: ApiInvoice | null = INVOICE): InvoiceDetailState => ({
  invoice,
  isLoading: false,
  errorMessage: null,
  goBack: jest.fn(),
  goEdit: jest.fn(),
});

describe("InvoiceDetailComponent", () => {
  it("should render all invoice response sections with status 3 completed", (): void => {
    render(
      <MemoryRouter>
        <InvoiceDetailComponent {...createProps()} />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("INV-001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("QUO-001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Annual Gala").length).toBeGreaterThan(0);
    expect(screen.getAllByText("REGULER").length).toBeGreaterThan(0);
    expect(screen.getAllByText("APPROVED").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Speaker").length).toBeGreaterThan(0);
    expect(screen.queryByText("Audio Package")).toBeNull();
    expect(screen.getAllByText("PIC").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sinta").length).toBeGreaterThan(0);
    expect(screen.queryByText("Person in Charge")).toBeNull();
    expect(screen.getAllByText("October Promo").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Discount").length).toBeGreaterThan(0);
    expect(screen.queryByText("Discount Percent")).toBeNull();
    expect(screen.queryByText("OCT10")).toBeNull();
    expect(screen.queryByText("invoice-1")).toBeNull();
    expect(screen.queryByText("invoice-transaction-1")).toBeNull();
    expect(screen.queryByText("item-1")).toBeNull();
    expect(screen.queryByText("project-1")).toBeNull();
  });

  it("should render rental projects only for project service", (): void => {
    const projectInvoice: ApiInvoice = {
      ...INVOICE,
      quotation: {
        ...INVOICE.quotation,
        transaction: {
          ...INVOICE.quotation.transaction,
          service_type_name: "PROJECT",
        },
      },
    };

    render(
      <MemoryRouter>
        <InvoiceDetailComponent {...createProps(projectInvoice)} />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("PROJECT").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Audio Package").length).toBeGreaterThan(0);
    expect(screen.queryByText("Speaker")).toBeNull();
  });

  it("should render unavailable state", (): void => {
    render(
      <MemoryRouter>
        <InvoiceDetailComponent {...createProps(null)} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Invoice detail is unavailable.")).toBeTruthy();
  });
});
