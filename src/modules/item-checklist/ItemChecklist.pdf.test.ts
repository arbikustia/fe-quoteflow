import * as pdfModule from "./ItemChecklist.pdf";
import type { ApiChecklist } from "./ItemChecklist.type";

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
    const document = pdfModule.createChecklistPdf(checklist);
    const pdf = document.output();

    expect(pdf).toContain("%PDF-");
    expect(pdf).toContain("Beam 290 description");
    expect(pdf).toContain("Inter CP");
    expect(pdf).toContain("4-8 AGUSTUS 26");
    expect(pdf).toContain("Kinasih Resort - Bogor");
    expect(pdf).toContain("MOVE OUT");
    expect(pdf).toContain("Checked By");
    expect(pdf).toContain("Event Production");
    expect(pdf).not.toContain("ord-1");
    expect(document.getNumberOfPages()).toBe(1);
  });

  it("should flow larger item lists onto another page without clipping signatures", () => {
    const manyItems = { ...checklist, items: Array.from({ length: 60 }, (_, index) => ({ ...checklist.items[0], id: `item-${index}` })) };
    const document = pdfModule.createChecklistPdf(manyItems);
    const pdf = document.output();

    expect(document.getNumberOfPages()).toBeGreaterThan(1);
    expect(pdf).toContain("60");
    expect(pdf).toContain("Checked By");
  });

  it("should generate checklist PDF and call save with expected filename", () => {
    const document = pdfModule.createChecklistPdf(checklist);
    const saveMock = jest.fn();
    document.save = saveMock;
    const createPdfSpy = jest.spyOn(pdfModule, "createChecklistPdf").mockReturnValue(document);

    pdfModule.downloadChecklistPdf(checklist);

    expect(saveMock).toHaveBeenCalledWith("Item-Checklist-CI20261101210842.pdf");
    createPdfSpy.mockRestore();
  });
});
