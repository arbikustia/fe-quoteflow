import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_USERS } from "../../../fixture/master-user";

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

type InputFieldProps = { label: string; placeholder?: string; defaultValue?: string; required?: boolean; icon?: React.ReactNode; type?: string };

const InputField = ({ label, placeholder, defaultValue, required, icon, type = "text" }: InputFieldProps): React.ReactElement => (
  <div className="mb-5">
    <label className="block text-[12px] font-bold text-gray-400 mb-2 pl-3 tracking-widest uppercase">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
      <input type={type} placeholder={placeholder} defaultValue={defaultValue} required={required} className="w-full bg-white border border-gray-100 rounded-3xl py-4 pl-12 pr-5 text-[15px] font-semibold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.02)] outline-none focus:border-[#daeaf3] focus:ring-4 focus:ring-[#daeaf3]/50 transition-all placeholder:text-gray-300" />
    </div>
  </div>
);

export default function MasterUserCreate(): React.ReactElement {
  const navigate = useNavigate();
  const { id } = useParams();
  const existing = id ? MOCK_USERS.find((c) => c.id === id) : null;
  const isEdit = !!existing;
  const handleSubmit = (e: React.SyntheticEvent): void => { e.preventDefault(); navigate("/master-user"); };
  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-10 relative overflow-y-auto">
      <FormHeader />
      <div className="px-6 mt-2">
        <div className="mb-8 pl-1">
          <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight">{isEdit ? "Edit User" : "New User"}</h2>
          <p className="text-[14px] text-gray-500 mt-2 font-medium">Fill in the user details below.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <InputField label="Username" placeholder="e.g. johndoe" defaultValue={existing?.username} required icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
          {!isEdit && (
            <InputField label="Password" type="password" placeholder="Enter password" required icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>} />
          )}
          <div className="mb-5 relative z-10">
            <label className="block text-[12px] font-bold text-gray-400 mb-2 pl-3 tracking-widest uppercase">Role</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <select
                defaultValue={existing?.role || "User"}
                required
                className="w-full bg-white border border-gray-100 rounded-3xl py-4 pl-12 pr-10 text-[15px] font-semibold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.02)] outline-none focus:border-[#daeaf3] focus:ring-4 focus:ring-[#daeaf3]/50 transition-all appearance-none"
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>
          <button type="submit" className="w-full bg-[#1a233a] text-white rounded-full py-4 text-[16px] font-bold tracking-wide shadow-[0_10px_20px_rgba(26,35,58,0.15)] hover:bg-black transition-all mt-2">{isEdit ? "Update User" : "Create User"}</button>
        </form>
      </div>
    </div>
  );
}
