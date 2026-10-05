import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_PAYMENT_METHODS } from "../../../fixture/master-payment-method";

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

type InputFieldProps = { label: string; placeholder?: string; defaultValue?: string; required?: boolean; icon?: React.ReactNode; multiline?: boolean; };

const InputField = ({ label, placeholder, defaultValue, required, icon, multiline }: InputFieldProps): React.ReactElement => (
  <div className="mb-5">
    <label className="block text-[12px] font-bold text-gray-400 mb-2 pl-3 tracking-widest uppercase">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
      {multiline ? (
        <textarea placeholder={placeholder} defaultValue={defaultValue} required={required} rows={3} className="w-full bg-white border border-gray-100 rounded-3xl py-4 pl-12 pr-5 text-[15px] font-semibold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.02)] outline-none focus:border-[#daeaf3] focus:ring-4 focus:ring-[#daeaf3]/50 transition-all placeholder:text-gray-300 resize-none" />
      ) : (
        <input type="text" placeholder={placeholder} defaultValue={defaultValue} required={required} className="w-full bg-white border border-gray-100 rounded-3xl py-4 pl-12 pr-5 text-[15px] font-semibold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.02)] outline-none focus:border-[#daeaf3] focus:ring-4 focus:ring-[#daeaf3]/50 transition-all placeholder:text-gray-300" />
      )}
    </div>
  </div>
);

export default function MasterPaymentMethodCreate(): React.ReactElement {
  const navigate = useNavigate();
  const { id } = useParams();
  const existing = id ? MOCK_PAYMENT_METHODS.find((c) => c.id === id) : null;
  const isEdit = !!existing;
  const handleSubmit = (e: React.SyntheticEvent): void => { e.preventDefault(); navigate("/master-payment-method"); };
  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-10 relative overflow-y-auto">
      <FormHeader />
      <div className="px-6 mt-2">
        <div className="mb-8 pl-1">
          <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight">{isEdit ? "Edit Payment Method" : "New Payment Method"}</h2>
          <p className="text-[14px] text-gray-500 mt-2 font-medium">Fill in the payment method details below.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <InputField label="Payment Method Name" placeholder="e.g. Bank Transfer BCA" defaultValue={existing?.name} required icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>} />
          <InputField label="Description" placeholder="e.g. Transfer ke rekening BCA" defaultValue={existing?.description} required multiline icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>} />
          <button type="submit" className="w-full bg-[#1a233a] text-white rounded-full py-4 text-[16px] font-bold tracking-wide shadow-[0_10px_20px_rgba(26,35,58,0.15)] hover:bg-black transition-all mt-2">{isEdit ? "Update Payment Method" : "Create Payment Method"}</button>
        </form>
      </div>
    </div>
  );
}
