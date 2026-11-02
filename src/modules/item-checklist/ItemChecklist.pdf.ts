import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { RENTAL_CHECKLIST_LOGO } from "./ItemChecklist.pdf-logo";
import type { ApiChecklist } from "./ItemChecklist.type";

const PAGE_WIDTH = 612;
const TABLE_LEFT = 38.4;
const TABLE_RIGHT = 573;
const TABLE_TOP = 213.7;
const TABLE_BOTTOM = 547;
const COLUMN_WIDTHS = [21.5, 185, 56, 31, 45, 73.5, 79, 43.5];
const HEADERS = ["NO", "DESCRIPTION", "SECTION", "QTY", "UNIT", "MOVE OUT (  )", "MOVE IN  (  )", "SIGN"];

/** Draw fixed company and event details copied from the supplied reference. */
const _drawHeader = (document: jsPDF): void => {
  document.addImage(RENTAL_CHECKLIST_LOGO, "JPEG", 42.3, 36, 119.6, 37.2);
  document.setFillColor(211, 221, 239);
  document.rect(300.5, 36.5, 272.2, 34.9, "F");
  document.setFont("helvetica", "bold");
  document.setFontSize(21.1);
  document.setTextColor(58, 93, 156);
  document.text("ITEM CHECKLIST", 436.6, 61.8, { align: "center" });

  document.setFont("helvetica", "normal");
  document.setFontSize(8.8);
  document.setTextColor(0, 0, 0);
  [
    "Taman Cikarang Indah 2 Blok F12 No.22",
    "Kec. Ciantra, Kel. Cikarang Selatan",
    "Bekasi, Jawa Barat 17550, Indonesia",
    "Phone  : 021 29091826",
    "Mobile number : 082246487057",
  ].forEach((line, index): void => { document.text(line, 49.1, 79.5 + index * 11.9); });

  document.text("DATE", 387.1, 91.4);
  document.text("CUSTOMER ID", 387.1, 103.3);
  document.setLineWidth(0.84);
  document.setDrawColor(0, 0, 0);
  document.rect(450.2, 83.2, 122.5, 23.8);
  document.line(450.2, 95.1, 572.7, 95.1);
  document.text("8/1/2026", 511.5, 91.4, { align: "center" });
  document.text("000-2015", 511.5, 103.3, { align: "center" });

  const details = [
    ["COMPANY", "Inter CP"],
    ["EVENT NAME", "IVC"],
    ["DATE", "4-8 AGUSTUS 26 (Loading tgl 9 Agustus, Jam - 19.00)"],
    ["LOCATION", "Kinasih Resort - Bogor"],
    ["PIC", "Floren"],
  ];
  details.forEach(([label, value], index): void => {
    const y = 151.2 + index * 11.9;
    document.setFont("helvetica", "bold");
    document.text(label, 49.2, y);
    document.setFont("helvetica", "normal");
    document.text(":", 145.3, y);
    document.text(value, 161.5, y);
  });
};

/** Draw two signoff rows and tagline, preserving reference spacing. */
const _drawFooter = (document: jsPDF, tableEnd: number): void => {
  const offset = Math.max(0, tableEnd - TABLE_BOTTOM);
  document.setTextColor(0, 0, 0);
  document.setFont("helvetica", "normal");
  document.setFontSize(8.8);
  [578.5, 614.2].forEach((y): void => {
    document.text("Checked By : ____________________", 61.2, y + offset);
    document.text("Sign :  ___________", 233, y + offset);
    document.text("Date :  ___________", 333.2, y + offset);
  });
  document.setFont("helvetica", "bold");
  document.setFontSize(7.9);
  document.setTextColor(125, 154, 206);
  document.text("Audio | Video | Lighting | LED Screen | Backline | Event Production", PAGE_WIDTH / 2, 649.7 + offset, { align: "center" });
};

/** Build checklist PDF with reference layout and API-sourced table rows. */
export const createChecklistPdf = (checklist: ApiChecklist): jsPDF => {
  const document = new jsPDF({ unit: "pt", format: "letter" });
  _drawHeader(document);
  const rows = checklist.items.map((item, index): string[] => [
    String(index + 1),
    item.description || item.item_name,
    item.section ?? "",
    String(item.qty),
    item.qty === 1 ? "Unit" : "Units",
    item.move_out ? "X" : "",
    item.move_in ? "X" : "",
    item.sign,
  ]);
  while (rows.length < 27) rows.push(HEADERS.map((): string => ""));
  let lastTableEnd = TABLE_BOTTOM;
  autoTable(document, {
    startY: TABLE_TOP,
    margin: { top: 38, left: TABLE_LEFT, right: PAGE_WIDTH - TABLE_RIGHT, bottom: 245 },
    head: [HEADERS],
    body: rows,
    theme: "plain",
    styles: { font: "helvetica", fontSize: 8.8, textColor: [0, 0, 0], cellPadding: { top: 0, right: 1.5, bottom: 0, left: 1.5 }, minCellHeight: 11.9, valign: "middle", overflow: "linebreak" },
    headStyles: { fillColor: [58, 93, 156], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9.2, minCellHeight: 12 },
    alternateRowStyles: { fillColor: [242, 242, 242] },
    columnStyles: {
      0: { cellWidth: COLUMN_WIDTHS[0], halign: "center" },
      1: { cellWidth: COLUMN_WIDTHS[1] },
      2: { cellWidth: COLUMN_WIDTHS[2], halign: "center" },
      3: { cellWidth: COLUMN_WIDTHS[3], halign: "center" },
      4: { cellWidth: COLUMN_WIDTHS[4], halign: "center" },
      5: { cellWidth: COLUMN_WIDTHS[5], halign: "center" },
      6: { cellWidth: COLUMN_WIDTHS[6], halign: "center" },
      7: { cellWidth: COLUMN_WIDTHS[7], halign: "center" },
    },
    didDrawPage: (data): void => {
      const top = data.pageNumber === 1 ? TABLE_TOP : 38;
      const bottom = data.cursor?.y ?? TABLE_BOTTOM;
      lastTableEnd = bottom;
      document.setLineWidth(0.84);
      document.setDrawColor(0, 0, 0);
      let x = TABLE_LEFT;
      document.line(x, top, x, bottom);
      COLUMN_WIDTHS.forEach((width): void => { x += width; document.line(x, top, x, bottom); });
      document.line(TABLE_LEFT, bottom, TABLE_RIGHT, bottom);
      document.setLineWidth(0.75);
      document.setDrawColor(255, 255, 255);
      [435, 499].forEach((checkX): void => {
        document.line(checkX, top + 6.7, checkX + 2.2, top + 9);
        document.line(checkX + 2.2, top + 9, checkX + 6.2, top + 3.5);
      });
    },
  });
  _drawFooter(document, lastTableEnd);
  return document;
};

/** Download a generated checklist PDF. */
export const downloadChecklistPdf = (checklist: ApiChecklist): void => {
  createChecklistPdf(checklist).save(`Item-Checklist-${checklist.checklist_no.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`);
};
