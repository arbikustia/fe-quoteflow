import type { ReactElement } from "react";

import { DASHBOARD_BANNER } from "./Dashboard.config";
import { renderCalendarPreview, renderDashboardSkeleton, renderDesktopOrderChart, renderMenuIcon, renderMetricCards, renderMobileOrderChart, renderVoucherBanner } from "./Dashboard.helper";
import type { DashboardMenuItem, DashboardProps } from "./Dashboard.type";

import ResponsiveLayout from "@/app/shared/ResponsiveLayout";

/**
 * Render the desktop dashboard (metrics, order chart, calendar).
 * @param {DashboardProps} props - Dashboard props
 * @returns {ReactElement} - Desktop section
 */
export const _renderDesktop = (props: DashboardProps): ReactElement => {
  const { overview, orderState, calendar, onNavigate } = props;
  const firstDatum = orderState.chartData[0];
  const lastDatum = orderState.chartData[orderState.chartData.length - 1];

  return (
    <section className="hidden min-h-full bg-background-page lg:block">
      <header className="mb-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="truncate text-4xl font-semibold leading-tight tracking-tight text-text-primary">Dashboard</h1>
          <p className="mt-2 text-sm text-text-secondary">Monitor quotation, invoice, payment, and voucher performance.</p>
        </div>
      </header>

      {renderMetricCards(overview)}

      <div className="mt-6 grid min-h-[calc(100vh-28rem)] grid-cols-3 gap-5">
        <div className="col-span-2 h-full rounded-3xl border border-border-default bg-background-surface p-6 shadow-none">
          <div className="flex items-start justify-between gap-6 border-b border-border-default pb-4">
            <div>
              <h2 className="text-base font-semibold text-text-primary">Rental order performance</h2>
              <p className="mt-1 text-sm text-text-secondary">Rental orders created in the last 7 days.</p>
            </div>
            {orderState.chartData.length > 0 && (
              <span className="shrink-0 text-sm text-text-tertiary">{firstDatum.label} - {lastDatum.label}</span>
            )}
          </div>
          {renderDesktopOrderChart(orderState)}
        </div>
        {renderCalendarPreview(calendar, onNavigate)}
      </div>
    </section>
  );
};

/**
 * Render one mobile menu tile.
 * @param {DashboardMenuItem} item - Menu item
 * @param {(item: DashboardMenuItem) => void} onSelect - Called with the item when pressed
 * @returns {ReactElement} - Menu button
 */
export const _renderMenuItem = (item: DashboardMenuItem, onSelect: (item: DashboardMenuItem) => void): ReactElement => (
  <button
    key={item.label}
    type="button"
    onClick={(): void => onSelect(item)}
    className="flex flex-col items-center gap-1.5 focus:outline-none"
    aria-label={`Open ${item.label}`}
  >
    <div className={`relative flex h-24 w-24 items-center justify-center rounded-3xl border border-border-default ${item.backgroundClassName} transition-transform active:scale-95`}>
      {renderMenuIcon(item)}
    </div>
    <span className="text-base font-medium text-text-primary text-center leading-tight">{item.label}</span>
  </button>
);

/**
 * Render the mobile dashboard (banner, menu, voucher, chart).
 * @param {DashboardProps} props - Dashboard props
 * @returns {ReactElement} - Mobile block
 */
export const _renderMobile = (props: DashboardProps): ReactElement => {
  const { menuItems, voucherCount, orderState, onNavigate } = props;

  return (
    <div className="-m-4 pb-28 lg:hidden">
      <div className="relative h-64 w-full overflow-hidden">
        <img src={DASHBOARD_BANNER} alt="" className="h-full w-full object-cover" aria-hidden="true" />
      </div>

      <div className="relative -mt-10 px-4 sm:px-6">
        <div className="rounded-2xl border border-border-default bg-background-surface p-4 shadow-medium">
          <div className="grid grid-cols-4 gap-x-2 gap-y-6">
            {menuItems.map((item) => _renderMenuItem(item, (selected): void => onNavigate(selected.route)))}
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-10">
        <div className="px-4 sm:px-6">{renderVoucherBanner(voucherCount, onNavigate)}</div>
        <div className="space-y-8 px-4 sm:px-6">
          <section>
            <h2 className="mb-4 text-xl font-bold text-text-primary">Rental order performance</h2>
            {renderMobileOrderChart(orderState)}
          </section>
        </div>
      </div>
    </div>
  );
};

/**
 * Render the dashboard page.
 * @param {DashboardProps} props - Dashboard props
 * @returns {ReactElement} - Dashboard page
 */
const DashboardComponent = (props: DashboardProps): ReactElement => {
  if (props.isLoading) {
    return <ResponsiveLayout showMobileHeader={false}>{renderDashboardSkeleton(props.menuItems)}</ResponsiveLayout>;
  }

  return (
    <ResponsiveLayout showMobileHeader={false}>
      {_renderDesktop(props)}
      {_renderMobile(props)}
    </ResponsiveLayout>
  );
};

export default DashboardComponent;
