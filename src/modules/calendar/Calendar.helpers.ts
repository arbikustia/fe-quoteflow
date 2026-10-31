import { type CalendarEventItem,formatCalendarTime } from "@/components/Calendar";

import type { ApiQuotation } from "@/modules/quotation/Quotation.type";

/** Map quotation rental schedule into calendar event. */
export const mapQuotationToCalendarEvent = (quotation: ApiQuotation): CalendarEventItem => ({
  id: quotation.id,
  title: quotation.transaction.event_name || quotation.quotation_no,
  date: quotation.transaction.start_at.slice(0, 10),
  endDate: quotation.transaction.end_at.slice(0, 10),
  time: formatCalendarTime(quotation.transaction.start_at),
  variant: quotation.status === 3 ? "green" : "blue",
  quotationNo: quotation.quotation_no,
  customerName: quotation.transaction.customer_name,
  amount: quotation.transaction.grand_total,
});
