import * as React from "react";
import { FiArrowLeft } from "react-icons/fi";

import type { DesktopOrderCreateProps } from "./DesktopOrderCreate.type";
import Layout from "../../../app/layout";
import { MOCK_ORDER_ITEMS } from "../../../fixture/quotes";

/**
 * Event Details Section
 * @returns {React.ReactElement} node
 */
const EventDetailsSection = (): React.ReactElement => (
  <div className="bg-brand-white p-6 rounded-2xl border border-brand-gray-light shadow-sm space-y-6">
    <h3 className="text-lg font-bold text-brand-text-dark border-b border-brand-gray-light pb-3">Event Details</h3>
    <div>
      <label className="block text-sm font-bold text-brand-text-dark mb-2">Name</label>
      <input type="text" required className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" placeholder="Enter name" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-bold text-brand-text-dark mb-2">Start Date</label>
        <input type="date" required className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" />
      </div>
      <div>
        <label className="block text-sm font-bold text-brand-text-dark mb-2">End Date</label>
        <input type="date" required className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" />
      </div>
    </div>
    <EventDetailsSecondarySection />
  </div>
);

/**
 * Event Details Secondary Section
 * @returns {React.ReactElement} node
 */
const EventDetailsSecondarySection = (): React.ReactElement => (
  <>
    <div>
      <label className="block text-sm font-bold text-brand-text-dark mb-2">Location</label>
      <input type="text" required className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" placeholder="Enter location" />
    </div>
    <div>
      <label className="block text-sm font-bold text-brand-text-dark mb-2">Remark</label>
      <textarea className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark min-h-[100px]" placeholder="Additional notes..." />
    </div>
    <EventDetailsFinancialSection />
  </>
);

/**
 * Event Details Financial Section
 * @returns {React.ReactElement} node
 */
const EventDetailsFinancialSection = (): React.ReactElement => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-brand-gray-light pt-6">
    <div>
      <label className="block text-sm font-bold text-brand-text-dark mb-2">Qty</label>
      <input type="number" required min="1" className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" placeholder="Qty" />
    </div>
    <div>
      <label className="block text-sm font-bold text-brand-text-dark mb-2">PPh (%)</label>
      <input type="number" min="0" max="100" className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" placeholder="Tax %" />
    </div>
    <div>
      <label className="block text-sm font-bold text-brand-text-dark mb-2">Discount</label>
      <input type="number" min="0" className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" placeholder="Rp" />
    </div>
  </div>
);

/**
 * Category Dropdown
 * @param {DesktopOrderCreateProps} props - props
 * @returns {React.ReactElement} node
 */
const CategoryDropdown = ({ categoryDropdownRef, setIsCategoryDropdownOpen, isCategoryDropdownOpen, selectedCategories, toggleCategory }: DesktopOrderCreateProps): React.ReactElement => (
  <div className="relative" ref={categoryDropdownRef}>
    <label className="block text-sm font-bold text-brand-text-dark mb-2">Category</label>
    <div onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark cursor-pointer flex justify-between items-center">
      <span className="truncate">{selectedCategories.length > 0 ? selectedCategories.join(", ") : "Select Categories"}</span>
      <span className="text-brand-text-medium text-xs">▼</span>
    </div>
    {isCategoryDropdownOpen && (
      <div className="absolute z-10 mt-2 w-full bg-brand-white border border-brand-gray-light rounded-xl shadow-lg max-h-60 overflow-y-auto py-2">
        {Object.keys(MOCK_ORDER_ITEMS).map((cat) => (
          <label key={cat} className="flex items-center px-4 py-3 cursor-pointer hover:bg-brand-gray-light transition-colors">
            <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} className="w-4 h-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue cursor-pointer" />
            <span className="ml-3 text-sm font-medium text-brand-text-dark">{cat}</span>
          </label>
        ))}
      </div>
    )}
  </div>
);

/**
 * Item Checkbox
 * @param {object} p - props
 * @param {string} p.item - item
 * @param {boolean} p.checked - checked
 * @param {() => void} p.onChange - onchange
 * @returns {React.ReactElement} node
 */
const ItemCheckbox = ({ item, checked, onChange }: { item: string, checked: boolean, onChange: () => void }): React.ReactElement => (
  <label className="flex items-center gap-3 cursor-pointer p-3 bg-brand-white rounded-lg border border-brand-gray-light hover:border-indigo-300 hover:shadow-sm transition-all">
    <input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue cursor-pointer" />
    <span className="text-sm font-medium text-brand-text-dark flex-1">{item}</span>
  </label>
);

/**
 * Category Items List
 * @param {DesktopOrderCreateProps} props - props
 * @returns {React.ReactElement} node
 */
const CategoryItemsList = ({ selectedCategories, itemSearchQuery, selectedItems, toggleItem }: DesktopOrderCreateProps): React.ReactElement => (
  <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 flex-1 min-h-0">
    {selectedCategories.map((cat) => {
      const items = MOCK_ORDER_ITEMS[cat as keyof typeof MOCK_ORDER_ITEMS] || [];
      const filteredItems = items.filter((item: string) => item.toLowerCase().includes(itemSearchQuery.toLowerCase()));
      
      if (filteredItems.length === 0) return null;
      
      return (
        <div key={cat} className="space-y-2">
          <h4 className="text-xs font-bold text-brand-blue uppercase tracking-wider">{cat}</h4>
          <div className="grid grid-cols-1 gap-2">
            {filteredItems.map((item: string) => (
              <ItemCheckbox key={item} item={item} checked={selectedItems.includes(item)} onChange={() => toggleItem(item)} />
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

/**
 * Item Search
 * @param {DesktopOrderCreateProps} props - props
 * @returns {React.ReactElement} node
 */
const ItemSearch = ({ itemSearchQuery, setItemSearchQuery }: DesktopOrderCreateProps): React.ReactElement => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
    <label className="block text-sm font-bold text-indigo-900">Select Items</label>
    <div className="relative">
      <input type="text" placeholder="Search items..." value={itemSearchQuery} onChange={(e) => setItemSearchQuery(e.target.value)} className="pl-9 pr-8 py-1.5 text-sm rounded-lg border border-brand-blue-light focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-brand-text-dark w-full sm:w-48 bg-brand-white" />
      {itemSearchQuery && (
        <button type="button" onClick={() => setItemSearchQuery("")} className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-brand-text-medium hover:text-brand-text-medium focus:outline-none cursor-pointer">
          ✕
        </button>
      )}
    </div>
  </div>
);

/**
 * Order Items Section
 * @param {DesktopOrderCreateProps} props - props
 * @returns {React.ReactElement} node
 */
const OrderItemsSection = (props: DesktopOrderCreateProps): React.ReactElement => (
  <div className="relative flex flex-col lg:block">
    <div className="lg:absolute lg:inset-0 bg-brand-white p-6 h-full rounded-2xl border border-brand-gray-light shadow-sm flex flex-col gap-6">
      <h3 className="text-lg font-bold text-brand-text-dark border-b border-brand-gray-light pb-3">Order Items & Pricing</h3>
      <CategoryDropdown {...props} />
      {props.selectedCategories.length > 0 && (
        <div className="bg-brand-blue-light/50 p-5 rounded-xl border border-brand-blue-light flex-1 flex flex-col min-h-0">
          <ItemSearch {...props} />
          <CategoryItemsList {...props} />
        </div>
      )}
    </div>
  </div>
);

/**
 * Form Actions
 * @param {DesktopOrderCreateProps} props - props
 * @returns {React.ReactElement} node
 */
const FormActions = ({ isEditing, onCancel }: DesktopOrderCreateProps): React.ReactElement => (
  <div className="pt-6 flex justify-end gap-4 mt-4 border-t border-brand-gray-light">
    <button type="button" onClick={onCancel} className="px-6 py-2.5 text-sm font-bold text-brand-text-medium bg-brand-white border border-gray-300 hover:bg-brand-gray-light rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gray-light cursor-pointer">Cancel</button>
    <button type="submit" className="px-8 py-2.5 text-sm font-bold text-brand-white bg-brand-blue hover:bg-brand-blue-dark rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-1 cursor-pointer">{isEditing ? "Save Changes" : "Create Order"}</button>
  </div>
);

/**
 * Page Header
 * @param {DesktopOrderCreateProps} props - props
 * @returns {React.ReactElement} node
 */
const PageHeader = ({ isEditing, onCancel }: DesktopOrderCreateProps): React.ReactElement => (
  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-brand-gray-light">
    <button type="button" onClick={onCancel} className="p-2 rounded-xl text-brand-text-medium hover:text-brand-text-dark hover:bg-brand-gray-light transition-all focus:outline-none cursor-pointer"><FiArrowLeft className="w-5 h-5" /></button>
    <h2 className="text-xl font-bold text-brand-text-dark">{isEditing ? "Edit Order" : "Create New Order"}</h2>
  </div>
);

/**
 * Order Page Create Component
 * @param {DesktopOrderCreateProps} props - props
 * @returns {React.ReactElement} node
 */
export const DesktopOrderCreateComponent = (props: DesktopOrderCreateProps): React.ReactElement => (
  <Layout pageTitle={props.isEditing ? "Edit Order" : "Create New Order"}>
    <div className="bg-brand-white/80 backdrop-blur-xl border border-brand-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] min-h-[calc(100vh-10rem)] flex flex-col">
      <PageHeader {...props} />
      <form className="w-full flex flex-col gap-6" onSubmit={props.onSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventDetailsSection />
          <OrderItemsSection {...props} />
        </div>
        <FormActions {...props} />
      </form>
    </div>
  </Layout>
);

export default DesktopOrderCreateComponent;
