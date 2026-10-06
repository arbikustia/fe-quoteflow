import * as React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../app/layout";
import { MOCK_PICS } from "../../../fixture/master-pic";

export default function MasterPicDetail(): React.ReactElement {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const pic = MOCK_PICS.find((c) => c.id === id);

  if (!pic) {
    return (
      <Layout pageTitle="Detail PIC">
        <div className="flex flex-col h-full pb-18 lg:pb-0 px-3 lg:px-0 lg:-mt-4 relative">
          <div className="flex-1 flex items-center justify-center py-20">
            <p className="text-gray-500 font-medium">PIC not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  const handleDelete = (): void => {
    setShowDeleteModal(false);
    navigate("/master-pic");
  };

  return (
    <Layout pageTitle="Detail PIC">
      <div className="flex flex-col h-full pb-18 lg:pb-0 px-3 lg:px-0 lg:-mt-4 relative">
        <div className="flex items-center justify-between py-2 mb-1 lg:mb-4 relative">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="w-11 h-11 rounded-full bg-[#F4F4F5] hover:bg-[#E9E9EB] active:scale-95 transition-all flex items-center justify-center text-black shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5" />
              <path d="M12 19 5 12l7-7" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-[17px] font-semibold text-black tracking-tight px-2 truncate">
            Detail PIC
          </h1>
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              aria-label="More options"
              aria-expanded={isMoreOpen}
              aria-haspopup="menu"
              className="w-11 h-11 rounded-full bg-[#F4F4F5] hover:bg-[#E9E9EB] active:scale-95 transition-all flex items-center justify-center text-black"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="5" cy="12" r="1.8" />
                <circle cx="12" cy="12" r="1.8" />
                <circle cx="19" cy="12" r="1.8" />
              </svg>
            </button>
            {isMoreOpen && (
              <>
                <button type="button" aria-label="Close menu" onClick={() => setIsMoreOpen(false)} className="fixed inset-0 z-10 cursor-default" tabIndex={-1} />
                <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-20 w-40 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl overflow-hidden">
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => { setIsMoreOpen(false); navigate(`/master-pic/edit/${pic.id}`); }}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => { setIsMoreOpen(false); setShowDeleteModal(true); }}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="pb-24 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex-1 min-w-0 text-center py-2">
              <h2 className="text-[20px] font-bold text-gray-900 leading-tight truncate mb-2">{pic.name}</h2>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold ${pic.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {pic.status}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <h3 className="text-[12px] font-bold text-gray-400 tracking-widest uppercase">PIC Details</h3>
            </div>
            <dl className="divide-y divide-gray-100">
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <dt className="text-[13px] font-medium text-gray-500 shrink-0">PIC Name</dt>
                <dd className="font-semibold text-gray-900 text-[15px] text-right truncate">{pic.name}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <dt className="text-[13px] font-medium text-gray-500 shrink-0">PIC ID</dt>
                <dd className="font-semibold text-gray-900 text-[15px] text-right truncate">{pic.id}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-5 pt-5 pb-1">
              <h3 className="text-[12px] font-bold text-gray-400 tracking-widest uppercase">Record Info</h3>
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              <div className="px-5 py-4">
                <p className="text-[13px] font-medium text-gray-500 mb-1">Created By</p>
                <p className="font-semibold text-gray-900 text-[15px] truncate">{pic.createBy}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-[13px] font-medium text-gray-500 mb-1">Created At</p>
                <p className="font-semibold text-gray-900 text-[15px] truncate">{pic.createAt}</p>
              </div>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
              <div className="w-14 h-14 bg-[#fde8e8] rounded-full flex items-center justify-center mb-4 mx-auto text-[#bd4040]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h3 className="text-[22px] font-bold text-center text-gray-900 mb-2">Delete PIC?</h3>
              <p className="text-[14px] text-gray-500 text-center mb-8 font-medium">Are you sure you want to delete <span className="text-gray-900 font-bold">{pic.name}</span>?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-3.5 bg-[#bd4040] text-white font-bold rounded-2xl hover:bg-red-700 transition-colors shadow-md">Yes, Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
