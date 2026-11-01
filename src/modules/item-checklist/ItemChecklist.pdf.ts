import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { ApiChecklist } from "./ItemChecklist.type";

const MARGIN_MM = 14;

/** Build a checklist PDF using fields available from the detail response. */
export const createChecklistPdf = (checklist: ApiChecklist): jsPDF => {
  const document = new jsPDF({ unit: "mm", format: "letter" });
  const pageWidth = document.internal.pageSize.getWidth();
  const pageHeight = document.internal.pageSize.getHeight();
  const date = new Date(checklist.checklist_date);
  const checklistDate = Number.isNaN(date.getTime())
    ? checklist.checklist_date
    : date.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });

  document.setFont("helvetica", "bold");
  document.setFontSize(16);
  document.setTextColor(42, 67, 125);
  document.text("ITEM CHECKLIST", pageWidth - MARGIN_MM, 20, { align: "right" });

  document.setFont("helvetica", "normal");
  document.setFontSize(8.5);
  document.setTextColor(50, 50, 50);
  document.text("Taman Cikarang Indah 2 Blok F12 No.22 Kec. Ciantra, Kel. Cikarang Selatan", MARGIN_MM, 16);
  document.text("Bekasi, Jawa Barat 17550, Indonesia", MARGIN_MM, 20);
  document.text("Phone : 021 29091826 | Mobile number : 082246487057", MARGIN_MM, 24);

  document.setFont("helvetica", "bold");
  document.text(`Checklist No : ${checklist.checklist_no}`, MARGIN_MM, 31);
  document.text(`Date : ${checklistDate}`, pageWidth - MARGIN_MM, 31, { align: "right" });

  autoTable(document, {
    startY: 36,
    margin: { top: 36, left: MARGIN_MM, right: MARGIN_MM, bottom: 32 },
    head: [["NO", "DESCRIPTION", "SECTION", "QTY", "MOVE OUT", "MOVE IN", "SIGN", "REMARK"]],
    body: checklist.items.map((item, index) => [
      String(index + 1),
      item.description || item.item_name,
      item.section ?? "-",
      String(item.qty),
      item.move_out ? "Yes" : "-",
      item.move_in ? "Yes" : "-",
      item.sign || "-",
      item.remark ?? "-",
    ]),
    theme: "striped",
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 2,
      lineColor: [180, 185, 195],
      lineWidth: 0.1,
      overflow: "linebreak",
      textColor: [30, 30, 30],
    },
    headStyles: {
      fillColor: [58, 93, 156],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [242, 242, 242],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      2: { cellWidth: 20 },
      3: { cellWidth: 12, halign: "center" },
      4: { cellWidth: 20, halign: "center" },
      5: { cellWidth: 20, halign: "center" },
      6: { cellWidth: 22 },
      7: { cellWidth: 22 },
    },
  });

  const totalPages = document.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    document.setPage(page);
    const footerY = pageHeight - 22;

    document.setFont("helvetica", "normal");
    document.setFontSize(8);
    document.setTextColor(60, 60, 60);

    document.text("Checked By : ____________________   Sign : ___________   Date : ___________", MARGIN_MM, footerY);
    document.text("Checked By : ____________________   Sign : ___________   Date : ___________", MARGIN_MM, footerY + 6);

    document.setFont("helvetica", "bold");
    document.setFontSize(7.5);
    document.setTextColor(42, 67, 125);
    document.text("Audio | Video | Lighting | LED Screen | Backline | Event Production", MARGIN_MM, footerY + 14);

    document.setFont("helvetica", "normal");
    document.setFontSize(8);
    document.setTextColor(120, 120, 120);
    document.text(`Page ${page} / ${totalPages}`, pageWidth - MARGIN_MM, footerY + 14, { align: "right" });
  }

  return document;
};

/** Download a generated checklist PDF. */
export const downloadChecklistPdf = (checklist: ApiChecklist): void => {
  createChecklistPdf(checklist).save(`Item-Checklist-${checklist.checklist_no.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`);
};
