import * as pdfModule from "./ItemChecklist.pdf";
import type { ApiChecklist } from "./ItemChecklist.type";

import type { ApiRentalOrder } from "@/modules/report/Report.type";

const order: ApiRentalOrder = {
  id: "ord-1", transaction_id: "tx-1", invoice_id: "inv-1", quotation_id: "quo-1", order_no: "ORD-001", order_date: "2026-11-01", notes: null, status: 1, created_at: "2026-11-01", updated_at: "2026-11-01",
  invoice: {
    id: "inv-1", transaction_id: "tx-1", invoice_no: "INV-001", invoice_date: "2026-11-01", due_date: "2026-11-08", notes: "", status: 1, created_at: "2026-11-01", updated_at: "2026-11-01",
    quotation: {
      id: "quo-1", transaction_id: "tx-1", quotation_no: "QUO-001", quotation_date: "2026-10-20", expired_at: "2026-10-27", notes: "", status: 2, created_at: "2026-10-20", updated_at: "2026-10-20",
      transaction: {
        id: "tx-1", service_type_id: "service-1", service_type_name: "REGULER", customer_name: "PT Acara Nyata", customer_phone: "0812345678", address: "Jakarta Convention Center", event_name: "Annual Expo 2026", start_at: "2026-11-20T12:00:00", end_at: "2026-11-21T15:30:00", subtotal: 1000000, service_fee: 0, discount: 0, grand_total: 1000000, status: 1, created_at: "2026-10-20", updated_at: "2026-10-20", rental_transaction_items: [], rental_transaction_project: [],
        customer: { id: "customer-001", name: "PT Acara Nyata", status: 1, created_at: "2026-01-01", updated_at: "2026-01-01", address: "Jakarta", phone_number: "0812345678" },
        pic: { id: "pic-1", name: "Citra", status: 1, created_at: "2026-01-01", updated_at: "2026-01-01", address: "", phone_number: "" },
        voucher: { id: "voucher-1", name: "No Voucher", status: 1, created_at: "2026-01-01", updated_at: "2026-01-01", address: "", phone_number: "" },
      },
    },
  },
};

const checklist: ApiChecklist = {
  id: "chk-1",
  order_id: "ord-1",
  checklist_no: "CI20261101210842",
  checklist_date: "2026-11-01 21:08:54",
  status: null,
  created_at: "2026-11-01 21:08:55",
  updated_at: "2026-11-01 21:08:55",
  items: [{
    id: "item-1",
    checklist_id: "chk-1",
    item_id: "master-1",
    item_name: "Beam 290",
    description: "Beam 290 description",
    section: null,
    qty: 1,
    move_out: true,
    move_in: false,
    sign: "Putri",
    remark: null,
    status: null,
    created_at: "2026-11-01 21:08:55",
    updated_at: "2026-11-01 21:08:55",
  }],
};

describe("ItemChecklist.pdf", () => {
  it("should generate a PDF from detail fields without order ID", () => {
    const document = pdfModule.createChecklistPdf(checklist, order);
    const pdf = document.output();

    expect(pdf).toContain("%PDF-");
    expect(pdf).toContain("Beam 290 description");
    expect(pdf).toContain("PT Acara Nyata");
    expect(pdf).toContain("Annual Expo 2026");
    expect(pdf).toContain("Jakarta Convention Center");
    expect(pdf).toContain("Citra");
    expect(pdf).toContain("CUSTOMER NAME");
    expect(pdf).toContain("01 November 2026");
    expect(pdf).not.toContain("20 November 2026");
    expect(pdf).not.toContain("21 November 2026");
    expect(pdf).not.toContain("CUSTOMER ID");
    expect(pdf).not.toContain("customer-001");
    expect(pdf).not.toContain("Inter CP");
    expect(pdf).not.toContain("4-8 AGUSTUS 26");
    expect(pdf).not.toContain("Kinasih Resort - Bogor");
    expect(pdf).toContain("MOVE OUT");
    expect(pdf).not.toContain("__CHECK_MARK__");
    expect(pdf).not.toContain("(X)");
    expect(pdf).toContain("Checked By");
    expect(pdf).toContain("Event Production");
    expect(pdf).not.toContain("ord-1");
    expect(document.getNumberOfPages()).toBe(1);
  });

  it("should flow larger item lists onto another page without clipping signatures", () => {
    const manyItems = { ...checklist, items: Array.from({ length: 60 }, (_, index) => ({ ...checklist.items[0], id: `item-${index}` })) };
    const document = pdfModule.createChecklistPdf(manyItems, order);
    const pdf = document.output();

    expect(document.getNumberOfPages()).toBeGreaterThan(1);
    expect(pdf).toContain("60");
    expect(pdf).toContain("Checked By");
  });

  it("should generate checklist PDF and call save with expected filename", () => {
    const document = pdfModule.createChecklistPdf(checklist, order);
    const saveMock = jest.fn();
    document.save = saveMock;
    const createPdfSpy = jest.spyOn(pdfModule, "createChecklistPdf").mockReturnValue(document);

    pdfModule.downloadChecklistPdf(checklist, order);

    expect(saveMock).toHaveBeenCalledWith("Item-Checklist-CI20261101210842.pdf");
    createPdfSpy.mockRestore();
  });
});
