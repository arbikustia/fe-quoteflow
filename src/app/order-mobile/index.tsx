import * as React from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_QUOTES } from "../../fixture/quotes";
import type { QuoteData } from "../../modules/order-page/OrderPage.type";

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const getStatusStyles = (status: string) => {
  if (status === "Pending Payment") return "bg-[#fdf2c8] text-[#a87b1e]";
  if (status === "Confirmed") return "bg-[#d7e6c3] text-[#4a7246]";
  if (status === "On Rental") return "bg-[#daeaf3] text-[#3b82f6]";
  if (status === "Returned") return "bg-[#e7dff2] text-[#907cb5]";
  if (status === "Completed") return "bg-[#e7efdd] text-[#4a7246]";
  if (status === "Cancel") return "bg-[#fee2e2] text-[#ef4444]";
  return "bg-gray-100 text-gray-600";
};

const getShortStatus = (status: string) => {
  return status;
};

/**
 * Mobile Header Component
 * @returns {React.ReactElement} node
 */
const MobileHeader = (): React.ReactElement => {
  const navigate = useNavigate();
  return (
    <div className="px-6 pt-10 pb-2 flex items-center justify-between sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-sm z-20">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#e3ebf3] flex items-center justify-center text-[#1a233a] font-bold text-lg shrink-0">
          SD
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] text-gray-500 font-medium">Good morning,</span>
          <h3 className="text-[16px] font-bold text-[#1a233a] leading-tight">Superadmin</h3>
        </div>
      </div>
      <button onClick={() => navigate("/order-mobile/create")} className="w-11 h-11 rounded-full bg-[#1a233a] shadow-md flex items-center justify-center text-white shrink-0 hover:bg-black transition-colors">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </div>
  );
};

/**
 * Order Row Component
 * @param {{ readonly quote: QuoteData, readonly index: number }} props - props
 * @returns {React.ReactElement} node
 */
const OrderRow = ({ quote }: { readonly quote: QuoteData }): React.ReactElement => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/order-mobile/detail/${quote.id}`)} className="bg-white rounded-3xl px-5 py-4 mb-3 flex items-center shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100 transition-transform hover:scale-[1.01] cursor-pointer">
      <div className="w-1/2 flex flex-col">
        <span className="font-bold text-[13px] text-gray-800 truncate pr-2">{quote.name}</span>
        <span className="font-medium text-[11px] text-gray-500 truncate pr-2">{quote.location}</span>
      </div>
      <div className="w-1/4 font-semibold text-[12px] text-gray-600 text-center">{formatDate(quote.startDate)}</div>
      <div className="w-1/4 flex justify-end">
        <div className={`rounded-full px-2.5 py-1 text-[9px] font-bold tracking-wider ${getStatusStyles(quote.status)}`}>
          {getShortStatus(quote.status)}
        </div>
      </div>
    </div>
  );
};



/**
 * Mobile Order List View Component
 * @returns {React.ReactElement} node
 */
export default function OrderMobile(): React.ReactElement {
  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-32 relative overflow-y-auto">
      
      <div className="px-6 mt-4">
        <h2 className="text-[28px] font-bold text-[#1a233a] mb-0.5">Order History</h2>
        <p className="text-[14px] text-gray-500 font-medium">Your recent orders.</p>
        
        <div className="flex items-center mt-8 mb-3 px-3 text-[11px] font-bold text-gray-400 tracking-widest uppercase">
          <div className="w-1/2">Event Info</div>
          <div className="w-1/4 text-center">Date</div>
          <div className="w-1/4 text-right pr-2">Status</div>
        </div>

        <div className="flex flex-col">
          {MOCK_QUOTES
            .filter(quote => ["On Rental", "Confirmed", "Pending Payment"].includes(quote.status))
            .map((quote) => (
              <OrderRow key={quote.id} quote={quote} />
          ))}
        </div>
      </div>
    </div>
  );
}
