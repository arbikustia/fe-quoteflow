import { Card } from "antd";
import type { ReactElement } from "react";

import { CalendarComponent } from "@/components/Calendar";
import { Icons } from "@/components/Icons";

import { DASHBOARD_MENU_ITEMS } from "./Dashboard.config";
import { useDashboardAssets, useDashboardNavigation, useDashboardOrders, useDashboardOverview, useDashboardQuotations } from "./Dashboard.hook";
import type { DashboardMetric, DashboardOrder, DashboardQuotation, DashboardQuotationChartDatum, DashboardRoute } from "./Dashboard.type";
import ResponsiveLayout from "../shared/ResponsiveLayout";
import BannerApp from "../../assets/banner-app.png";

/**
 * Render promotional voucher banner.
 * @param {number | null} count - Active voucher count
 * @param {(route: DashboardRoute) => void} onClick - Banner click handler
 * @returns {ReactElement} Promotional banner
 */
/**
 * Render quotation carousel cards.
 * @param {DashboardQuotation[]} quotations - Dashboard quotations
 * @param {(id: string) => void} onClick - Quotation click handler
 * @returns {ReactElement} Quotation cards
 */
const _renderQuotationCards = (quotations: DashboardQuotation[], onClick: (id: string) => void): ReactElement => (
  <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
    {quotations.length > 0 ? quotations.map((quotation) => (
      <button
        key={quotation.id}
        type="button"
        onClick={(): void => onClick(quotation.id)}
        className="flex h-52 w-[85%] shrink-0 snap-start cursor-pointer flex-col justify-between rounded-2xl border border-border-default bg-background-surface p-4 text-left transition-shadow hover:shadow-small focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      >
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate text-xl font-bold text-text-primary">{quotation.quotationNumber}</h3>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${quotation.status === 1 ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
              {quotation.status === 1 ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="mt-3 truncate text-lg font-semibold text-text-primary">{quotation.customerName}</p>
          <p className="mt-1 truncate text-base text-text-secondary">{quotation.eventName}</p>
        </div>
        <div>
          <p className="text-base text-text-secondary">{quotation.startDate} - {quotation.endDate}</p>
          <p className="mt-1 text-lg font-bold text-action-primary">Rp {quotation.grandTotal.toLocaleString("id-ID")}</p>
        </div>
      </button>
    )) : (
      <div className="flex h-48 w-full items-center justify-center rounded-2xl border border-dashed border-border-default text-sm text-text-secondary">
        Belum ada quotation.
      </div>
    )}
  </div>
);

/**
 * Render order carousel cards.
 * @param {DashboardOrder[]} orders - Dashboard orders
 * @param {(id: string) => void} onClick - Order click handler
 * @returns {ReactElement} Order cards
 */
const _renderOrderCards = (orders: DashboardOrder[], onClick: (id: string) => void): ReactElement => (
  <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
    {orders.length > 0 ? orders.map((order) => (
      <button
        key={order.id}
        type="button"
        onClick={(): void => onClick(order.id)}
        className="flex h-52 w-[85%] shrink-0 snap-start cursor-pointer flex-col justify-between rounded-2xl border border-border-default bg-background-surface p-4 text-left transition-shadow hover:shadow-small focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      >
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate text-xl font-bold text-text-primary">{order.eventName}</h3>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${order.status === 1 ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
              {order.status === 1 ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="mt-3 truncate text-lg font-semibold text-text-primary">{order.customerName}</p>
          <p className="mt-1 truncate text-base text-text-secondary">{order.startDate} - {order.endDate}</p>
        </div>
        <p className="text-lg font-bold text-action-primary">Rp {order.grandTotal.toLocaleString("id-ID")}</p>
      </button>
    )) : (
      <div className="flex h-48 w-full items-center justify-center rounded-2xl border border-dashed border-border-default text-sm text-text-secondary">
        Belum ada rental order.
      </div>
    )}
  </div>
);

/**
 * Render daily creation bar chart with Ant Design card surface.
 * @param {DashboardQuotationChartDatum[]} chartData - Daily counts
 * @param {string} title - Chart title
 * @param {string} description - Chart description
 * @returns {ReactElement} Creation chart
 */
const _renderCreationChart = (
  chartData: DashboardQuotationChartDatum[],
  title: string,
  description: string,
): ReactElement => {
  const maxCount = Math.max(...chartData.map((item) => item.count), 1);
  const totalCount = chartData.reduce((total, item) => total + item.count, 0);

  return (
    <Card
      title={<span className="text-xl font-bold">{title}</span>}
      extra={<span className="text-sm font-semibold text-action-primary">{totalCount} minggu ini</span>}
      size="small"
      className="mt-14 overflow-hidden rounded-2xl border-border-default shadow-none"
      styles={{ header: { borderBottom: "0", padding: "16px 16px 0" }, body: { padding: "8px 16px 16px" } }}
    >
      <p className="mb-3 text-base text-text-secondary">{description}</p>
      <div className="flex h-40 items-end justify-between gap-2" role="img" aria-label="Bar chart jumlah quotation dibuat per hari">
        {chartData.map((item) => {
          const height = `${Math.max((item.count / maxCount) * 100, item.count > 0 ? 12 : 2)}%`;

          return (
            <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
              <span className="text-xs font-semibold text-text-secondary">{item.count}</span>
              <div className="flex h-24 w-full items-end rounded-t-md bg-background-subtle">
                <div className="w-full rounded-t-md bg-action-primary transition-[height] duration-300" style={{ height }} />
              </div>
              <span className="w-full truncate text-center text-[11px] text-text-tertiary">{item.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

/**
 * Render current-month calendar preview.
 * @param {(route: DashboardRoute) => void} onClick - Calendar navigation handler
 * @returns {ReactElement} Calendar preview card
 */
const _renderCalendarPreview = (
  events: ReturnType<typeof useDashboardQuotations>["calendarEvents"],
  isLoading: boolean,
  onClick: (route: DashboardRoute) => void,
): ReactElement => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(): void => onClick("/calendar")}
      onKeyDown={(event): void => {
        if (event.key === "Enter" || event.key === " ") onClick("/calendar");
      }}
      className="cursor-pointer rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      aria-label="Open calendar"
    >
      <CalendarComponent
        events={events}
        currentDate={new Date()}
        isLoading={isLoading}
        showControls={false}
        className="h-full transition-colors hover:bg-background-subtle"
      />
    </div>
  );
};

const _renderDesktopDashboard = (
  overview: ReturnType<typeof useDashboardOverview>,
  quotationState: ReturnType<typeof useDashboardQuotations>,
  onNavigate: (route: DashboardRoute) => void,
): ReactElement => {
  const metrics: DashboardMetric[] = [
    { label: "Quotation", count: overview.quotationCount, value: overview.quotationValue, colorClassName: "bg-action-primary" },
    { label: "Invoice", count: overview.invoiceCount, value: overview.invoiceValue, colorClassName: "bg-information" },
    { label: "Payment", count: overview.paymentCount, value: overview.paymentValue, colorClassName: "bg-success" },
    { label: "Voucher", count: overview.voucherCount, value: 0, colorClassName: "bg-accent-500" },
  ];
  const rentalOrder = overview.trend[0];
  let rentalOrderContent: ReactElement;

  if (overview.isChartLoading) {
    rentalOrderContent = <div className="mt-6 h-40 animate-pulse rounded-lg bg-background-subtle" role="status" aria-label="Loading rental order chart" />;
  } else if (overview.isChartError) {
    rentalOrderContent = <p className="mt-6 rounded-lg border border-danger bg-danger-subtle px-4 py-3 text-sm text-danger-strong">Rental order performance unavailable.</p>;
  } else if (rentalOrder) {
    const chartLabel = `${rentalOrder.totalOrders.toLocaleString("id-ID")} rental orders, total value Rp ${rentalOrder.totalAmount.toLocaleString("id-ID")}, ${rentalOrder.label}`;
    rentalOrderContent = <div className="mt-6"><div className="mb-5 flex items-end justify-between gap-6"><div><p className="text-sm text-text-secondary">Total rental value</p><p className="mt-1 tabular-nums text-2xl font-semibold text-text-primary">Rp {rentalOrder.totalAmount.toLocaleString("id-ID")}</p></div><div className="flex items-center gap-2 text-sm text-text-secondary"><span className="h-3 w-3 rounded-sm bg-action-primary" aria-hidden="true" />Rental orders</div></div><div className="grid h-[calc(100vh-38rem)] min-h-[22rem] grid-cols-[3rem_1fr] gap-4" role="img" aria-label={chartLabel}><div className="flex flex-col justify-between text-right text-xs tabular-nums text-text-tertiary"><span>{rentalOrder.totalOrders.toLocaleString("id-ID")}</span><span>0</span></div><div className="relative border-b border-l border-border-strong"><div className="pointer-events-none absolute inset-0 flex flex-col justify-between" aria-hidden="true"><span className="border-t border-border-default" /><span className="border-t border-border-default" /><span className="border-t border-border-default" /></div><div className="absolute inset-0 flex items-end justify-center px-12 pt-6"><div className="relative h-full w-32 max-w-full rounded-t-lg bg-action-primary"><span className="absolute -top-7 left-1/2 -translate-x-1/2 tabular-nums text-sm font-semibold text-text-primary">{rentalOrder.totalOrders.toLocaleString("id-ID")}</span></div></div></div></div><p className="mt-3 text-center text-sm text-text-tertiary">{rentalOrder.label}</p></div>;
  } else {
    rentalOrderContent = <p className="mt-6 rounded-lg border border-dashed border-border-default px-4 py-10 text-center text-sm text-text-secondary">No rental order data for this period.</p>;
  }

  return (
    <section className="hidden min-h-full bg-background-page p-6 lg:block xl:p-8">
      <header className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-text-tertiary">Overview</p>
          <h1 className="mt-1 text-3xl font-semibold text-text-primary">Dashboard</h1>
          <p className="mt-2 text-sm text-text-secondary">Monitor quotation, invoice, payment, and voucher performance.</p>
        </div>
        <p className="text-sm text-text-tertiary">Updated from current records</p>
      </header>

      <div className="grid grid-cols-4 gap-5">
        {metrics.map((metric) => (
          <Card key={metric.label} className="rounded-xl border-border-default bg-background-surface shadow-none">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-text-secondary">{metric.label}</p>
                <p className="mt-3 tabular-nums text-3xl font-semibold text-text-primary">{overview.isLoading ? "-" : metric.count.toLocaleString("id-ID")}</p>
                {metric.value > 0 && <p className="mt-2 tabular-nums text-sm text-text-secondary">Rp {metric.value.toLocaleString("id-ID")}</p>}
              </div>
              <span className={`mt-1 h-2.5 w-2.5 rounded-full ${metric.colorClassName}`} aria-hidden="true" />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid min-h-[calc(100vh-28rem)] grid-cols-3 gap-5">
        <Card className="col-span-2 h-full rounded-xl border-border-default bg-background-surface shadow-none">
          <div className="flex items-start justify-between gap-6 border-b border-border-default pb-4">
            <div>
              <h2 className="text-base font-semibold text-text-primary">Rental order performance</h2>
              <p className="mt-1 text-sm text-text-secondary">Rental orders and value within selected 30-day period.</p>
            </div>
            <span className="shrink-0 text-sm text-text-tertiary">{overview.chartDateFrom} - {overview.chartDateTo}</span>
          </div>
          {rentalOrderContent}
        </Card>
        {_renderCalendarPreview(quotationState.calendarEvents, quotationState.isLoading, onNavigate)}
      </div>
    </section>
  );
};

const _renderVoucherBanner = (
  count: number | null,
  onClick: (route: DashboardRoute) => void,
): ReactElement => {
  const handleClick = (): void => onClick("/master-voucher");
  const headline = count !== null
    ? `Bikin Customer Puas Maksimal dengan ${count} Voucher Aktif`
    : "Bikin Customer Puas Maksimal dengan Voucher Pilihan";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Lihat voucher promo"
      className="group relative flex min-h-28 w-full cursor-pointer items-center justify-between overflow-hidden rounded-3xl border border-[#74C919]/40 bg-gradient-to-r from-[#8BE328] via-[#DCF87D] to-[#8BE328] px-4 py-4 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:brightness-105 active:scale-[0.99] sm:min-h-32 sm:px-8 sm:py-5 dark:border-lime-500/30 dark:from-[#173814] dark:via-[#265320] dark:to-[#173814]"
    >
      <div className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full bg-[#B8F042]/50 blur-md dark:bg-lime-500/20" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-[#B8F042]/50 blur-md dark:bg-lime-500/20" aria-hidden="true" />

      {/* Left decorative coupon ticket */}
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

      {/* Center copywriting content */}
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

      {/* Right decorative coupon ticket */}
      <div className="pointer-events-none relative z-10 hidden shrink-0 rotate-12 transition-transform duration-300 group-hover:rotate-6 xs:block sm:block" aria-hidden="true">
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
    </button>
  );
};

/**
 * Render mobile rental-order carousel state.
 * @param {ReturnType<typeof useDashboardOrders>} orderState - Rental order state
 * @param {(id: string) => void} onClick - Order detail navigation
 * @returns {ReactElement} Carousel, loading, or error state
 */
const _renderMobileRentalOrders = (orderState: ReturnType<typeof useDashboardOrders>, onClick: (id: string) => void): ReactElement => {
  if (orderState.isLoading) {
    return (
      <div className="no-scrollbar flex gap-4 overflow-hidden pb-2" role="status" aria-label="Loading rental orders">
        {[0, 1, 2].map((item) => <div key={item} className="h-48 w-[85%] shrink-0 animate-pulse rounded-2xl bg-background-subtle" />)}
      </div>
    );
  }

  if (orderState.isError) {
    return <p className="rounded-xl border border-danger bg-danger-subtle px-4 py-3 text-sm text-danger-strong">Rental orders unavailable.</p>;
  }

  return _renderOrderCards(orderState.orders, onClick);
};

/**
 * Render mobile rental-order summary from desktop overview data.
 * @param {ReturnType<typeof useDashboardOverview>} overview - Shared rental-order overview
 * @returns {ReactElement} Mobile chart or explicit data state
 */
const _renderMobileRentalOrderChart = (overview: ReturnType<typeof useDashboardOverview>): ReactElement => {
  const rentalOrder = overview.trend[0];

  if (overview.isChartLoading) {
    return <div className="h-40 animate-pulse rounded-xl bg-background-subtle" role="status" aria-label="Loading rental order chart" />;
  }

  if (overview.isChartError) {
    return <p className="rounded-xl border border-danger bg-danger-subtle px-4 py-3 text-sm text-danger-strong">Rental order performance unavailable.</p>;
  }

  if (!rentalOrder) {
    return <p className="rounded-xl border border-dashed border-border-default px-4 py-10 text-center text-sm text-text-secondary">No rental order data for this period.</p>;
  }

  return (
    <div className="rounded-xl border border-border-default bg-background-surface p-4">
      <p className="text-sm text-text-secondary">Total rental value</p>
      <p className="mt-1 tabular-nums text-xl font-semibold text-text-primary">Rp {rentalOrder.totalAmount.toLocaleString("id-ID")}</p>
      <div className="mt-5 flex h-32 items-end justify-center border-b border-border-strong" role="img" aria-label={`${rentalOrder.totalOrders.toLocaleString("id-ID")} rental orders, total value Rp ${rentalOrder.totalAmount.toLocaleString("id-ID")}, ${rentalOrder.label}`}>
        <div className={`flex w-24 items-start justify-center rounded-t-lg bg-action-primary pt-2 text-sm font-semibold text-text-inverse ${rentalOrder.totalOrders > 0 ? "h-full" : "h-1"}`}>{rentalOrder.totalOrders > 0 && rentalOrder.totalOrders.toLocaleString("id-ID")}</div>
      </div>
      <p className="mt-3 text-center text-sm text-text-tertiary">{rentalOrder.label}</p>
    </div>
  );
};

/**
 * Render home page structure.
 * @returns {ReactElement} Home page
 */
export default function Dashboard(): ReactElement {
  const { navigateTo, navigateToOrder, navigateToQuotation } = useDashboardNavigation();
  const { isLoading, voucherCount } = useDashboardAssets();
  const quotationState = useDashboardQuotations();
  const orderState = useDashboardOrders();
  const overview = useDashboardOverview();

  if (isLoading) {
    return (
      <ResponsiveLayout showMobileHeader={false}>
        <section className="hidden min-h-full bg-background-page p-6 lg:block xl:p-8" role="status" aria-label="Loading dashboard">
          <header className="mb-8 flex items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="h-4 w-20 animate-pulse rounded bg-background-subtle" />
              <div className="h-10 w-40 animate-pulse rounded bg-background-subtle" />
              <div className="h-5 w-96 animate-pulse rounded bg-background-subtle" />
            </div>
            <div className="h-5 w-44 animate-pulse rounded bg-background-subtle" />
          </header>
          <div className="grid grid-cols-4 gap-5">
            {DASHBOARD_MENU_ITEMS.slice(0, 4).map((item) => (
              <div key={item.label} className="h-32 animate-pulse rounded-xl border border-border-default bg-background-surface p-6">
                <div className="h-4 w-20 rounded bg-background-subtle" />
                <div className="mt-4 h-9 w-14 rounded bg-background-subtle" />
                <div className="mt-3 h-4 w-28 rounded bg-background-subtle" />
              </div>
            ))}
          </div>
          <div className="mt-6 grid min-h-[calc(100vh-28rem)] grid-cols-3 gap-5">
            <div className="col-span-2 rounded-xl border border-border-default bg-background-surface p-6">
              <div className="flex items-start justify-between border-b border-border-default pb-4">
                <div className="space-y-2"><div className="h-5 w-48 animate-pulse rounded bg-background-subtle" /><div className="h-4 w-72 animate-pulse rounded bg-background-subtle" /></div>
                <div className="h-4 w-48 animate-pulse rounded bg-background-subtle" />
              </div>
              <div className="mt-6 h-[calc(100vh-38rem)] min-h-[22rem] animate-pulse rounded-lg bg-background-subtle" />
            </div>
            <div className="rounded-xl border border-border-default bg-background-surface p-6">
              <div className="h-16 animate-pulse rounded bg-background-subtle" />
              <div className="mt-5 grid grid-cols-7 gap-px overflow-hidden rounded border border-border-default bg-border-default">{Array.from({ length: 35 }, (_, index) => <div key={index} className="min-h-[6rem] animate-pulse bg-background-surface" />)}</div>
            </div>
          </div>
        </section>
        <div className="-m-4 pb-10 lg:hidden" role="status" aria-label="Loading dashboard">
          <div className="h-64 w-full animate-pulse bg-background-subtle" />
          <div className="relative -mt-10 px-4 sm:px-6"><div className="rounded-2xl border border-border-default bg-background-surface p-4 shadow-medium"><div className="grid grid-cols-4 gap-x-2 gap-y-6">{DASHBOARD_MENU_ITEMS.map((item) => <div key={item.label} className="flex flex-col items-center gap-1.5"><div className="h-24 w-24 animate-pulse rounded-3xl bg-background-subtle" /><div className="h-5 w-16 animate-pulse rounded-md bg-background-subtle" /></div>)}<div className="flex flex-col items-center gap-1.5"><div className="h-24 w-24 animate-pulse rounded-3xl bg-background-subtle" /><div className="h-5 w-16 animate-pulse rounded-md bg-background-subtle" /></div></div></div></div>
          <div className="mt-10 px-4 sm:px-6"><div className="h-28 w-full animate-pulse rounded-2xl bg-background-subtle" /></div>
          <div className="mt-10 px-4 sm:px-6"><div className="mb-3 flex items-center justify-between"><div className="h-6 w-40 animate-pulse rounded-md bg-background-subtle" /><div className="h-5 w-20 animate-pulse rounded-md bg-background-subtle" /></div><div className="no-scrollbar flex gap-4 overflow-hidden pb-2"><div className="h-48 w-[85%] shrink-0 animate-pulse rounded-2xl bg-background-subtle" /><div className="h-48 w-[85%] shrink-0 animate-pulse rounded-2xl bg-background-subtle" /><div className="h-48 w-[85%] shrink-0 animate-pulse rounded-2xl bg-background-subtle" /></div></div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout showMobileHeader={false}>
      {_renderDesktopDashboard(overview, quotationState, navigateTo)}
      <div className="-m-4 pb-28 lg:hidden">
        <div className="relative h-64 w-full overflow-hidden">
          <img src={BannerApp} alt="" className="h-full w-full object-cover" aria-hidden="true" />
        </div>

        <div className="relative -mt-10 px-4 sm:px-6">
          <div className="rounded-2xl border border-border-default bg-background-surface p-4 shadow-medium">
            <div className="grid grid-cols-4 gap-x-2 gap-y-6">
              {DASHBOARD_MENU_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={(): void => item.route && navigateTo(item.route)}
                  className="flex flex-col items-center gap-1.5 focus:outline-none"
                  aria-label={item.route ? `Open ${item.label}` : item.label}
                >
                  <div className={`relative flex h-24 w-24 items-center justify-center rounded-3xl border border-border-default ${item.backgroundClassName} transition-transform active:scale-95`}>
                    <img src={item.icon} alt="" className="absolute -top-3 h-28 w-28 object-contain" aria-hidden="true" />
                  </div>
                  <span className="text-base font-medium text-text-primary text-center leading-tight">{item.label}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={(): void => navigateTo("/activity-log")}
                className="flex flex-col items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                aria-label="Open Activity Log"
              >
                <span className="flex h-24 w-24 items-center justify-center rounded-3xl border border-border-default bg-background-subtle text-action-primary transition-transform active:scale-95 [&_svg]:h-12 [&_svg]:w-12">
                  <Icons.ActivitySolid />
                </span>
                <span className="text-center text-base font-medium leading-tight text-text-primary">Activity Log</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-10">
          <div className="px-4 sm:px-6">
            {_renderVoucherBanner(voucherCount, navigateTo)}
          </div>

          <div className="px-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Rental orders</h2>
              <button
                type="button"
                onClick={(): void => navigateTo("/report")}
                className="cursor-pointer text-base font-semibold text-action-primary transition-colors hover:text-action-primary-hover focus:outline-none focus-visible:underline sm:text-lg"
              >
                Show More
              </button>
            </div>
            {_renderMobileRentalOrders(orderState, navigateToOrder)}
            <div className="mt-8">
              <h3 className="mb-3 text-lg font-semibold text-text-primary">Rental order performance</h3>
              {_renderMobileRentalOrderChart(overview)}
            </div>
          </div>

          <div className="px-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Quotation Active</h2>
            <button
              type="button"
              onClick={(): void => navigateTo("/document/quotation")}
              className="cursor-pointer text-base font-semibold text-action-primary transition-colors hover:text-action-primary-hover focus:outline-none focus-visible:underline sm:text-lg"
            >
              Show More
            </button>
          </div>
          {quotationState.isLoading ? (
            <div className="no-scrollbar flex gap-4 overflow-hidden pb-2" role="status" aria-label="Loading quotations">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-48 w-[85%] shrink-0 animate-pulse rounded-2xl bg-background-subtle" />
              ))}
            </div>
          ) : _renderQuotationCards(quotationState.quotations, navigateToQuotation)}
            {!quotationState.isLoading && _renderCreationChart(quotationState.chartData, "Quotation Dibuat", "Jumlah quotation yang dibuat dalam 7 hari terakhir.")}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
