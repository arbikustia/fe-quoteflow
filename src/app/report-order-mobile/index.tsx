import * as React from "react";
import { FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { MOCK_QUOTES } from "../../fixture/quotes";
import type { QuoteData } from "../../modules/order-page/OrderPage.type";
import { generateQuotePDF } from "../../utils/pdfGenerator";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
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

const MobileHeader = (): React.ReactElement => {
  const navigate = useNavigate();
  return (
    <div className="px-6 pt-10 pb-2 flex items-center justify-between sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-sm z-20">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/report-main-mobile")} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-700 shrink-0 hover:bg-gray-50 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <h3 className="text-[18px] font-bold text-[#1a233a] leading-tight">Order Report</h3>
      </div>
    </div>
  );
};

const OrderRow = ({ order, index }: { readonly order: QuoteData; readonly index: number }): React.ReactElement => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/report-order-mobile-detail/${order.id}`)} className="bg-white rounded-3xl px-5 py-4 mb-3 flex items-center shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100 transition-transform hover:scale-[1.01] cursor-pointer">
      <div className="w-10 flex items-center justify-start text-gray-500 font-bold text-[14px]">
        {index + 1}
      </div>
      <div className="flex-1 flex flex-col pr-2 min-w-0">
        <span className="font-bold text-[14px] text-gray-800 truncate">{order.name}</span>
        <span className="font-medium text-[12px] text-gray-500 truncate">{order.location}</span>
      </div>
      <div className="flex items-center justify-end gap-3">
        <div className={`rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider ${getStatusStyles(order.status || "Completed")}`}>
          {order.status || "Completed"}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            generateQuotePDF(order);
          }}
          className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#4a64b8] hover:bg-gray-100 transition-colors shrink-0"
        >
          <FiDownload className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function MobileReportOrder(): React.ReactElement {
  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-32 relative overflow-y-auto">
      
      <div className="px-6 mt-4">
        <h2 className="text-[28px] font-bold text-[#1a233a] mb-0.5">Report List</h2>
        <p className="text-[14px] text-gray-500 font-medium">Completed orders history.</p>
        
        <div className="flex items-center mt-8 mb-3 px-3 text-[11px] font-bold text-gray-400 tracking-widest uppercase">
          <div className="w-10">No</div>
          <div className="flex-1">Event Info</div>
          <div className="w-24 text-right pr-2">Status</div>
        </div>

        <div className="flex flex-col">
          {MOCK_QUOTES.filter(order => order.status === "Completed").map((order, index) => (
            <OrderRow key={order.id} order={order} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
