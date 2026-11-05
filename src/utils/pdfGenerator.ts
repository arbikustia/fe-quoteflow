import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import FrameImage from "../assets/frame-pdf.png";
import { MOCK_ORDER_ITEMS } from "../fixture/quotes";
import type { QuoteData, QuotePdfItem, QuotePdfProject, QuotePdfProjectItem } from "../modules/order/Order.type";

type TableCell = string | number | Record<string, unknown>;
type TableRow = TableCell[];

export type PdfOptions = {
  title?: string;
  filename?: string;
};

/**
 * Append transaction items grouped by category.
 * @param {TableRow[]} tableData - PDF table rows
 * @param {QuotePdfItem[]} items - Transaction items
 * @returns {number} Sum of item prices
 */
const _appendGroupedItems = (tableData: TableRow[], items: QuotePdfItem[]): number => {
  const categories = new Map<string, QuotePdfItem[]>();
  items.forEach((item): void => {
    const categoryItems = categories.get(item.category) ?? [];
    categoryItems.push(item);
    categories.set(item.category, categoryItems);
  });

  let rowNumber = 1;
  let subtotal = 0;
  categories.forEach((categoryItems, category): void => {
    tableData.push([{ content: category, colSpan: 6, styles: { fontStyle: "bold", fillColor: [240, 240, 240], textColor: [0, 0, 0], halign: "left" } }]);
    categoryItems.forEach((item): void => {
      subtotal += item.price * item.qty;
      tableData.push([
        { content: (rowNumber++).toString(), styles: { halign: "center" } },
        item.name,
        { content: item.qty.toString(), styles: { halign: "center" } },
        { content: item.qty > 1 ? "Units" : "Unit", styles: { halign: "center" } },
        { content: item.price.toLocaleString("id-ID"), styles: { halign: "right" } },
        item.remark,
      ]);
    });
  });

  return subtotal;
};

/**
 * Append projects to table.
 * @param {TableRow[]} tableData - PDF table rows
 * @param {QuotePdfProject[]} projects - Projects
 * @param {number} startRowNumber - Starting row number
 * @returns {{ subtotal: number; rowNumber: number }} Result
 */
const _appendProjects = (tableData: TableRow[], projects: QuotePdfProject[], startRowNumber: number): { subtotal: number; rowNumber: number } => {
  let subtotal = 0;
  let rowNumber = startRowNumber;

  projects.forEach((project) => {
    subtotal += project.price;
    tableData.push([
      { content: (rowNumber++).toString(), styles: { halign: "center" } },
      { content: project.name, styles: { fontStyle: "bold" } },
      { content: "1", styles: { halign: "center" } },
      { content: "Unit", styles: { halign: "center" } },
      { content: project.price.toLocaleString("id-ID"), styles: { halign: 'right' } },
      project.remark,
    ]);

    project.items.forEach((item: QuotePdfProjectItem) => {
      tableData.push([
        "",
        { content: `  • ${item.name}`, styles: { fontStyle: "normal" } },
        { content: item.qty.toString(), styles: { halign: "center" } },
        { content: item.qty > 1 ? "Units" : "Unit", styles: { halign: "center" } },
        "",
        item.remark,
      ]);
    });
  });

  return { subtotal, rowNumber };
};

/**
 * Generate PDF for a Quote
 * @param {QuoteData} quote - the quote data
 * @param {PdfOptions} [options] - custom options like title and filename
 * @returns {Promise<void>} promise
 */
export const generateQuotePDF = async (quote: QuoteData, options?: PdfOptions): Promise<void> => {
  const doc = new jsPDF();
  const frameData = await new Promise<string>((resolve) => {
    const img = new Image();
    img.src = FrameImage;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve("");
  });

  const addBackground = () => {
    if (frameData) {
      doc.addImage(frameData, "PNG", 0, 0, 210, 297);
    }
  };

  // Add background to first page
  addBackground();

  // Patch addPage to add background on new pages
  const originalAddPage = doc.addPage.bind(doc);
  doc.addPage = function (...args) {
    originalAddPage(...args);
    addBackground();
    return this;
  };

  // --- TITLE ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(options?.title ?? "PENAWARAN HARGA", 105, 40, { align: "center" });

  // --- DATE ---
  const dateStr = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Bekasi, ${dateStr}`, 196, 48, { align: "right" });

  // --- CLIENT INFO ---
  doc.text("Kepada Yth.", 14, 58);
  doc.text(`: Bpk/ Ibu ${quote.customerName ?? quote.name}`, 45, 58);
  doc.text(": Di tempat", 45, 63);

  doc.text("Tanggal Acara", 14, 68);
  const startDateStr = new Date(quote.startDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
  const endDateStr = new Date(quote.endDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
  let dateRange = startDateStr;
  if (quote.startDate !== quote.endDate) {
    dateRange = `${startDateStr} - ${endDateStr}`;
  }
  doc.text(`: ${dateRange}`, 45, 68);

  doc.text("Lokasi", 14, 73);
  doc.text(`: ${quote.location}`, 45, 73);

  doc.text("Remark", 14, 78);
  doc.text(`: ${quote.remark}`, 45, 78);

  doc.text("Dengan hormat,", 14, 88);
  doc.text(
    `Berikut ini kami dari SONICLINE Divisi rental alat-alat event memberikan penawaran harga sesuai kebutuhan acara`,
    14,
    93
  );
  doc.text(`${quote.name} di ${quote.location}, sebagai berikut :`, 14, 98);

  // --- TABLE DATA PREPARATION ---
  const tableData: TableRow[] = [];
  let no = 1;
  const rawCategories = (quote.category || "Equipment").split(", ").map(c => c.trim()).filter(Boolean);
  const categories = rawCategories.length > 0 ? rawCategories : ["Equipment"];
  let subTotal1 = quote.pdfItems?.length ? _appendGroupedItems(tableData, quote.pdfItems) : 0;
  if (quote.pdfProjects?.length) {
    const projectResult = _appendProjects(tableData, quote.pdfProjects, (quote.pdfItems?.length ?? 0) + 1);
    subTotal1 += projectResult.subtotal;
  }

  if (!quote.pdfItems?.length && !quote.pdfProjects?.length) categories.forEach(cat => {
    let pricePerDay = 0;
    const catLower = cat.toLowerCase();
    if (catLower.includes("sound") || catLower.includes("audio")) pricePerDay = 15000000;
    else if (catLower.includes("lighting")) pricePerDay = 7000000;
    else if (catLower.includes("led") || catLower.includes("visual")) pricePerDay = 6000000;
    else if (catLower.includes("backline") || catLower.includes("band")) pricePerDay = 2500000;
    else pricePerDay = 5000000;

    subTotal1 += pricePerDay;

    const catHeading = cat === "Equipment" ? "Equipment" : `${cat} Equipment`;
    tableData.push([
      { content: catHeading, colSpan: 6, styles: { fontStyle: 'bold', fillColor: [240, 240, 240], textColor: [0, 0, 0], halign: 'left' } }
    ]);

    const catItems = MOCK_ORDER_ITEMS[cat] || quote.selectedItems;
    let itemsInCat = quote.selectedItems.filter(i => catItems.includes(i));
    
    if (itemsInCat.length === 0) {
      itemsInCat = quote.selectedItems.length > 0 ? quote.selectedItems : [`Paket ${cat}`];
    }
    
    const count = itemsInCat.length;

    itemsInCat.forEach((item, index) => {
      const row: TableRow = [
        { content: (no++).toString(), styles: { halign: 'center' } }, 
        item, 
        { content: quote.qty.toString(), styles: { halign: 'center' } }, 
        { content: quote.qty > 1 ? "Units" : "Unit", styles: { halign: 'center' } }
      ];
      
      if (index === 0) {
        row.push({ 
          content: pricePerDay.toLocaleString("id-ID"), 
          rowSpan: count, 
          styles: { valign: 'middle', halign: 'center' } 
        });
      }
      
      row.push("");
      tableData.push(row);
    });
  });

  const startT = Date.parse(quote.startDate.slice(0, 10));
  const endT = Date.parse(quote.endDate.slice(0, 10));
  const days = Math.max(1, Math.round((endT - startT) / 86_400_000) + 1);
  const subTotal2 = subTotal1 * days;
  const discountPercent = quote.discount || 0;
  const discountAmount = Math.round(subTotal2 * (discountPercent / 100));
  const ppn = quote.pph ? Math.round((subTotal2 - discountAmount) * (quote.pph / 100)) : 0;
  const total = subTotal2 - discountAmount + ppn + (quote.serviceFee || 0);

  // Bottom Rows for Totals
  tableData.push([
    { content: "Sub Total", colSpan: 2, styles: { halign: 'right' } },
    { content: "1", styles: { halign: 'center' } },
    { content: "day", styles: { halign: 'center' } },
    { content: `Rp ${subTotal1.toLocaleString("id-ID")}`, styles: { halign: 'right' } },
    ""
  ]);

  if (days > 1) {
    tableData.push([
      { content: "", colSpan: 2 },
      { content: days.toString(), styles: { halign: 'center' } },
      { content: "days", styles: { halign: 'center' } },
      { content: `Rp ${subTotal2.toLocaleString("id-ID")}`, styles: { halign: 'right' } },
      ""
    ]);
  }

  tableData.push([
    { content: `PPn ${quote.pph || 0}%`, colSpan: 2, styles: { halign: 'right' } },
    "", "",
    { content: `Rp ${ppn > 0 ? ppn.toLocaleString("id-ID") : "-"}`, styles: { halign: 'right' } },
    ""
  ]);

  if (discountPercent > 0) {
    tableData.push([
      { content: "Voucher", colSpan: 2, styles: { halign: 'right' } },
      "", "",
      { content: `Rp -${discountAmount.toLocaleString("id-ID")} (${discountPercent}%)`, styles: { halign: 'right' } },
      ""
    ]);
  }

  tableData.push([
    { content: "Service Fee", colSpan: 2, styles: { halign: 'right' } },
    "", "",
    { content: `Rp ${quote.serviceFee ? quote.serviceFee.toLocaleString("id-ID") : "-"}`, styles: { halign: 'right' } },
    ""
  ]);

  tableData.push([
    { content: "Total", colSpan: 2, styles: { fontStyle: 'bold', halign: 'right' } },
    { content: days.toString(), styles: { fontStyle: 'bold', halign: 'center' } },
    { content: days > 1 ? "days" : "day", styles: { fontStyle: 'bold', halign: 'center' } },
    { content: `Rp ${total.toLocaleString("id-ID")}`, styles: { fontStyle: 'bold', halign: 'right' } },
    ""
  ]);

  tableData.push([
    { content: quote.remark || "** INCLUDE OPERATOR DAN CREW BERPENGALAMAN", colSpan: 6, styles: { fontStyle: 'bold', halign: 'left', fillColor: [255, 255, 255] } }
  ]);

  // --- RENDER TABLE ---
  autoTable(doc, {
    startY: 103,
    head: [[
      { content: "No", styles: { halign: 'center' } },
      { content: "Description", styles: { halign: 'center' } },
      { content: "Qty", colSpan: 2, styles: { halign: 'center' } },
      { content: "Price/ Days (Rp)", styles: { halign: 'center' } },
      { content: "Remarks", styles: { halign: 'center' } }
    ]],
    body: tableData,
    theme: "grid",
    styles: { 
      fontSize: 8,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      textColor: [0, 0, 0],
      cellPadding: 1.5
    },
    headStyles: { 
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineWidth: 0.1,
      lineColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, // No
      1: { cellWidth: 'auto' },               // Description
      2: { cellWidth: 12, halign: 'center' }, // Qty (num)
      3: { cellWidth: 15, halign: 'center' }, // Qty (unit)
      4: { cellWidth: 35, halign: 'right' },  // Price
      5: { cellWidth: 40, halign: 'center' }  // Remarks
    },
    margin: { top: 40 }
  });

  // --- FOOTER NOTES ---
  const lastAutoTable = ((doc as unknown) as { lastAutoTable?: { finalY: number } }).lastAutoTable;
  let finalY = (lastAutoTable?.finalY ?? 180) + 8;
  
  // The company name is omitted as requested because the frame image has it
  // Or the user does not want it duplicated below the table.
  
  finalY += 2;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Keterangan :", 14, finalY);
  
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("1. Harga tidak termasuk PPN (Jika ada)", 14, finalY + 5);
  doc.text("2. Harga tidak termasuk GR H-1", 14, finalY + 10);
  doc.text("3. Penambahan alat diluar spesifikasi akan dikenakan biaya tambahan", 14, finalY + 15);
  doc.text("4. Segala kerusakan yang diakibatkan kelalaian dari pemakaian, akan dibebankan ke penyewa", 14, finalY + 20);
  doc.text("5. Harga tidak termasuk tempat untuk crew dan operator yang bertugas (jika event lebih 1 hari)", 14, finalY + 25);
  doc.text("6. Pembayaran DP minimal 50%, sisa pembayaran dilunasi sebelum acara", 14, finalY + 30);
  
  doc.setFont("helvetica", "bold");
  doc.text("7. Pembayaran ke BCA – Cikarang | No. rekening: 688 099 6191 | Derik Sitanggang", 14, finalY + 35);

  doc.setFont("helvetica", "normal");
  doc.text("Demikian Penawaran ini kami sampaikan, besar harapan kami dapan menjalin kerjasama dan atas perhatian dan", 14, finalY + 45);
  doc.text("kerjasamanya kami ucapkan terima kasih.", 14, finalY + 50);

  doc.text("Hormat kami,", 14, finalY + 65);
  doc.text("Derik", 14, finalY + 85);

  // --- SAVE ---
  const filename = options?.filename ?? `Invoice-${quote.id}.pdf`;
  doc.save(filename);
};

/**
 * Generate PDF for a Quotation
 * @param {QuoteData} quote - the quote data
 * @returns {Promise<void>} promise
 */
export const generateQuotationPDF = async (quote: QuoteData): Promise<void> => {
  await generateQuotePDF(quote, {
    title: "QUOTATION",
    filename: `Quotation-${quote.id}.pdf`,
  });
};

/**
 * Generate PDF for an Invoice
 * @param {QuoteData} quote - the quote data
 * @returns {Promise<void>} promise
 */
export const generateInvoicePDF = async (quote: QuoteData): Promise<void> => {
  await generateQuotePDF(quote, {
    title: "INVOICE",
    filename: `Invoice-${quote.id}.pdf`,
  });
};
