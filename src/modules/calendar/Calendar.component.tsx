import type { ReactElement } from "react";
import { FiArrowRight, FiCalendar, FiClock, FiMapPin, FiUser } from "react-icons/fi";

import { CalendarComponent, type CalendarEventItem } from "@/components/Calendar";
import Modal from "@/components/Modal";

import { PageLayout } from "@/app/shared/PageLayout";

import type { CalendarPageState } from "./Calendar.type";

/**
 * Format date for modal header title.
 * @param {Date} date - Selected date
 * @returns {string} Formatted date
 */
const _formatModalDate = (date: Date): string =>
  date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/**
 * Render empty schedule state.
 * @returns {ReactElement} Empty element
 */
const _renderEmptyState = (): ReactElement => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-3xl bg-background-subtle text-text-tertiary">
      <FiCalendar className="h-7 w-7" aria-hidden="true" />
    </div>
    <h4 className="text-sm font-bold text-text-primary">Tidak Ada Jadwal</h4>
    <p className="mt-1 text-sm text-text-secondary">Tidak ada acara atau pesanan yang tercatat pada tanggal ini.</p>
  </div>
);

/**
 * Return badge style classes by event variant.
 * @param {string | undefined} variant - Event variant
 * @returns {string} CSS class
 */
const _getEventVariantBadgeClass = (variant?: string): string => {
  if (variant === "green") {
    return "border border-green-200 bg-green-50 text-green-700";
  }

  if (variant === "neutral") {
    return "border border-border-default bg-background-subtle text-text-secondary";
  }

  return "border border-primary-200 bg-primary-50 text-action-primary";
};

/**
 * Return human readable label by event variant.
 * @param {string | undefined} variant - Event variant
 * @returns {string} Variant label
 */
const _getEventVariantLabel = (variant?: string): string => {
  if (variant === "green") {
    return "Confirmed";
  }

  if (variant === "neutral") {
    return "Draft";
  }

  return "Active";
};

/**
 * Render day event card item.
 * @param {CalendarEventItem} event - Event item
 * @param {((orderId: string) => void) | undefined} onNavigate - Detail navigation callback
 * @returns {ReactElement} Event card
 */
const _renderEventCard = (
  event: CalendarEventItem,
  onNavigate: ((orderId: string) => void) | undefined,
): ReactElement => {
  const targetId = event.transactionId || event.id;
  const hasNavigation = Boolean(targetId) && Boolean(onNavigate);

  return (
    <div
      key={event.id}
      className="relative rounded-3xl border border-border-default bg-background-surface p-4 shadow-xs transition-all hover:border-action-primary/50 sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border-default pb-3 sm:gap-3 sm:pb-4">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-xs font-normal leading-snug text-text-primary">
            {event.title || event.eventName || "Untitled Event"}
          </h4>
          {event.quotationNo && (
            <span className="mt-0.5 inline-block text-xs font-normal text-text-tertiary">
              #{event.quotationNo}
            </span>
          )}
        </div>
        {event.variant && (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-normal ${_getEventVariantBadgeClass(event.variant)}`}>
            {_getEventVariantLabel(event.variant)}
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs font-normal text-text-secondary sm:mt-4 sm:grid-cols-2 sm:gap-3">
        {event.customerName && (
          <div className="flex items-center gap-2 sm:gap-2.5">
            <FiUser className="h-4 w-4 shrink-0 text-text-tertiary" />
            <span className="truncate">{event.customerName}</span>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-2.5">
          <FiClock className="h-4 w-4 shrink-0 text-text-tertiary" />
          <span className="truncate">
            {event.time ? event.time : event.date}
            {event.endDate && event.endDate !== event.date ? ` s/d ${event.endDate}` : ""}
          </span>
        </div>

        {event.address && (
          <div className="flex items-center gap-2 sm:col-span-2 sm:gap-2.5">
            <FiMapPin className="h-4 w-4 shrink-0 text-text-tertiary" />
            <span className="truncate">{event.address}</span>
          </div>
        )}

        {event.amount !== undefined && event.amount > 0 && (
          <div className="flex items-center gap-2 font-normal text-text-primary sm:col-span-2 sm:gap-2.5">
            <span className="text-xs text-text-tertiary">Total:</span>
            <span>Rp {event.amount.toLocaleString("id-ID")}</span>
          </div>
        )}
      </div>

      {hasNavigation && (
        <div className="mt-3 flex justify-end border-t border-border-default pt-2.5 sm:mt-4 sm:pt-3">
          <button
            type="button"
            onClick={(): void => onNavigate?.(targetId)}
            className="flex items-center gap-1.5 text-xs font-normal text-action-primary transition-colors hover:underline"
          >
            <span>Lihat Detail Order</span>
            <FiArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

/** Render quotation calendar page content with day detail modal. */
export const CalendarPageComponent = (props: CalendarPageState): ReactElement => {
  const handleEventClick = (event: CalendarEventItem): void => {
    const eventDate = event.date ? new Date(`${event.date}T00:00:00`) : new Date();
    const dateKey = event.date;
    const dayEvents = props.events.filter((item) => {
      if (item.endDate) {
        return item.date <= dateKey && dateKey <= item.endDate;
      }
      return item.date === dateKey;
    });

    props.onSelectDate(eventDate, dayEvents.length > 0 ? dayEvents : [event]);
  };

  return (
    <PageLayout
      title="Calendar"
      subtitle="View and manage order schedules and project timelines."
      mobileHeaderClassName="px-0"
      mobileTitleClassName="text-4xl"
      showBackButton={false}
    >
      <div className="mb-8 lg:mb-10">
        <CalendarComponent
          events={props.events}
          currentDate={props.currentDate}
          isLoading={props.isLoading}
          onPreviousMonth={props.onPreviousMonth}
          onNextMonth={props.onNextMonth}
          onToday={props.onToday}
          onDateClick={props.onSelectDate}
          onEventClick={handleEventClick}
        />
      </div>
      <Modal
        isOpen={Boolean(props.selectedDate)}
        onClose={props.onCloseDayModal}
        title={
          props.selectedDate && (
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="text-xs font-semibold text-text-primary">
                {_formatModalDate(props.selectedDate)}
              </span>
              <span className="rounded-full bg-background-subtle px-2 py-0.5 text-xs font-medium text-text-secondary">
                {props.selectedDayEvents.length} kegiatan
              </span>
            </div>
          )
        }
        titleClassName="text-xs font-semibold text-text-primary"
        maxWidth="max-w-2xl"
        dialogClassName="max-h-[85vh] flex flex-col"
        contentClassName="overflow-y-auto p-4 sm:p-6"
      >
        {props.selectedDayEvents.length === 0 ? (
          _renderEmptyState()
        ) : (
          <div className="space-y-4">
            {props.selectedDayEvents.map((event) => _renderEventCard(event, props.onNavigateToOrderDetail))}
          </div>
        )}
      </Modal>
    </PageLayout>
  );
};

export default CalendarPageComponent;
