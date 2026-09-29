import * as React from "react";

import type { MobileDashboardProps,QuickActionsProps, StatusCardProps } from "./MobileDashboard.type";

/**
 * Render Status Card
 * @param {StatusCardProps} props - status card props
 * @returns {React.ReactElement} - StatusCard
 */
const _renderStatusCard = (props: StatusCardProps): React.ReactElement => {
  const { title, count, bgColor, iconColor, icon } = props;

  return (
    <div className={`${bgColor} rounded-4xl p-4 flex flex-col aspect-square shadow-sm overflow-hidden`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 ${iconColor} shadow-sm`}>
           {icon}
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-gray-700 text-[14px] leading-tight block wrap-break-word">{title}</span>
        </div>
      </div>
      <div className="flex-1 w-full flex items-center justify-center pb-2">
        <span className="text-7xl font-bold text-gray-900 leading-none tracking-tighter">{count}</span>
      </div>
    </div>
  );
};

/**
 * Render Quick Actions
 * @param {QuickActionsProps} props - quick action props
 * @returns {React.ReactElement} - Quick Actions
 */
const _renderQuickActions = (props: QuickActionsProps): React.ReactElement => {
  const { onAddOrder, onOrderReport } = props;

  return (
    <div className="flex flex-col mb-6">
      <h3 className="text-[20px] font-medium text-gray-900 mb-4 tracking-wide">Quick Action</h3>
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={onAddOrder}
          className="bg-[#daeaf3] rounded-4xl p-5 flex flex-col items-center justify-center shadow-sm active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#3b82f6] mb-3 shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
          <span className="text-[15px] font-medium text-gray-900 text-center leading-tight">Add New<br/>Order</span>
        </button>
        <button 
          onClick={onOrderReport}
          className="bg-[#f4e482] rounded-4xl p-5 flex flex-col items-center justify-center shadow-sm active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#eab308] mb-3 shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <span className="text-[15px] font-medium text-gray-900 text-center leading-tight">Order<br/>Report</span>
        </button>
      </div>
    </div>
  );
};

/**
 * Render Mobile Dashboard View Component
 * @param {MobileDashboardProps} props - component props
 * @returns {React.ReactElement} - Mobile Dashboard
 */
export const MobileDashboardComponent = (props: MobileDashboardProps): React.ReactElement => {
  const { onAddOrder, onOrderReport, statuses } = props;

  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-32 relative overflow-y-auto mt-2">
      <div className="px-6">
        <h2 className="text-[32px] font-normal tracking-wide text-gray-900 mb-6">Order Data</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {statuses.map(s => (
            <_renderStatusCard 
              key={s.title} 
              title={s.title} 
              count={s.count} 
              bgColor={s.bgColor} 
              iconColor={s.iconColor} 
              icon={s.icon} 
            />
          ))}
        </div>
        
        <_renderQuickActions onAddOrder={onAddOrder} onOrderReport={onOrderReport} />
      </div>
    </div>
  );
};
