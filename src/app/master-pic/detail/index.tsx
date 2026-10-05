import * as React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_PICS } from "../../../fixture/master-pic";

export default function MasterPicDetail(): React.ReactElement {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showConfirm, setShowConfirm] = useState(false);
  const pic = MOCK_PICS.find((c) => c.id === id);
  if (!pic) {
    return <div className="flex-1 w-full min-h-full bg-[#f8f9fb] flex items-center justify-center"><p className="text-gray-500 font-medium">PIC not found</p></div>;
  }
  const handleDelete = (): void => { setShowConfirm(false); navigate("/master-pic"); };
  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans relative overflow-y-auto">
      <div className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-sm z-20">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a233a] group-hover:bg-gray-50 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </div>
          <span className="font-bold text-[15px]">Back</span>
        </button>
        <button onClick={() => navigate(`/master-pic/edit/${pic.id}`)} className="px-5 py-2.5 bg-[#f4e482] text-[#eab308] font-bold text-[13px] rounded-full hover:bg-[#eade6d] transition-colors">Edit PIC</button>
      </div>
      <div className="px-6 mt-4 pb-24">
        <div className="bg-white rounded-[2rem] p-6 mb-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#f4e482] text-[#eab308] flex items-center justify-center mb-4 border-4 border-white shadow-md">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h2 className="text-[24px] font-extrabold text-gray-900 leading-none mb-2 text-center">{pic.name}</h2>
          <div className="mt-2 rounded-full px-4 py-1.5 text-[12px] font-bold tracking-wider uppercase text-[#eab308] bg-[#f4e482]">{pic.status}</div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100">
          <h3 className="text-[14px] font-bold text-gray-400 tracking-widest uppercase mb-6">PIC Details</h3>
          <div className="flex flex-col gap-6">
            <div><span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">PIC ID</span><p className="font-semibold text-gray-800 text-[15px]">{pic.id}</p></div>
            <div className="w-full h-px bg-gray-100"></div>
            <div className="flex gap-4">
              <div className="flex-1"><span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">Created By</span><p className="font-semibold text-gray-800 text-[15px]">{pic.createBy}</p></div>
              <div className="flex-1 border-l border-gray-100 pl-4"><span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">Created At</span><p className="font-semibold text-gray-800 text-[15px]">{pic.createAt}</p></div>
            </div>
          </div>
        </div>
        <button onClick={() => setShowConfirm(true)} className="w-full mt-8 bg-[#fde8e8] text-[#bd4040] rounded-full py-4 text-[16px] font-bold tracking-wide shadow-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Delete PIC
        </button>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-[22px] font-bold text-center text-gray-900 mb-2">Delete PIC?</h3>
            <p className="text-[14px] text-gray-500 text-center mb-8 font-medium">Are you sure you want to delete <span className="text-gray-900 font-bold">{pic.name}</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3.5 bg-[#bd4040] text-white font-bold rounded-2xl hover:bg-red-700 transition-colors shadow-md">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
