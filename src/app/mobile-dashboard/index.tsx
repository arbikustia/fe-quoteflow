import * as React from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_QUOTES } from "../../fixture/quotes";
import type { QuoteData } from "../../modules/order-page/OrderPage.type";



/**
 * Main Order Bar Chart
 * @param {{ readonly quotes: QuoteData[] }} props
 * @returns {React.ReactElement} node
 */
const StatusCard = ({ title, count, bgColor, iconColor, icon }: { readonly title: string, readonly count: number, readonly bgColor: string, readonly iconColor: string, readonly icon: React.ReactNode }): React.ReactElement => (
  <div className={`${bgColor} rounded-4xl p-4 flex flex-col aspect-square shadow-sm overflow-hidden`}>
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 ${iconColor} shadow-sm`}>
         {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-gray-700 text-[14px] leading-tight block break-words">{title}</span>
      </div>
    </div>
    <div className="flex-1 w-full flex items-center justify-center pb-2">
      <span className="text-7xl font-bold text-gray-900 leading-none tracking-tighter">{count}</span>
    </div>
  </div>
);

/**
 * Quick Actions
 * @returns {React.ReactElement} node
 */
const QuickActions = (): React.ReactElement => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col mb-6">
      <h3 className="text-[20px] font-medium text-gray-900 mb-4 tracking-wide">Quick Action</h3>
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => navigate("/order-mobile/create")}
          className="bg-[#daeaf3] rounded-4xl p-5 flex flex-col items-center justify-center shadow-sm active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#3b82f6] mb-3 shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
          <span className="text-[15px] font-medium text-gray-900 text-center leading-tight">Add New<br/>Order</span>
        </button>
        <button 
          onClick={() => navigate("/report-order-mobile")}
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
 * Mobile Dashboard View Component
 * @returns {React.ReactElement} node
 */
export default function MobileDashboard(): React.ReactElement {
  const statuses = [
    { name: "Pending Payment", bg: "bg-[#fdf2c8]", iconColor: "text-[#a87b1e]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> },
    { name: "Confirmed", bg: "bg-[#d7e6c3]", iconColor: "text-[#4a7246]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> },
    { name: "On Rental", bg: "bg-[#daeaf3]", iconColor: "text-[#3b82f6]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> },
    { name: "Returned", bg: "bg-[#e7dff2]", iconColor: "text-[#907cb5]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { name: "Completed", bg: "bg-[#e7efdd]", iconColor: "text-[#4a7246]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> },
    { name: "Cancel", bg: "bg-[#fee2e2]", iconColor: "text-[#ef4444]", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> },
  ];

  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-32 relative overflow-y-auto mt-2">
      <div className="px-6">
        <h2 className="text-[32px] font-normal tracking-wide text-gray-900 mb-6">Order Data</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {statuses.map(s => {
            const count = MOCK_QUOTES.filter(q => q.status === s.name).length;
            return <StatusCard key={s.name} title={s.name} count={count} bgColor={s.bg} iconColor={s.iconColor} icon={s.icon} />;
          })}
        </div>
        
        <QuickActions />
      </div>
    </div>
  );
}
