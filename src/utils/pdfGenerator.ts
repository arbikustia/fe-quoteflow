import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { QuoteData } from "../app/quotes/Quotes.type";
import { MOCK_ORDER_ITEMS } from "../fixture/quotes";

export const generateQuotePDF = (quote: QuoteData) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("PENAWARAN HARGA", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const dateStr = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Bekasi, ${dateStr}`, 190, 30, { align: "right" });

  // Company Info
  doc.setFont("helvetica", "bold");
  doc.text("SONICLINE MULTIMEDIA", 14, 20);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("021-29091826 / 081294080426", 14, 25);
  doc.text("sales@sonicline.com", 14, 30);
  doc.text("Jl. Taman Cikarang Indah 2 Blok F12 No.22", 14, 35);
  doc.text("Cikarang Selatan, Bekasi, Jawa Barat 17530", 14, 40);

  // Client Info
  doc.setFontSize(10);
  doc.text("Kepada Yth.", 14, 55);
  doc.text(`: Bpk/ Ibu Pimpinan Panitia ${quote.name}`, 45, 55);
  doc.text(": Di tempat", 45, 60);

  doc.text("Tanggal Acara", 14, 70);
  doc.text(`: ${quote.startDate} s/d ${quote.endDate}`, 45, 70);
  
  doc.text("Lokasi", 14, 75);
  doc.text(`: ${quote.location}`, 45, 75);

  doc.text("Dengan hormat,", 14, 85);
  doc.text(
    `Berikut ini kami dari SONICLINE Divisi rental alat-alat event memberikan penawaran harga sesuai kebutuhan acara ${quote.name}`,
    14,
    90
  );
  doc.text("sebagai berikut:", 14, 95);

  // Table Data
  const tableData: any[] = [];
  let no = 1;
  const categories = quote.category.split(", ").map(c => c.trim());

  categories.forEach(cat => {
    // Check if category is known, otherwise default price
    let pricePerDay = 0;
    if (cat.toLowerCase().includes("sound system")) pricePerDay = 15000000;
    else if (cat.toLowerCase().includes("lighting")) pricePerDay = 7000000;
    else if (cat.toLowerCase().includes("led")) pricePerDay = 6000000;
    else if (cat.toLowerCase().includes("backline")) pricePerDay = 2500000;
    else pricePerDay = 5000000;

    tableData.push([
      { content: `${cat} Equipment`, colSpan: 4, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }
    ]);

    // Add items that belong to this category (approximate for mock)
    // If not found in MOCK_ORDER_ITEMS, we just dump them
    const catItems = MOCK_ORDER_ITEMS[cat] || quote.selectedItems;
    const itemsInCat = quote.selectedItems.filter(i => catItems.includes(i));
    
    if (itemsInCat.length === 0) {
      tableData.push([no++, `Paket ${cat}`, quote.qty, "Unit"]);
    } else {
      itemsInCat.forEach(item => {
        tableData.push([no++, item, quote.qty, "Unit"]);
      });
    }

    tableData.push([
      { content: `Total ${cat}`, colSpan: 3, styles: { fontStyle: 'bold', halign: 'right' } },
      `Rp ${pricePerDay.toLocaleString("id-ID")}`
    ]);
  });

  // Calculate Totals
  const days = 2; // Mock days
  const subTotal1 = 21250000;
  const subTotal2 = 42500000;
  const discount = quote.discount || 0;
  const total = subTotal2 - discount;

  // Render Table
  autoTable(doc, {
    startY: 100,
    head: [["No", "Description", "Qty", "Remarks / Price"]],
    body: [
      ...tableData,
      [{ content: "Sub Total (1 day)", colSpan: 3, styles: { halign: 'right' } }, `Rp ${subTotal1.toLocaleString("id-ID")}`],
      [{ content: `Sub Total (${days} days)`, colSpan: 3, styles: { halign: 'right' } }, `Rp ${subTotal2.toLocaleString("id-ID")}`],
      [{ content: "Discount", colSpan: 3, styles: { halign: 'right' } }, `Rp ${discount.toLocaleString("id-ID")}`],
      [{ content: "Total", colSpan: 3, styles: { fontStyle: 'bold', halign: 'right' } }, `Rp ${total.toLocaleString("id-ID")}`],
    ],
    theme: "grid",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [40, 40, 40] }
  });

  // Footer notes
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(quote.remark, 14, finalY);

  doc.setFont("helvetica", "normal");
  doc.text("Keterangan :", 14, finalY + 10);
  doc.text("1. Harga tidak termasuk PPN (Jika ada)", 14, finalY + 15);
  doc.text("2. Harga tidak termasuk GR H-1", 14, finalY + 20);
  doc.text("3. Penambahan alat diluar spesifikasi akan dikenakan biaya tambahan", 14, finalY + 25);
  doc.text("4. Segala kerusakan yang diakibatkan kelalaian dari pemakaian, akan dibebankan ke penyewa", 14, finalY + 30);
  doc.text("5. Harga tidak termasuk tempat untuk crew dan operator yang bertugas (jika event lebih 1 hari)", 14, finalY + 35);
  doc.text("6. Pembayaran DP minimal 50%, sisa pembayaran dilunasi sebelum acara", 14, finalY + 40);
  
  doc.setFont("helvetica", "bold");
  doc.text("7. Pembayaran ke BCA - Cikarang | No. rekening: 688 099 6191 | Derik Sitanggang", 14, finalY + 45);

  doc.setFont("helvetica", "normal");
  doc.text("Demikian Penawaran ini kami sampaikan, besar harapan kami dapan menjalin kerjasama", 14, finalY + 55);
  doc.text("dan atas perhatian dan kerjasamanya kami ucapkan terima kasih.", 14, finalY + 60);

  doc.text("Hormat kami,", 14, finalY + 75);
  doc.text("Derik", 14, finalY + 95);

  // Save the PDF
  doc.save(`Quotation_${quote.name.replace(/\s+/g, '_')}.pdf`);
};
