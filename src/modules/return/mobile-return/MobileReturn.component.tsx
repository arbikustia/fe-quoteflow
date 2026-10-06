import type { ReactElement } from "react";

import type { MobileReturnProps } from "./MobileReturn.type";
import type { QuoteData } from "../../order/desktop-order/DesktopOrder.type";

/**
 * Format date to Month Day (e.g. Jan 01)
 * @param {string} dateStr - date string
 * @returns {string} formatted date
 */
const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  const month = d.toLocaleString("en-US", { month: "short" });
  const day = d.getDate().toString().padStart(2, "0");

  return `${month} ${day}`;
};

/**
 * Get CSS styles based on quote status
 * @param {string} status - quote status
 * @returns {string} CSS classes
 */
const getStatusStyles = (status: string): string => {
  if (status === "Pending Payment") return "bg-[#fdf2c8] text-[#a87b1e]";

  
  if (status === "Confirmed") return "bg-[#d7e6c3] text-[#4a7246]";
  
  if (status === "On Rental") return "bg-[#daeaf3] text-[#3b82f6]";
  
  if (status === "Returned") return "bg-[#e7dff2] text-[#907cb5]";
  
  if (status === "Completed") return "bg-[#e7efdd] text-[#4a7246]";
  
  if (status === "Cancel") return "bg-[#fee2e2] text-[#ef4444]";
  
  return "bg-gray-100 text-gray-600";
};

/**
 * Get short status text
 * @param {string} status - quote status
 * @returns {string} short status
 */
const getShortStatus = (status: string): string => status;

/**
 * Mobile Return Row Component
 * @param {{ quote: QuoteData, onNavigateDetail: (id: string) => void }} props - props
 * @returns {ReactElement} node
 */
const ReturnRow = ({ quote, onNavigateDetail }: { quote: QuoteData; onNavigateDetail: (id: string) => void }): ReactElement => {
  return (
    <div onClick={(): void => onNavigateDetail(quote.id)} className="bg-white rounded-3xl px-5 py-4 mb-3 flex items-center shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100 transition-transform hover:scale-[1.01] cursor-pointer">
      <div className="w-1/2 flex flex-col">
        <span className="font-bold text-[13px] text-gray-800 truncate pr-2">{quote.name}</span>
        <span className="font-medium text-[11px] text-gray-500 truncate pr-2">{quote.location}</span>
      </div>
      <div className="w-1/4 font-semibold text-[12px] text-gray-600 text-center">{formatDate(quote.startDate)}</div>
      <div className="w-1/4 flex justify-end">
        <div className={`rounded-full px-2.5 py-1 text-[9px] font-bold tracking-wider ${getStatusStyles(quote.status)}`}>
          {getShortStatus(quote.status)}
        </div>
      </div>
    </div>
  );
};

/**
 * Mobile Return Component
 * @param {MobileReturnProps} props - component props
 * @returns {ReactElement} component
 */
export const MobileReturnComponent = (props: MobileReturnProps): ReactElement => {
  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-32 relative overflow-y-auto">
      <div className="px-6 mt-4">
        <h2 className="text-[28px] font-bold text-[#1a233a] mb-0.5">Return History</h2>
        <p className="text-[14px] text-gray-500 font-medium">Your recent returns.</p>
        
        <div className="flex items-center mt-8 mb-3 px-3 text-[11px] font-bold text-gray-400 tracking-widest uppercase">
          <div className="w-1/2">Event Info</div>
          <div className="w-1/4 text-center">Date</div>
          <div className="w-1/4 text-right pr-2">Status</div>
        </div>

        <div className="flex flex-col">
          {props.quotes.map((quote) => (
            <ReturnRow key={quote.id} quote={quote} onNavigateDetail={props.onNavigateDetail} />
          ))}
        </div>
      </div>
    </div>
  );
};
