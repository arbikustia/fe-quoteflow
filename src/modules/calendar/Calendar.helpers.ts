import { type CalendarEventItem, type CalendarEventVariant, formatCalendarTime } from "@/components/Calendar";

import type { ApiQuotation } from "@/modules/quotation/Quotation.type";

/**
 * Resolve calendar event variant by quotation status.
 * @param {number} status - Quotation status
 * @returns {CalendarEventVariant} Calendar event variant
 */
const _resolveCalendarEventVariant = (status: number): CalendarEventVariant => {
  if (status === 2) {
    return "green";
  }

  if (status === 0) {
    return "neutral";
  }

  return "blue";
};

/** Map quotation rental schedule into calendar event. */
export const mapQuotationToCalendarEvent = (quotation: ApiQuotation): CalendarEventItem => ({
  id: quotation.id,
  title: quotation.transaction.event_name || quotation.quotation_no,
  date: quotation.transaction.start_at.slice(0, 10),
  endDate: quotation.transaction.end_at.slice(0, 10),
  time: formatCalendarTime(quotation.transaction.start_at),
  variant: _resolveCalendarEventVariant(quotation.status),
  quotationNo: quotation.quotation_no,
  customerName: quotation.transaction.customer_name,
  amount: quotation.transaction.grand_total,
});
