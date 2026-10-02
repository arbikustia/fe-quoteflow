import * as React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_ITEMS } from "../../../fixture/master-item";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
};

export default function MasterItemMobileDetail(): React.ReactElement {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showConfirm, setShowConfirm] = useState(false);
  
  const item = MOCK_ITEMS.find(i => i.id === id);

  if (!item) {
    return (
      <div className="flex-1 w-full min-h-full bg-[#f8f9fb] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Item not found</p>
      </div>
    );
  }

  const handleDelete = () => {
    setShowConfirm(false);
    navigate("/master-item");
  };

  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans relative overflow-y-auto">
      <div className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-sm z-20">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a233a] group-hover:bg-gray-50 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </div>
          <span className="font-bold text-[15px]">Back</span>
        </button>
        <button onClick={() => navigate(`/master-item/create/${item.id}`)} className="px-5 py-2.5 bg-[#f4e482] text-[#eab308] font-bold text-[13px] rounded-full hover:bg-[#eade6d] transition-colors">
          Edit Item
        </button>
      </div>

      <div className="px-6 mt-4 pb-24">
        <div className="bg-white rounded-[2rem] p-6 mb-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#f4e482] text-[#eab308] flex items-center justify-center mb-4 border-4 border-white shadow-md">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          </div>
          <h2 className="text-[24px] font-extrabold text-gray-900 leading-none mb-2 text-center">{item.name}</h2>
          <div className="mt-2 rounded-full px-4 py-1.5 text-[12px] font-bold tracking-wider uppercase text-[#eab308] bg-[#f4e482]">
            {item.category}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100">
          <h3 className="text-[14px] font-bold text-gray-400 tracking-widest uppercase mb-6">Item Details</h3>
          
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">Item ID</span>
              <p className="font-semibold text-gray-800 text-[15px]">{item.id}</p>
            </div>
            <div className="w-full h-px bg-gray-100"></div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">Price</span>
              <p className="font-semibold text-gray-800 text-[15px]">{formatPrice(item.price)}</p>
            </div>
            <div className="w-full h-px bg-gray-100"></div>
            <div className="flex gap-4">
              <div className="flex-1">
                <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">Unit</span>
                <p className="font-semibold text-gray-800 text-[15px]">{item.unit}</p>
              </div>
              <div className="flex-1 border-l border-gray-100 pl-4">
                <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">Stock</span>
                <p className="font-semibold text-gray-800 text-[15px]">Available</p>
              </div>
            </div>
            <div className="w-full h-px bg-gray-100"></div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">Remarks</span>
              <p className="font-semibold text-gray-800 text-[15px]">{item.remark || "-"}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowConfirm(true)}
          className="w-full mt-8 bg-[#fde8e8] text-[#bd4040] rounded-full py-4 text-[16px] font-bold tracking-wide shadow-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Delete Item
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-[#fde8e8] rounded-full flex items-center justify-center mb-4 mx-auto text-[#bd4040]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h3 className="text-[22px] font-bold text-center text-gray-900 mb-2">Delete Item?</h3>
            <p className="text-[14px] text-gray-500 text-center mb-8 font-medium">Are you sure you want to delete <span className="text-gray-900 font-bold">{item.name}</span>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-3.5 bg-[#bd4040] text-white font-bold rounded-2xl hover:bg-red-700 transition-colors shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
