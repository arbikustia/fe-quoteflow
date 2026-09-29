import type { ReactElement } from "react";

import type { MobileReturnDetailItemRowProps, MobileReturnDetailProps } from "./MobileReturnDetail.type";

/**
 * Get CSS styles based on order status
 * @param {string} status - order status
 * @returns {string} CSS classes
 */
const getStatusStyles = (status: string): string => {
  if (status === "Confirmed" || status === "Completed") return "text-[#4a7246] bg-[#e7efdd]";

  if (status === "Pending Payment") return "text-[#a87b1e] bg-[#fdf2c8]";

  if (status === "Cancel") return "text-[#bd4040] bg-[#fde8e8]";

  if (status === "On Rental") return "text-[#4a64b8] bg-[#daeaf3]";

  return "text-gray-600 bg-gray-100";
};

/**
 * Mobile Return Detail Toast Component
 * @param {{ showToast: boolean }} props - props
 * @returns {ReactElement | null} node
 */
const MobileReturnDetailToast = ({ showToast }: { showToast: boolean }): ReactElement | null => {
  if (!showToast) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#4a7246] text-white px-5 py-3 rounded-xl shadow-[0_10px_40px_rgba(74,114,70,0.3)] flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <span className="font-bold text-[14px]">Return saved successfully!</span>
    </div>
  );
};

/**
 * Mobile Return Detail Header Component
 * @param {Pick<MobileReturnDetailProps, "onBack" | "onDownload" | "handleSave">} props - props
 * @returns {ReactElement} node
 */
const MobileReturnDetailHeader = ({ onBack, onDownload, handleSave }: Pick<MobileReturnDetailProps, "onBack" | "onDownload" | "handleSave">): ReactElement => {
  return (
    <div className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-sm z-20">
      <button type="button" onClick={onBack} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors group">
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a233a] group-hover:bg-gray-50 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>
        <span className="font-bold text-[15px]">Back</span>
      </button>
      <div className="flex items-center gap-3">
        <button onClick={onDownload} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#4a7246] hover:bg-gray-50 transition-colors shrink-0" title="Download PDF">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </button>
        <button onClick={handleSave} className="h-10 px-5 rounded-full bg-[#4a7246] text-white font-bold text-[13px] flex items-center gap-2 shadow-[0_4px_12px_rgba(74,114,70,0.2)] hover:bg-[#3d5e39] transition-colors shrink-0" title="Save Return">
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

/**
 * Info Field Component for Return Detail
 * @param {{ label: string; value: string; isSmall?: boolean }} props - props
 * @returns {ReactElement} node
 */
const InfoField = ({ label, value, isSmall }: { label: string; value: string; isSmall?: boolean }): ReactElement => (
  <div>
    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</span>
    <span className={`font-bold text-gray-800 ${isSmall ? "text-[14px]" : "text-[15px]"}`}>{value}</span>
  </div>
);

/**
 * Mobile Return Detail Info Component
 * @param {Pick<MobileReturnDetailProps, "order">} props - props
 * @returns {ReactElement} node
 */
const MobileReturnDetailInfo = ({ order }: Pick<MobileReturnDetailProps, "order">): ReactElement => (
  <>
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-2">Return Details</h2>
        <div className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase ${getStatusStyles(order.status || "")}`}>
          {order.status}
        </div>
      </div>
      <p className="text-[14px] text-gray-500 font-medium leading-relaxed">Here are the complete details for this return.</p>
    </div>
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] mb-6">
      <div className="flex flex-col gap-5">
        <InfoField label="Client Name" value={order.name} />
        <InfoField label="Event Location" value={order.location} />
        <div className="flex items-center gap-6">
          <InfoField label="Start Date" value={order.startDate} isSmall />
          <InfoField label="End Date" value={order.endDate} isSmall />
        </div>
      </div>
    </div>
  </>
);

/**
 * Mobile Return Detail Item Row Component
 * @param {MobileReturnDetailItemRowProps} props - props
 * @returns {ReactElement} node
 */
const MobileReturnDetailItemRow = ({ item, idx, itemFile, handleFileChange, setPreviewImage, removeFile }: MobileReturnDetailItemRowProps): ReactElement => (
  <div className="flex flex-col p-4 bg-[#f8f9fb] rounded-2xl border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[14px] font-bold text-gray-800">{item}</span>
      <span className="text-[13px] font-bold text-[#4a64b8] bg-white px-2 py-0.5 rounded-lg border border-gray-200">Qty: 1</span>
    </div>
    <div className="flex flex-col gap-2 border-t border-gray-100 pt-3 mt-1">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Condition Remark</label>
      <div className="flex gap-2">
        <input type="text" placeholder="Note any damages or issues..." className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#4a64b8] focus:ring-1 focus:ring-[#4a64b8] transition-all" />
        <label className="w-10 h-10 shrink-0 bg-[#eef2f6] border border-gray-200 rounded-xl flex items-center justify-center text-[#4a64b8] cursor-pointer hover:bg-gray-200 transition-colors relative" title="Upload Image">
          <input type="file" accept="image/*" onChange={(e): void => handleFileChange(idx, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        </label>
        <label className="w-10 h-10 shrink-0 bg-[#4a64b8] shadow-sm rounded-xl flex items-center justify-center text-white cursor-pointer hover:bg-[#3d5296] transition-colors relative" title="Take a Picture">
          <input type="file" accept="image/*" capture="environment" onChange={(e): void => handleFileChange(idx, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
        </label>
      </div>
      {itemFile && (
        <div className="mt-1 text-[11px] font-medium text-[#4a7246] bg-[#e7efdd] border border-[#d1dec1] px-3 py-2 rounded-xl flex items-center justify-between">
          <button type="button" onClick={(): void => setPreviewImage(itemFile.url)} className="flex items-center gap-2 overflow-hidden hover:opacity-70 text-left flex-1 min-w-0" title="Click to view full size">
            <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
            <span className="truncate underline decoration-[#4a7246]/30 underline-offset-2">{itemFile.name}</span>
          </button>
          <button type="button" onClick={(): void => removeFile(idx)} className="ml-2 text-[#4a7246] hover:text-[#2d472a] p-1 bg-white/50 rounded-full shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}
    </div>
  </div>
);

/**
 * Mobile Return Detail Items Component
 * @param {Pick<MobileReturnDetailProps, "order" | "itemFiles" | "handleFileChange" | "setPreviewImage" | "removeFile">} props - props
 * @returns {ReactElement} node
 */
const MobileReturnDetailItems = ({ order, itemFiles, handleFileChange, setPreviewImage, removeFile }: Pick<MobileReturnDetailProps, "order" | "itemFiles" | "handleFileChange" | "setPreviewImage" | "removeFile">): ReactElement => {
  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] mb-8">
      <div className="flex items-center justify-between mb-5">
        <label className="block text-[12px] font-bold text-gray-400 tracking-widest uppercase">Ordered Items</label>
        <span className="text-[12px] font-bold text-[#4a64b8] bg-[#daeaf3] px-3 py-1 rounded-full">{order.qty} Items Total</span>
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <h4 className="text-[11px] font-bold text-[#4a7246] uppercase tracking-wider mb-3 px-1">{order.category}</h4>
          <div className="flex flex-col gap-3">
            {order.selectedItems.map((item, idx) => (
              <MobileReturnDetailItemRow key={idx} item={item} idx={idx} itemFile={itemFiles[idx]} handleFileChange={handleFileChange} setPreviewImage={setPreviewImage} removeFile={removeFile} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Mobile Return Detail Preview Component
 * @param {Pick<MobileReturnDetailProps, "previewImage" | "setPreviewImage">} props - props
 * @returns {ReactElement | null} node
 */
const MobileReturnDetailPreview = ({ previewImage, setPreviewImage }: Pick<MobileReturnDetailProps, "previewImage" | "setPreviewImage">): ReactElement | null => {
  if (!previewImage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={(): void => setPreviewImage(null)}>
      <button type="button" onClick={(): void => setPreviewImage(null)} className="absolute top-6 right-6 text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors z-10" title="Close preview">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <img src={previewImage} alt="Preview full size" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl relative" onClick={(e): void => e.stopPropagation()} />
    </div>
  );
};

/**
 * Mobile Return Detail Component
 * @param {MobileReturnDetailProps} props - component props
 * @returns {ReactElement} component
 */
export const MobileReturnDetailComponent = (props: MobileReturnDetailProps): ReactElement => {
  const { order, itemFiles, previewImage, showToast, handleFileChange, removeFile, handleSave, setPreviewImage, onBack, onDownload } = props;

  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-10 relative overflow-y-auto">
      <MobileReturnDetailToast showToast={showToast} />
      <MobileReturnDetailHeader onBack={onBack} onDownload={onDownload} handleSave={handleSave} />
      
      <div className="px-6 mt-2">
        <MobileReturnDetailInfo order={order} />
        <MobileReturnDetailItems order={order} itemFiles={itemFiles} handleFileChange={handleFileChange} setPreviewImage={setPreviewImage} removeFile={removeFile} />
      </div>
      
      <MobileReturnDetailPreview previewImage={previewImage} setPreviewImage={setPreviewImage} />
    </div>
  );
};
