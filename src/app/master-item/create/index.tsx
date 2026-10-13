import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCategorySelectOptions } from "../../../modules/master-category/MasterCategory.hook";
import { useMasterItemCreate, useMasterItemNavigation } from "../../../modules/master-item/MasterItem.hook";

const FormHeader = (): React.ReactElement => {
  const navigate = useNavigate();

  return (
    <div className="px-6 pt-10 pb-4 flex items-center sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-sm z-20">
      <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors group">
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a233a] group-hover:bg-gray-50 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>
        <span className="font-bold text-[15px]">Back</span>
      </button>
    </div>
  );
};

type TextInputProps = {
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly required?: boolean;
  readonly icon: React.ReactNode;
  readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type NumberInputProps = {
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly required?: boolean;
  readonly icon: React.ReactNode;
  readonly min?: number;
  readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const _renderTextInput = (props: TextInputProps): React.ReactElement => (
  <div className="mb-5">
    <label className="block text-[12px] font-bold text-gray-400 mb-2 pl-3 tracking-widest uppercase">{props.label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{props.icon}</div>
      <input
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        required={props.required}
        onChange={props.onChange}
        className="w-full bg-white border border-gray-100 rounded-3xl py-4 pl-12 pr-5 text-[15px] font-semibold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.02)] outline-none focus:border-[#daeaf3] focus:ring-4 focus:ring-[#daeaf3]/50 transition-all placeholder:text-gray-300"
      />
    </div>
  </div>
);

const _renderNumberInput = (props: NumberInputProps): React.ReactElement => (
  <div className="mb-5">
    <label className="block text-[12px] font-bold text-gray-400 mb-2 pl-3 tracking-widest uppercase">{props.label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{props.icon}</div>
      <input
        type="number"
        placeholder={props.placeholder}
        value={props.value}
        required={props.required}
        min={props.min}
        onChange={props.onChange}
        className="w-full bg-white border border-gray-100 rounded-3xl py-4 pl-12 pr-5 text-[15px] font-semibold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.02)] outline-none focus:border-[#daeaf3] focus:ring-4 focus:ring-[#daeaf3]/50 transition-all placeholder:text-gray-300"
      />
    </div>
  </div>
);

export default function MasterItemMobileCreate(): React.ReactElement {
  const { goBack } = useMasterItemNavigation();
  const { createItem, isCreating } = useMasterItemCreate();
  const { categories, isLoading: isCategoryLoading, errorMessage: categoryError } = useCategorySelectOptions();

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [duration, setDuration] = useState("");
  const [remark, setRemark] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => setName(e.target.value);
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => setCategoryId(e.target.value);
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => setPrice(e.target.value);
  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>): void => setStock(e.target.value);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => setImage(e.target.value);
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>): void => setDuration(e.target.value);
  const handleRemarkChange = (e: React.ChangeEvent<HTMLInputElement>): void => setRemark(e.target.value);

  const handleSubmit = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setSubmitError(null);

    try {
      const response = await createItem({
        name,
        category_id: categoryId,
        price: Number(price),
        stock: Number(stock),
        image,
        duration: Number(duration),
        remark,
      });

      if (!response.status) {
        const message = Array.isArray(response.messages)
          ? response.messages.join(" ")
          : (response.messages ?? "Failed to create item.");
        setSubmitError(message);

        return;
      }

      goBack();
    } catch {
      setSubmitError("Unable to create item. Please try again.");
    }
  };

  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-10 relative overflow-y-auto">
      <FormHeader />

      <div className="px-6 mt-2">
        <div className="mb-8 pl-1">
          <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight">New Item</h2>
          <p className="text-[14px] text-gray-500 mt-2 font-medium leading-relaxed">Fill in the item details below.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {_renderTextInput({
            label: "Item Name",
            placeholder: "e.g. Line Array Speaker",
            value: name,
            required: true,
            onChange: handleNameChange,
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>,
          })}

          <div className="mb-5 relative z-10">
            <label className="block text-[12px] font-bold text-gray-400 mb-2 pl-3 tracking-widest uppercase">Category</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h16"></path><path d="M4 15h16"></path><path d="M10 3L8 21"></path><path d="M16 3l-2 18"></path></svg>
              </div>
              <select
                value={categoryId}
                onChange={handleCategoryChange}
                required
                disabled={isCategoryLoading}
                className="w-full bg-white border border-gray-100 rounded-3xl py-4 pl-12 pr-10 text-[15px] font-semibold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.02)] outline-none focus:border-[#daeaf3] focus:ring-4 focus:ring-[#daeaf3]/50 transition-all appearance-none disabled:opacity-60"
              >
                <option value="" disabled>
                  {isCategoryLoading ? "Loading categories..." : "Select a category..."}
                </option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.category_name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
            {categoryError !== null && (
              <p className="mt-2 pl-3 text-[12px] text-red-500 font-medium">{categoryError}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              {_renderNumberInput({
                label: "Price (IDR)",
                placeholder: "e.g. 5000000",
                value: price,
                required: true,
                min: 0,
                onChange: handlePriceChange,
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
              })}
            </div>
            <div className="w-1/3">
              {_renderNumberInput({
                label: "Stock",
                placeholder: "e.g. 10",
                value: stock,
                required: true,
                min: 0,
                onChange: handleStockChange,
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>,
              })}
            </div>
          </div>

          {_renderNumberInput({
            label: "Duration (days)",
            placeholder: "e.g. 30",
            value: duration,
            required: true,
            min: 0,
            onChange: handleDurationChange,
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
          })}

          {_renderTextInput({
            label: "Image URL (Optional)",
            placeholder: "e.g. https://example.com/image.png",
            value: image,
            onChange: handleImageChange,
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
          })}

          {_renderTextInput({
            label: "Remarks (Optional)",
            placeholder: "e.g. High quality sound",
            value: remark,
            onChange: handleRemarkChange,
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
          })}

          {submitError !== null && (
            <p className="mb-4 pl-3 text-[13px] text-red-500 font-medium">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={isCreating}
            className="w-full bg-[#1a233a] text-white rounded-full py-4 text-[16px] font-bold tracking-wide shadow-[0_10px_20px_rgba(26,35,58,0.15)] hover:bg-black transition-all transform hover:-translate-y-0.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating..." : "Create Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
