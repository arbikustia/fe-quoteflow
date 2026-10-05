import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_ROLES } from "../../../fixture/master-role";

const FormHeader = () => {
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

const InputField = ({ label, defaultValue, required }: { label: string; defaultValue?: string; required?: boolean }) => (
  <div className="mb-5">
    <label className="block text-[12px] font-bold text-gray-400 mb-2 pl-3 tracking-widest uppercase">{label}</label>
    <input defaultValue={defaultValue} required={required} className="w-full bg-white border border-gray-100 rounded-3xl py-4 px-5 text-[15px] font-semibold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.02)] outline-none focus:border-[#daeaf3] focus:ring-4 focus:ring-[#daeaf3]/50 transition-all" />
  </div>
);

export default function MasterRoleCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const existing = id ? MOCK_ROLES.find(c => c.id === id) : null;
  const handleSubmit = (e: React.SyntheticEvent) => { e.preventDefault(); navigate("/master-role"); };
  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-10 relative overflow-y-auto">
      <FormHeader />
      <div className="px-6 mt-2">
        <div className="mb-8 pl-1">
          <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight">{existing ? "Edit Role" : "New Role"}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <InputField label="Role Name" defaultValue={existing?.roleName} required />
          <button type="submit" className="w-full bg-[#1a233a] text-white rounded-full py-4 text-[16px] font-bold mt-2">{existing ? "Update Role" : "Create Role"}</button>
        </form>
      </div>
    </div>
  );
}
