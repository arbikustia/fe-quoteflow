import { type CalendarEventItem, type CalendarEventVariant, formatCalendarTime } from "@/components/Calendar";

import type { ApiQuotation } from "@/modules/quotation/Quotation.type";

import type { ApiCalendarItem, CalendarQueryParams } from "./Calendar.type";

/**
 * Format date into MM-DD-YYYY for calendar API query.
 * @param {Date} date - Date to format
 * @returns {string} MM-DD-YYYY formatted date string
 */
export const formatCalendarQueryDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};

/**
 * Get date range for calendar month query.
 * @param {Date} date - Current date
 * @returns {CalendarQueryParams} Date range with dateFrom and dateTo
 */
export const getCalendarMonthRange = (date: Date): CalendarQueryParams => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {
    dateFrom: formatCalendarQueryDate(startOfMonth),
    dateTo: formatCalendarQueryDate(endOfMonth),
  };
};

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

/** Map API calendar item into CalendarEventItem for rendering. */
export const mapCalendarItemToEvent = (item: ApiCalendarItem): CalendarEventItem => ({
  id: item.id || item.transaction_id,
  title: item.title || item.event_name || item.order_no,
  date: item.start ? item.start.slice(0, 10) : "",
  endDate: item.end ? item.end.slice(0, 10) : undefined,
  time: item.start ? formatCalendarTime(item.start) : "",
  variant: _resolveCalendarEventVariant(item.status),
  quotationNo: item.order_no,
  customerName: item.customer_name,
  amount: item.total_amount,
  eventName: item.event_name,
  address: item.address,
  status: item.status,
  transactionId: item.transaction_id,
});
