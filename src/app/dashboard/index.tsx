import type { ReactElement } from "react";

import { DASHBOARD_MENU_ITEMS } from "./Dashboard.config";
import { useDashboardNavigation } from "./Dashboard.hook";
import BannerApp from "../../assets/banner-app.png";
import ResponsiveLayout from "../shared/ResponsiveLayout";

/**
 * Render home page structure.
 * @returns {ReactElement} Home page
 */
export default function Dashboard(): ReactElement {
  const { navigateTo } = useDashboardNavigation();

  return (
    <ResponsiveLayout showMobileHeader={false}>
      <div className="-m-4 pb-10 lg:-m-8">
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
            </div>
          </div>
        </div>

        <div className="mt-10 px-4 sm:px-6">
          <div className="h-28 w-full rounded-2xl border border-success/20 bg-success-subtle" />
        </div>

        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6">
          <div className="h-48 w-[85%] shrink-0 snap-start rounded-2xl border border-border-default bg-background-surface" />
          <div className="h-48 w-[85%] shrink-0 snap-start rounded-2xl border border-border-default bg-background-surface" />
          <div className="h-48 w-[85%] shrink-0 snap-start rounded-2xl border border-border-default bg-background-surface" />
        </div>
      </div>
    </ResponsiveLayout>
  );
}
