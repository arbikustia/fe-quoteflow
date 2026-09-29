import * as React from "react";

import { MOCK_ORDER_ITEMS } from "../../../fixture/quotes";

import type { InputFieldProps, MobileOrderCreateProps } from "./MobileOrderCreate.type";

/**
 * Input field component
 * @param {InputFieldProps} props - The component props
 * @returns {React.ReactElement} The component
 */
const InputField = ({ label, type = "text", placeholder, icon, ...props }: InputFieldProps): React.ReactElement => (
  <div className="mb-5">
    <label className="block text-[12px] font-bold text-gray-400 mb-2 pl-3 tracking-widest uppercase">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={props.defaultValue}
        className="w-full bg-white border border-gray-100 rounded-3xl py-4 pl-12 pr-5 text-[15px] font-semibold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.02)] outline-none focus:border-[#daeaf3] focus:ring-4 focus:ring-[#daeaf3]/50 transition-all placeholder:text-gray-300"
      />
    </div>
  </div>
);

/**
 * Header section component
 * @param {object} props - props
 * @param {boolean} [props.isEdit] - is edit
 * @param {() => void} props.onNavigateBack - on back
 * @returns {React.ReactElement} The component
 */
const HeaderSection = (props: { isEdit?: boolean, onNavigateBack: () => void }): React.ReactElement => (
  <>
    <div className="px-6 pt-10 pb-4 flex items-center sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-sm z-20">
      <button type="button" onClick={props.onNavigateBack} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors group">
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a233a] group-hover:bg-gray-50 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>
        <span className="font-bold text-[15px]">Back</span>
      </button>
    </div>
    <div className="px-6 mt-2">
      <div className="mb-8 pl-1">
        <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight">{props.isEdit ? "Edit Request" : "New Request"}</h2>
        <p className="text-[14px] text-gray-500 mt-2 font-medium leading-relaxed">Fill in the complete event details and select the required equipment below.</p>
      </div>
    </div>
  </>
);

/**
 * Basic info section
 * @param {MobileOrderCreateProps} props - props
 * @returns {React.ReactElement} component
 */
const BasicInfoSection = (props: MobileOrderCreateProps): React.ReactElement => (
  <>
    <InputField 
      label="Client Name" 
      placeholder="e.g. Stevy Ditolla" 
      defaultValue={props.existingOrder?.name}
      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>} 
    />
    <InputField 
      label="Event Location" 
      placeholder="e.g. Grand Ballroom" 
      defaultValue={props.existingOrder?.location}
      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>} 
    />
    <div className="flex gap-4">
      <div className="flex-1">
        <InputField 
          label="Start Date" type="date" placeholder="DD MMM YYYY" defaultValue={props.existingOrder?.startDate}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>} 
        />
      </div>
      <div className="flex-1">
        <InputField 
          label="End Date" type="date" placeholder="DD MMM YYYY" defaultValue={props.existingOrder?.endDate}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>} 
        />
      </div>
    </div>
    <InputField 
      label="Discount (%)" type="number" placeholder="e.g. 10" defaultValue={props.existingOrder?.discount}
      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>} 
    />
  </>
);

/**
 * Category dropdown component
 * @param {MobileOrderCreateProps} props - props
 * @returns {React.ReactElement} The component
 */
const CategoryDropdown = ({ categoryRef, isCategoryOpen, onToggleCategoryOpen, selectedCategories, onToggleCategory }: MobileOrderCreateProps): React.ReactElement => (
  <div className="mb-6 mt-2 relative z-10" ref={categoryRef}>
    <label className="block text-[12px] font-bold text-gray-400 mb-2 pl-3 tracking-widest uppercase">Service Category</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
      </div>
      <div 
        onClick={onToggleCategoryOpen}
        className={`w-full bg-white border ${isCategoryOpen ? 'border-[#daeaf3] ring-4 ring-[#daeaf3]/50' : 'border-gray-100'} rounded-3xl py-4 pl-12 pr-10 text-[15px] font-semibold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.02)] cursor-pointer transition-all flex items-center`}
      >
        <span className="truncate">{selectedCategories.length > 0 ? selectedCategories.join(", ") : "Select category..."}</span>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      {isCategoryOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-3xl shadow-xl p-3 flex flex-col gap-1 max-h-56 overflow-y-auto">
          {Object.keys(MOCK_ORDER_ITEMS).map(cat => (
            <label key={cat} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors">
              <input 
                type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => onToggleCategory(cat)} 
                className="w-5 h-5 rounded border-gray-300 text-[#4a64b8] focus:ring-[#daeaf3]"
              />
              <span className="text-[14px] font-semibold text-gray-800">{cat}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  </div>
);

/**
 * Item row component
 * @param {MobileOrderCreateProps & { item: string, isChecked: boolean }} props - props
 * @returns {React.ReactElement} The component
 */
const ItemRow = (props: MobileOrderCreateProps & { item: string, isChecked: boolean }): React.ReactElement => {
  const { item, isChecked, itemDetails, onToggleItem, onUpdateQty, onUpdateRemark } = props;

  return (
    <div className={`flex flex-col p-3.5 rounded-2xl transition-colors ${isChecked ? 'bg-[#daeaf3]/20 border border-[#daeaf3]' : 'bg-[#f8f9fb] border border-transparent'}`}>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={isChecked} onChange={() => onToggleItem(item)} className="hidden" />
        <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${isChecked ? 'bg-[#daeaf3] text-[#4a64b8]' : 'bg-white border border-gray-200'}`}>
          {isChecked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
        </div>
        <span className="text-[14px] font-semibold text-gray-800 flex-1">{item}</span>
      </label>

      {isChecked && (
        <div className="mt-3 pt-3 border-t border-gray-200/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Quantity</span>
            <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-100 p-0.5">
              <button type="button" onClick={() => onUpdateQty(item, -1)} className="w-8 h-8 flex items-center justify-center text-[#4a64b8] bg-[#daeaf3]/30 hover:bg-[#daeaf3]/60 rounded-lg font-bold text-lg leading-none transition-colors">-</button>
              <span className="w-10 text-center text-[14px] font-bold text-gray-800">{itemDetails[item]?.qty || 1}</span>
              <button type="button" onClick={() => onUpdateQty(item, 1)} className="w-8 h-8 flex items-center justify-center text-[#4a64b8] bg-[#daeaf3]/30 hover:bg-[#daeaf3]/60 rounded-lg font-bold text-lg leading-none transition-colors">+</button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <input type="text" placeholder="Add remark..." value={itemDetails[item]?.remark || ""} onChange={(e) => onUpdateRemark(item, e.target.value)} className="w-full bg-white border border-gray-100 rounded-xl px-3 pl-9 py-2.5 text-[13px] font-medium text-gray-700 shadow-sm focus:outline-none focus:border-[#daeaf3] placeholder:text-gray-300 transition-colors" />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Category items section component
 * @param {MobileOrderCreateProps} props - props
 * @returns {React.ReactElement | null} The component
 */
const CategoryItemsSection = (props: MobileOrderCreateProps): React.ReactElement | null => {
  if (props.selectedCategories.length === 0) return null;

  return (
    <div className="mb-8 flex flex-col gap-4">
      <label className="block text-[12px] font-bold text-gray-400 mb-1 pl-3 tracking-widest uppercase">Select Items</label>
      {props.selectedCategories.map(cat => (
        <div key={cat} className="bg-white border border-gray-100 rounded-4xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
          <div className="relative mb-5 border-b border-gray-100 pb-5">
            <div className="absolute left-3 top-[calc(50%-10px)] -translate-y-1/2 text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <input 
              type="text" placeholder={`Remark for ${cat}...`} value={props.categoryRemarks[cat] || ""}
              onChange={(e) => props.onUpdateCategoryRemark(cat, e.target.value)}
              className="w-full bg-[#f8f9fb] border border-transparent rounded-xl px-3 pl-9 py-2.5 text-[13px] font-medium text-gray-700 shadow-sm focus:outline-none focus:border-[#daeaf3] placeholder:text-gray-400 transition-colors" 
            />
          </div>
          <h4 className="text-[11px] font-bold text-[#4a64b8] uppercase tracking-wider mb-4 px-1">{cat}</h4>
          <div className="flex flex-col gap-2">
            {MOCK_ORDER_ITEMS[cat].map(item => (
              <ItemRow key={item} item={item} isChecked={props.selectedItems.includes(item)} {...props} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * MobileOrderCreate Component
 * @param {MobileOrderCreateProps} props - component props
 * @returns {React.ReactElement} component
 */
export const MobileOrderCreateComponent = (props: MobileOrderCreateProps): React.ReactElement => (
  <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-10 relative overflow-y-auto">
    <HeaderSection isEdit={props.isEdit} onNavigateBack={props.onNavigateBack} />
    <div className="px-6">
      <form onSubmit={props.onSubmit} className="flex flex-col">
        <BasicInfoSection {...props} />
        <CategoryDropdown {...props} />
        <CategoryItemsSection {...props} />
        <button type="submit" className="w-full bg-[#1a233a] text-white rounded-full py-4.5 text-[16px] font-bold tracking-wide shadow-[0_10px_20px_rgba(26,35,58,0.15)] hover:bg-black transition-all transform hover:-translate-y-0.5 mt-2">
          {props.isEdit ? "Update Order" : "Create Order"}
        </button>
      </form>
    </div>
  </div>
);
