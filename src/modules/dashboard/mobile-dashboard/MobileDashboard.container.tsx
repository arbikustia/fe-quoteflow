import * as React from 'react';

import { MobileDashboardComponent } from './MobileDashboard.component';
import { useMobileDashboardEffect } from './MobileDashboard.hook';
import type { StatusCardProps } from './MobileDashboard.type';
import { MOCK_QUOTES } from '../../../fixture/quotes';

/**
 * Render Mobile Dashboard Container
 * @returns {React.ReactElement} - Container
 */
const MobileDashboardContainer = (): React.ReactElement => {
  const { handleAddOrder, handleOrderReport } = useMobileDashboardEffect();

  const statuses: StatusCardProps[] = [
    { title: "Pending Payment", bgColor: "bg-[#fdf2c8]", iconColor: "text-[#a87b1e]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>, count: 0 },
    { title: "Confirmed", bgColor: "bg-[#d7e6c3]", iconColor: "text-[#4a7246]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, count: 0 },
    { title: "On Rental", bgColor: "bg-[#daeaf3]", iconColor: "text-[#3b82f6]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>, count: 0 },
    { title: "Returned", bgColor: "bg-[#e7dff2]", iconColor: "text-[#907cb5]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>, count: 0 },
    { title: "Completed", bgColor: "bg-[#e7efdd]", iconColor: "text-[#4a7246]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>, count: 0 },
    { title: "Cancel", bgColor: "bg-[#fee2e2]", iconColor: "text-[#ef4444]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>, count: 0 },
  ].map(s => ({
    ...s,
    count: MOCK_QUOTES.filter(q => q.status === s.title).length
  }));

  return (
    <MobileDashboardComponent 
      onAddOrder={handleAddOrder} 
      onOrderReport={handleOrderReport} 
      statuses={statuses} 
    />
  );
};

export default MobileDashboardContainer;
