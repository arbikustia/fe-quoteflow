import * as React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_QUOTES } from "../../fixture/quotes";
import type { QuoteData } from "../../modules/order-page/OrderPage.type";
import { generateQuotePDF } from "../../utils/pdfGenerator";

const getStatusStyles = (status: string) => {
  if (status === "Confirmed" || status === "Completed") return "text-[#4a7246] bg-[#e7efdd]";
  if (status === "Pending Payment") return "text-[#a87b1e] bg-[#fdf2c8]";
  if (status === "Cancel") return "text-[#bd4040] bg-[#fde8e8]";
  if (status === "On Rental") return "text-[#4a64b8] bg-[#daeaf3]";
  return "text-gray-600 bg-gray-100";
};

export default function OrderMobileDetail(): React.ReactElement {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const order = MOCK_QUOTES.find(q => q.id === id) || MOCK_QUOTES[0];

  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-10 relative overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-sm z-20">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a233a] group-hover:bg-gray-50 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </div>
          <span className="font-bold text-[15px]">Back</span>
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => generateQuotePDF(order as QuoteData)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#4a7246] hover:bg-gray-50 transition-colors" title="Download PDF">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </button>
          <button onClick={() => navigate(`/order-mobile/create/${order.id}`)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#4a64b8] hover:bg-gray-50 transition-colors" title="Edit Order">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button onClick={() => setIsDeleteModalOpen(true)} className="w-10 h-10 rounded-full bg-[#fde8e8] shadow-sm flex items-center justify-center text-[#bd4040] hover:bg-red-200 transition-colors" title="Delete Order">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2v2"></path></svg>
          </button>
        </div>
      </div>

      <div className="px-6 mt-2">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight">{order.id}</h2>
            <div className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase ${getStatusStyles(order.status || "")}`}>
              {order.status}
            </div>
          </div>
          <p className="text-[14px] text-gray-500 font-medium leading-relaxed">Here are the complete details for this order.</p>
        </div>

        {/* Client & Event Info */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] mb-6">
          <div className="flex flex-col gap-5">
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Client Name</span>
              <span className="text-[15px] font-bold text-gray-800">{order.name}</span>
            </div>
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Event Location</span>
              <span className="text-[15px] font-bold text-gray-800">{order.location}</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Start Date</span>
                <span className="text-[14px] font-bold text-gray-800">{order.startDate}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">End Date</span>
                <span className="text-[14px] font-bold text-gray-800">{order.endDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Items */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] mb-8">
          <div className="flex items-center justify-between mb-5">
            <label className="block text-[12px] font-bold text-gray-400 tracking-widest uppercase">Ordered Items</label>
            <span className="text-[12px] font-bold text-[#4a64b8] bg-[#daeaf3] px-3 py-1 rounded-full">{order.qty} Items Total</span>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h4 className="text-[11px] font-bold text-[#4a7246] uppercase tracking-wider mb-3 px-1">{order.category}</h4>
              <div className="flex flex-col gap-3">
                {order.selectedItems.map((item, idx) => (
                  <div key={idx} className="flex flex-col p-4 bg-[#f8f9fb] rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[14px] font-bold text-gray-800">{item}</span>
                      <span className="text-[13px] font-bold text-[#4a64b8] bg-white px-2 py-0.5 rounded-lg border border-gray-200">Qty: 1</span>
                    </div>
                    {idx === 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-3 text-[12px] text-gray-600 font-medium">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Remark</span>
                        Please handle with care during transport.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl transform scale-100 transition-transform">
            <div className="w-16 h-16 rounded-full bg-[#fde8e8] text-[#bd4040] flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h3 className="text-[20px] font-extrabold text-gray-900 text-center mb-2">Delete Order</h3>
            <p className="text-[14px] text-gray-500 text-center mb-8 font-medium">Are you sure you want to delete this order? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 rounded-full py-3.5 text-[14px] font-bold hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={() => { setIsDeleteModalOpen(false); navigate("/order-mobile"); }} className="flex-1 bg-[#bd4040] text-white rounded-full py-3.5 text-[14px] font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
