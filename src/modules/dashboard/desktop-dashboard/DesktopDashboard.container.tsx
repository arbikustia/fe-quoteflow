import * as React from 'react';

import { DesktopDashboardComponent } from './DesktopDashboard.component';
import { useDesktopDashboardEffect } from './DesktopDashboard.hook';
import type { RecentQuote } from './DesktopDashboard.type';

const mockQuotes: RecentQuote[] = [
  {
    client: "YOUTHCAMP GPdI",
    amount: "Rp 42.500.000",
    status: "Pending",
    date: "Today, 10:24 AM",
    color: "text-brand-orange-dark",
    bg: "bg-brand-orange-light",
  },
  {
    client: "Gereja Bethany",
    amount: "Rp 15.000.000",
    status: "Approved",
    date: "Yesterday, 3:15 PM",
    color: "text-brand-blue",
    bg: "bg-brand-blue-light",
  },
  {
    client: "Wedding Party",
    amount: "Rp 20.000.000",
    status: "On Rental",
    date: "Sep 24, 2026",
    color: "text-brand-blue",
    bg: "bg-brand-blue-light",
  },
  {
    client: "Konser Musik",
    amount: "Rp 75.000.000",
    status: "Completed",
    date: "Sep 22, 2026",
    color: "text-brand-text-medium",
    bg: "bg-brand-gray-light",
  },
];

/**
 * Render Desktop Dashboard Container
 * @returns {React.ReactElement} - component
 */
export default function DesktopDashboardContainer(): React.ReactElement {
  const { handleNewOrder, handleReturn } = useDesktopDashboardEffect();
  
  return (
    <DesktopDashboardComponent 
      onNewOrder={handleNewOrder}
      onReturn={handleReturn}
      quotes={mockQuotes}
    />
  );
}
