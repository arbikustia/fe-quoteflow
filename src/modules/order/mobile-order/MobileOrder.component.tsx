import * as React from "react";

import type { QuoteData } from "../desktop-order/DesktopOrder.type";

import type { MobileOrderProps } from "./MobileOrder.type";

/**
 * Format a date string
 * @param {string} dateStr - The date string to format
 * @returns {string} The formatted date
 */
const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}-${month}-${year}`;
};

/**
 * Get CSS styles for a given status
 * @param {string} status - The order status
 * @returns {string} The CSS classes for the status
 */
const getStatusStyles = (status: string): string => {
  if (status === "Pending Payment") return "bg-[#fdf2c8] text-[#a87b1e]";
  
  if (status === "Confirmed") return "bg-[#d7e6c3] text-[#4a7246]";

  if (status === "On Rental") return "bg-[#daeaf3] text-[#3b82f6]";
  
  if (status === "Returned") return "bg-[#e7dff2] text-[#907cb5]";
  
  if (status === "Completed") return "bg-[#e7efdd] text-[#4a7246]";
  
  if (status === "Cancel") return "bg-[#fee2e2] text-[#ef4444]";
  
  return "bg-gray-100 text-gray-600";
};

/**
 * Order Row Component
 * @param {{ readonly quote: QuoteData, readonly onNavigate: (path: string) => void }} props - props
 * @returns {React.ReactElement} node
 */
const OrderRow = ({ quote, onNavigate }: { readonly quote: QuoteData; readonly onNavigate: (path: string) => void }): React.ReactElement => {
  return (
    <div onClick={() => onNavigate(`/order/detail/${quote.id}`)} className="bg-white rounded-3xl px-5 py-4 mb-3 flex items-center shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100 transition-transform hover:scale-[1.01] cursor-pointer">
      <div className="w-1/2 flex flex-col">
        <span className="font-bold text-[13px] text-gray-800 truncate pr-2">{quote.name}</span>
        <span className="font-medium text-[11px] text-gray-500 truncate pr-2">{quote.location}</span>
      </div>
      <div className="w-1/4 font-semibold text-[12px] text-gray-600 text-center">{formatDate(quote.startDate)}</div>
      <div className="w-1/4 flex justify-end">
        <div className={`rounded-full px-2.5 py-1 text-[9px] font-bold tracking-wider ${getStatusStyles(quote.status)}`}>
          {quote.status}
        </div>
      </div>
    </div>
  );
};

/**
 * MobileOrder Component
 * @param {MobileOrderProps} props - component props
 * @returns {React.ReactElement} component
 */
export const MobileOrderComponent = (props: MobileOrderProps): React.ReactElement => {
  const { quotes, onNavigate } = props;
  
  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-32 relative overflow-y-auto">
      <div className="px-6 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[28px] font-bold text-[#1a233a] mb-0.5">Order History</h2>
            <p className="text-[14px] text-gray-500 font-medium">Your recent orders.</p>
          </div>
          <button 
            onClick={() => onNavigate('/order/create')}
            className="w-12 h-12 bg-[#2b2d30] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
        
        <div className="flex items-center mt-8 mb-3 px-3 text-[11px] font-bold text-gray-400 tracking-widest uppercase">
          <div className="w-1/2">Event Info</div>
          <div className="w-1/4 text-center">Date</div>
          <div className="w-1/4 text-right pr-2">Status</div>
        </div>

        <div className="flex flex-col">
          {quotes
            .filter(quote => ["On Rental", "Confirmed", "Pending Payment"].includes(quote.status))
            .map((quote) => (
              <OrderRow key={quote.id} quote={quote} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
};
