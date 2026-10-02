import * as React from "react";
import { FiDownload } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_QUOTES } from "../../../fixture/quotes";
import { generateQuotePDF } from "../../../utils/pdfGenerator";



export default function MobileReportOrderDetail(): React.ReactElement {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const order = MOCK_QUOTES.find(q => q.id === id);

  if (!order) {
    return (
      <div className="flex-1 w-full min-h-full bg-[#f8f9fb] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Report not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans relative overflow-y-auto">
      <div className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-sm z-20">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a233a] group-hover:bg-gray-50 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </div>
          <span className="font-bold text-[15px]">Back</span>
        </button>
        <button 
          onClick={() => generateQuotePDF(order)}
          className="px-5 py-2.5 bg-[#4a64b8] text-white font-bold text-[13px] rounded-full hover:bg-blue-800 transition-colors flex items-center gap-2"
        >
          <FiDownload className="w-4 h-4" /> Download PDF
        </button>
      </div>

      <div className="px-6 mt-4 pb-24">
        <div className="bg-white rounded-[2rem] p-6 mb-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#e8eaf6] text-[#4a64b8] flex items-center justify-center mb-4 border-4 border-white shadow-md">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          </div>
          <h2 className="text-[24px] font-extrabold text-gray-900 leading-none mb-2 text-center">{order.name}</h2>
          <div className="mt-2 rounded-full px-4 py-1.5 text-[12px] font-bold tracking-wider uppercase text-white bg-[#4a64b8]">
            {order.status || "Completed"}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100">
          <h3 className="text-[14px] font-bold text-gray-400 tracking-widest uppercase mb-6">Report Details</h3>
          
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">Order ID</span>
              <p className="font-semibold text-gray-800 text-[15px]">{order.id}</p>
            </div>
            <div className="w-full h-px bg-gray-100"></div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">Event Location</span>
              <p className="font-semibold text-gray-800 text-[15px]">{order.location}</p>
            </div>
            <div className="w-full h-px bg-gray-100"></div>
            <div className="flex gap-4">
              <div className="flex-1">
                <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">Start Date</span>
                <p className="font-semibold text-gray-800 text-[15px]">{order.startDate}</p>
              </div>
              <div className="flex-1 border-l border-gray-100 pl-4">
                <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">End Date</span>
                <p className="font-semibold text-gray-800 text-[15px]">{order.endDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
