import type { KeyboardEvent, ReactElement } from "react";
import { LuBadgePercent, LuCreditCard, LuFileCheck2, LuReceiptText } from "react-icons/lu";

import { CalendarComponent } from "@/components/Calendar";

import { DASHBOARD_METRICS } from "./Dashboard.config";
import type { DashboardCalendarState, DashboardChartDatum, DashboardMenuItem, DashboardMetricKey, DashboardOrderState, DashboardOverviewState, DashboardRoute } from "./Dashboard.type";
import { summarizeChart } from "./Dashboard.util";

const METRIC_ICONS: Record<DashboardMetricKey, ReactElement> = {
  quotation: <LuFileCheck2 aria-hidden="true" />,
  invoice: <LuReceiptText aria-hidden="true" />,
  payment: <LuCreditCard aria-hidden="true" />,
  voucher: <LuBadgePercent aria-hidden="true" />,
};

/**
 * Render the icon of a dashboard metric.
 * @param {DashboardMetricKey} key - Metric key
 * @returns {ReactElement} - Metric icon
 */
export const renderMetricIcon = (key: DashboardMetricKey): ReactElement => METRIC_ICONS[key];

/**
 * Render the icon of a mobile menu item.
 * @param {DashboardMenuItem} item - Menu item
 * @returns {ReactElement} - Menu icon
 */
export const renderMenuIcon = (item: DashboardMenuItem): ReactElement => (
  <img src={item.icon} alt="" className="absolute -top-3 h-28 w-28 object-contain" aria-hidden="true" />
);

/**
 * Format a count with the Indonesian locale.
 * @param {number} count - Count
 * @returns {string} - Formatted count
 */
export const formatCount = (count: number): string => count.toLocaleString("id-ID");

/**
 * Render the four desktop metric cards.
 * @param {DashboardOverviewState} overview - Overview totals and loading flag
 * @returns {ReactElement} - Metric card grid
 */
export const renderMetricCards = (overview: DashboardOverviewState): ReactElement => (
  <div className="grid grid-cols-4 gap-5">
    {DASHBOARD_METRICS.map((metric) => (
      <div key={metric.key} className="rounded-3xl border border-border-default bg-background-surface p-6 shadow-none">
        <div className="flex items-start justify-between gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${metric.surfaceClassName} ${metric.colorClassName}`}>
            {renderMetricIcon(metric.key)}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">{metric.label}</span>
        </div>
        <div className="mt-5">
          <p className="tabular-nums text-4xl font-bold tracking-tight text-text-primary">{overview.isLoading ? "-" : formatCount(overview.counts[metric.key])}</p>
          <p className="mt-1.5 text-sm text-text-secondary">{metric.description}</p>
        </div>
      </div>
    ))}
  </div>
);

/**
 * Render the desktop rental-order chart or its loading / error state.
 * @param {DashboardOrderState} orderState - Rental-order chart state
 * @returns {ReactElement} - Chart or explicit data state
 */
export const renderDesktopOrderChart = (orderState: DashboardOrderState): ReactElement => {
  if (orderState.isLoading) {
    return <div className="mt-6 h-40 animate-pulse rounded-lg bg-background-subtle" role="status" aria-label="Loading rental order chart" />;
  }

  if (orderState.isError) {
    return <p className="mt-6 rounded-lg border border-danger bg-danger-subtle px-4 py-3 text-sm text-danger-strong">Rental order performance unavailable.</p>;
  }

  const { maxCount, totalOrders } = summarizeChart(orderState.chartData);

  return (
    <div className="mt-6">
      <p className="tabular-nums text-2xl font-semibold text-text-primary">{formatCount(totalOrders)} orders</p>
      <div className="mt-6 grid h-[calc(100vh-38rem)] min-h-[22rem] grid-cols-7 items-end gap-4 border-b border-border-strong" role="img" aria-label={`${formatCount(totalOrders)} rental orders created in the last 7 days`}>
        {orderState.chartData.map((datum: DashboardChartDatum) => (
          <div key={datum.label} className="flex h-full min-w-0 flex-col items-center justify-end">
            <span className="mb-2 text-sm font-semibold tabular-nums text-text-primary">{datum.count}</span>
            <div className="w-full max-w-20 rounded-t-lg bg-action-primary" style={{ height: datum.count > 0 ? `${Math.max((datum.count / maxCount) * 100, 8)}%` : "4px" }} />
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-4">
        {orderState.chartData.map((datum: DashboardChartDatum) => <span key={datum.label} className="text-center text-sm text-text-tertiary">{datum.label}</span>)}
      </div>
    </div>
  );
};

/**
 * Render the mobile rental-order chart or its loading / error state.
 * @param {DashboardOrderState} orderState - Rental-order chart state
 * @returns {ReactElement} - Chart or explicit data state
 */
export const renderMobileOrderChart = (orderState: DashboardOrderState): ReactElement => {
  if (orderState.isLoading) {
    return <div className="h-48 animate-pulse rounded-xl bg-background-subtle" role="status" aria-label="Loading rental order chart" />;
  }

  if (orderState.isError) {
    return <p className="rounded-xl border border-danger bg-danger-subtle px-4 py-3 text-sm text-danger-strong">Rental order performance unavailable.</p>;
  }

  const { maxCount, totalOrders } = summarizeChart(orderState.chartData);

  return (
    <div className="rounded-xl border border-border-default bg-background-surface p-4">
      <p className="text-sm text-text-secondary">Rental orders created in the last 7 days</p>
      <p className="mt-1 tabular-nums text-xl font-semibold text-text-primary">{formatCount(totalOrders)} orders</p>
      <div className="mt-5 grid h-40 grid-cols-7 items-end gap-2 border-b border-border-strong" role="img" aria-label={`${formatCount(totalOrders)} rental orders created in the last 7 days`}>
        {orderState.chartData.map((datum: DashboardChartDatum) => (
          <div key={datum.label} className="flex h-full min-w-0 flex-col items-center justify-end">
            <span className="mb-1 text-xs font-semibold tabular-nums text-text-primary">{datum.count}</span>
            <div className="w-full rounded-t-md bg-action-primary" style={{ height: datum.count > 0 ? `${Math.max((datum.count / maxCount) * 100, 8)}%` : "4px" }} />
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {orderState.chartData.map((datum: DashboardChartDatum) => <span key={datum.label} className="text-center text-[10px] text-text-tertiary">{datum.label}</span>)}
      </div>
    </div>
  );
};

/**
 * Render the clickable current-month calendar preview.
 * @param {DashboardCalendarState} calendar - Calendar state
 * @param {(route: DashboardRoute) => void} onNavigate - Navigation handler
 * @returns {ReactElement} - Calendar preview card
 */
export const renderCalendarPreview = (calendar: DashboardCalendarState, onNavigate: (route: DashboardRoute) => void): ReactElement => {
  /**
   * Open the calendar page.
   * @returns {void}
   */
  const handleOpen = (): void => {
    onNavigate("/calendar");
  };

  /**
   * Open the calendar page on Enter or Space.
   * @param {KeyboardEvent<HTMLDivElement>} event - Keyboard event
   * @returns {void}
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      handleOpen();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      className="cursor-pointer rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      aria-label="Open calendar"
    >
      <CalendarComponent
        events={calendar.events}
        currentDate={new Date()}
        isLoading={calendar.isLoading}
        showControls={false}
        className="h-full transition-colors hover:bg-background-subtle"
      />
    </div>
  );
};

/**
 * Render the decorative coupon ticket on the left of the voucher banner.
 * @returns {ReactElement} - Ticket illustration
 */
const _renderLeftTicket = (): ReactElement => (
  <div className="pointer-events-none relative z-10 shrink-0 -rotate-12 transition-transform duration-300 group-hover:-rotate-6" aria-hidden="true">
    <svg width="68" height="52" viewBox="0 0 68 52" fill="none" className="h-10 w-12 drop-shadow-md sm:h-12 sm:w-16">
      <rect x="2" y="2" width="64" height="48" rx="8" fill="#133E1A" />
      <circle cx="2" cy="26" r="6" fill="#8BE328" className="dark:fill-[#173814]" />
      <circle cx="66" cy="26" r="6" fill="#DCF87D" className="dark:fill-[#265320]" />
      <line x1="22" y1="6" x2="22" y2="46" stroke="#A3E635" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="44" cy="20" r="3.5" fill="#FFFFFF" />
      <circle cx="44" cy="32" r="3.5" fill="#FFFFFF" />
      <line x1="36" y1="34" x2="52" y2="18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

/**
 * Render the decorative coupon ticket on the right of the voucher banner.
 * @returns {ReactElement} - Ticket illustration
 */
const _renderRightTicket = (): ReactElement => (
  <div className="pointer-events-none relative z-10 shrink-0 rotate-12 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true">
    <svg width="68" height="52" viewBox="0 0 68 52" fill="none" className="h-10 w-12 drop-shadow-md sm:h-12 sm:w-16">
      <rect x="2" y="2" width="64" height="48" rx="8" fill="#133E1A" />
      <circle cx="2" cy="26" r="6" fill="#DCF87D" className="dark:fill-[#265320]" />
      <circle cx="66" cy="26" r="6" fill="#8BE328" className="dark:fill-[#173814]" />
      <line x1="46" y1="6" x2="46" y2="46" stroke="#A3E635" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="24" cy="20" r="3.5" fill="#FFFFFF" />
      <circle cx="24" cy="32" r="3.5" fill="#FFFFFF" />
      <line x1="16" y1="34" x2="32" y2="18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

/**
 * Render the promotional voucher banner.
 * @param {number | null} voucherCount - Active voucher count, null when unavailable
 * @param {(route: DashboardRoute) => void} onNavigate - Navigation handler
 * @returns {ReactElement} - Promotional banner
 */
export const renderVoucherBanner = (voucherCount: number | null, onNavigate: (route: DashboardRoute) => void): ReactElement => {
  /**
   * Open the voucher page.
   * @returns {void}
   */
  const handleClick = (): void => {
    onNavigate("/master-voucher");
  };
  const headline = voucherCount === null
    ? "Bikin Customer Puas Maksimal dengan Voucher Pilihan"
    : `Bikin Customer Puas Maksimal dengan ${voucherCount} Voucher Aktif`;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Lihat voucher promo"
      className="group relative flex min-h-28 w-full cursor-pointer items-center justify-between overflow-hidden rounded-3xl border border-[#74C919]/40 bg-gradient-to-r from-[#8BE328] via-[#DCF87D] to-[#8BE328] px-4 py-4 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:brightness-105 active:scale-[0.99] sm:min-h-32 sm:px-8 sm:py-5 dark:border-lime-500/30 dark:from-[#173814] dark:via-[#265320] dark:to-[#173814]"
    >
      <div className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full bg-[#B8F042]/50 blur-md dark:bg-lime-500/20" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-[#B8F042]/50 blur-md dark:bg-lime-500/20" aria-hidden="true" />

      {_renderLeftTicket()}

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-2 sm:px-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#123816] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#D9F99D] shadow-xs sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#A3E635] animate-pulse" />
          Promo Voucher
        </div>
        <h3 className="mt-1.5 text-base font-extrabold tracking-tight text-[#0A260F] sm:text-xl md:text-2xl dark:text-lime-100">
          {headline}
        </h3>
        <p className="mt-0.5 text-xs font-semibold text-[#1B4320] sm:text-sm dark:text-lime-200/90">
          Berikan ekstra kepuasan lewat penawaran sewa yang lebih berkesan.
        </p>
      </div>

      {_renderRightTicket()}
    </button>
  );
};

/**
 * Render the desktop loading skeleton.
 * @param {DashboardMenuItem[]} menuItems - Menu items, first four become metric placeholders
 * @returns {ReactElement} - Desktop skeleton
 */
const _renderDesktopSkeleton = (menuItems: DashboardMenuItem[]): ReactElement => (
  <section className="hidden min-h-full bg-background-page lg:block" role="status" aria-label="Loading dashboard">
    <header className="mb-6 flex items-start justify-between gap-6">
      <div className="space-y-2">
        <div className="h-10 w-52 animate-pulse rounded bg-background-subtle" />
        <div className="h-5 w-96 animate-pulse rounded bg-background-subtle" />
      </div>
      <div className="h-5 w-44 animate-pulse rounded bg-background-subtle" />
    </header>
    <div className="grid grid-cols-4 gap-5">
      {menuItems.slice(0, 4).map((item) => (
        <div key={item.label} className="h-32 animate-pulse rounded-3xl border border-border-default bg-background-surface p-6">
          <div className="h-4 w-20 rounded bg-background-subtle" />
          <div className="mt-4 h-9 w-14 rounded bg-background-subtle" />
          <div className="mt-3 h-4 w-28 rounded bg-background-subtle" />
        </div>
      ))}
    </div>
    <div className="mt-6 grid min-h-[calc(100vh-28rem)] grid-cols-3 gap-5">
      <div className="col-span-2 rounded-3xl border border-border-default bg-background-surface p-6">
        <div className="flex items-start justify-between border-b border-border-default pb-4">
          <div className="space-y-2"><div className="h-5 w-48 animate-pulse rounded bg-background-subtle" /><div className="h-4 w-72 animate-pulse rounded bg-background-subtle" /></div>
          <div className="h-4 w-48 animate-pulse rounded bg-background-subtle" />
        </div>
        <div className="mt-6 h-[calc(100vh-38rem)] min-h-[22rem] animate-pulse rounded-lg bg-background-subtle" />
      </div>
      <div className="rounded-3xl border border-border-default bg-background-surface p-6">
        <div className="h-16 animate-pulse rounded bg-background-subtle" />
        <div className="mt-5 grid grid-cols-7 gap-px overflow-hidden rounded border border-border-default bg-border-default">
          {Array.from({ length: 35 }, (_, index) => <div key={index} className="min-h-[6rem] animate-pulse bg-background-surface" />)}
        </div>
      </div>
    </div>
  </section>
);

/**
 * Render the mobile loading skeleton.
 * @param {DashboardMenuItem[]} menuItems - Menu items, one placeholder tile each
 * @returns {ReactElement} - Mobile skeleton
 */
const _renderMobileSkeleton = (menuItems: DashboardMenuItem[]): ReactElement => (
  <div className="-m-4 pb-10 lg:hidden" role="status" aria-label="Loading dashboard">
    <div className="h-64 w-full animate-pulse bg-background-subtle" />
    <div className="relative -mt-10 px-4 sm:px-6">
      <div className="rounded-2xl border border-border-default bg-background-surface p-4 shadow-medium">
        <div className="grid grid-cols-4 gap-x-2 gap-y-6">
          {menuItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5">
              <div className="h-24 w-24 animate-pulse rounded-3xl bg-background-subtle" />
              <div className="h-5 w-16 animate-pulse rounded-md bg-background-subtle" />
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="mt-10 px-4 sm:px-6"><div className="h-28 w-full animate-pulse rounded-2xl bg-background-subtle" /></div>
    <div className="mt-10 px-4 sm:px-6">
      <div className="mb-3 flex items-center justify-between"><div className="h-6 w-40 animate-pulse rounded-md bg-background-subtle" /><div className="h-5 w-20 animate-pulse rounded-md bg-background-subtle" /></div>
      <div className="no-scrollbar flex gap-4 overflow-hidden pb-2">
        <div className="h-48 w-[85%] shrink-0 animate-pulse rounded-2xl bg-background-subtle" />
        <div className="h-48 w-[85%] shrink-0 animate-pulse rounded-2xl bg-background-subtle" />
        <div className="h-48 w-[85%] shrink-0 animate-pulse rounded-2xl bg-background-subtle" />
      </div>
    </div>
  </div>
);

/**
 * Render the full-page loading skeleton for desktop and mobile.
 * @param {DashboardMenuItem[]} menuItems - Menu items, one placeholder tile each
 * @returns {ReactElement} - Skeleton
 */
export const renderDashboardSkeleton = (menuItems: DashboardMenuItem[]): ReactElement => (
  <>
    {_renderDesktopSkeleton(menuItems)}
    {_renderMobileSkeleton(menuItems)}
  </>
);
