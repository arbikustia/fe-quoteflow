import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_CUSTOMERS } from "../../../fixture/master-customer";

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

type InputFieldProps = { label: string; placeholder?: string; defaultValue?: string; required?: boolean; icon?: React.ReactNode; type?: string; multiline?: boolean; };

const InputField = ({ label, placeholder, defaultValue, required, icon, type = "text", multiline }: InputFieldProps): React.ReactElement => (
  <div className="mb-5">
    <label className="block text-[12px] font-bold text-gray-400 mb-2 pl-3 tracking-widest uppercase">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
      {multiline ? (
        <textarea placeholder={placeholder} defaultValue={defaultValue} required={required} rows={3} className="w-full bg-white border border-gray-100 rounded-3xl py-4 pl-12 pr-5 text-[15px] font-semibold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.02)] outline-none focus:border-[#daeaf3] focus:ring-4 focus:ring-[#daeaf3]/50 transition-all placeholder:text-gray-300 resize-none" />
      ) : (
        <input type={type} placeholder={placeholder} defaultValue={defaultValue} required={required} className="w-full bg-white border border-gray-100 rounded-3xl py-4 pl-12 pr-5 text-[15px] font-semibold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.02)] outline-none focus:border-[#daeaf3] focus:ring-4 focus:ring-[#daeaf3]/50 transition-all placeholder:text-gray-300" />
      )}
    </div>
  </div>
);

export default function MasterCustomerCreate(): React.ReactElement {
  const navigate = useNavigate();
  const { id } = useParams();
  const existing = id ? MOCK_CUSTOMERS.find((c) => c.id === id) : null;
  const isEdit = !!existing;
  const handleSubmit = (e: React.SyntheticEvent): void => { e.preventDefault(); navigate("/master-customer"); };
  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-10 relative overflow-y-auto">
      <FormHeader />
      <div className="px-6 mt-2">
        <div className="mb-8 pl-1">
          <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight">{isEdit ? "Edit Customer" : "New Customer"}</h2>
          <p className="text-[14px] text-gray-500 mt-2 font-medium">Fill in the customer details below.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <InputField label="Customer Name" placeholder="e.g. PT Mega Jaya Abadi" defaultValue={existing?.name} required icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
          <InputField label="Phone Number" placeholder="0812..." defaultValue={existing?.phoneNumber} required icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5 4.18 2 2 0 0 1 7 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L11.09 10a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>} />
          <InputField label="Address" placeholder="e.g. Jl. Sudirman No. 45" defaultValue={existing?.address} required multiline icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>} />
          <button type="submit" className="w-full bg-[#1a233a] text-white rounded-full py-4 text-[16px] font-bold tracking-wide shadow-[0_10px_20px_rgba(26,35,58,0.15)] hover:bg-black transition-all mt-2">{isEdit ? "Update Customer" : "Create Customer"}</button>
        </form>
      </div>
    </div>
  );
}
