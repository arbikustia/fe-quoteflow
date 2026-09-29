import * as React from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_ITEMS } from "../../fixture/master-item";
import type { ItemData } from "../../modules/master-item/MasterItem.type";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
};

const MobileHeader = (): React.ReactElement => {
  const navigate = useNavigate();
  return (
    <div className="px-6 pt-10 pb-2 flex items-center justify-between sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-sm z-20">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/master-main-mobile")} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-700 shrink-0 hover:bg-gray-50 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <h3 className="text-[18px] font-bold text-[#1a233a] leading-tight">Master Item</h3>
      </div>
      <button onClick={() => navigate("/master-item-mobile-create")} className="w-10 h-10 rounded-full bg-[#1a233a] shadow-md flex items-center justify-center text-white shrink-0 hover:bg-black transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </div>
  );
};

const ItemRow = ({ item, index }: { readonly item: ItemData; readonly index: number }): React.ReactElement => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/master-item-mobile-detail/${item.id}`)} className="bg-white rounded-3xl px-5 py-4 mb-3 flex items-center shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100 transition-transform hover:scale-[1.01] cursor-pointer">
      <div className="w-10 flex items-center justify-start text-gray-500 font-bold text-[14px]">
        {index + 1}
      </div>
      <div className="flex-1 flex flex-col pr-2 min-w-0">
        <span className="font-bold text-[14px] text-gray-800 truncate">{item.name}</span>
        <span className="font-medium text-[12px] text-gray-500 truncate">{item.category}</span>
      </div>
      <div className="w-1/3 flex flex-col items-end">
        <span className="font-bold text-[12px] text-gray-800 whitespace-nowrap">{formatPrice(item.price)}</span>
        <span className="font-medium text-[10px] text-gray-500">per {item.unit}</span>
      </div>
    </div>
  );
};

export default function MasterItemMobile(): React.ReactElement {
  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-32 relative overflow-y-auto">
      
      <div className="px-6 mt-4">
        <h2 className="text-[28px] font-bold text-[#1a233a] mb-0.5">Item List</h2>
        <p className="text-[14px] text-gray-500 font-medium">Manage your products and items.</p>
        
        <div className="flex items-center mt-8 mb-3 px-3 text-[11px] font-bold text-gray-400 tracking-widest uppercase">
          <div className="w-10">No</div>
          <div className="flex-1">Item Info</div>
          <div className="w-1/3 text-right pr-2">Price</div>
        </div>

        <div className="flex flex-col">
          {MOCK_ITEMS.map((item, index) => (
            <ItemRow key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
