import * as React from "react";

import { QuickActions } from "./components/QuickActions";
import { RecentQuotesTable } from "./components/RecentQuotesTable";
import { StatCards } from "./components/StatCards";
import type { DesktopDashboardProps } from './DesktopDashboard.type';
import Layout from "../../../app/layout";

/**
 * Render Desktop Dashboard
 * @param {DesktopDashboardProps} props - component props
 * @returns {React.ReactElement} - desktop dashboard component
 */
export const DesktopDashboardComponent = ({ quotes, onNewOrder, onReturn }: DesktopDashboardProps): React.ReactElement => {
  return (
    <Layout pageTitle="Dashboard Overview">
      <div className="space-y-6">
        <StatCards />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentQuotesTable quotes={quotes} />
          <QuickActions onNewOrder={onNewOrder} onReturn={onReturn} />
        </div>
      </div>
    </Layout>
  );
};
