import * as React from "react";
import { FiDownload } from "react-icons/fi";

import { generateQuotePDF } from "@/utils/pdfGenerator";

import type { MobileHeaderProps, MobileReportProps, OrderRowProps } from "./MobileReport.type";

/**
 * Render Mobile Header Component
 * @param {MobileHeaderProps} props - component props
 * @returns {React.ReactElement} - rendered header
 */
const MobileHeader = ({ onNavigate }: MobileHeaderProps): React.ReactElement => {
  /**
   * Handle back navigation
   * @returns {void} - void
   */
  const handleBack = (): void => {
    onNavigate("/report/main");
  };

  return (
    <div className="px-6 pt-10 pb-2 flex items-center justify-between sticky top-0 bg-background-page/90 backdrop-blur-sm z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-background-surface shadow-sm flex items-center justify-center text-text-secondary shrink-0 hover:bg-background-subtle transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <h3 className="text-[18px] font-bold text-text-primary leading-tight">Order Report</h3>
      </div>
    </div>
  );
};

/**
 * Render Order Row Component
 * @param {OrderRowProps} props - component props
 * @returns {React.ReactElement} - rendered order row
 */
const OrderRow = ({ order, index, onNavigate }: OrderRowProps): React.ReactElement => {
  /**
   * Get status styles
   * @param {string} status - order status
   * @returns {string} - CSS classes
   */
  const getStatusStyles = (status: string): string => {
    if (status === "Pending Payment") {
      return "bg-[#fdf2c8] text-[#a87b1e]";
    }

    if (status === "Confirmed") {
      return "bg-[#d7e6c3] text-[#4a7246]";
    }

    if (status === "On Rental") {
      return "bg-[#daeaf3] text-[#3b82f6]";
    }

    if (status === "Returned") {
      return "bg-[#e7dff2] text-[#907cb5]";
    }

    if (status === "Completed") {
      return "bg-[#e7efdd] text-[#4a7246]";
    }

    if (status === "Cancel") {
      return "bg-[#fee2e2] text-[#ef4444]";
    }

    return "bg-background-subtle text-text-secondary";
  };

  /**
   * Handle download PDF
   * @param {React.MouseEvent} e - mouse event
   * @returns {void} - void
   */
  const handleDownload = (e: React.MouseEvent): void => {
    e.stopPropagation();
    void generateQuotePDF(order);
  };

  /**
   * Handle row click navigation
   * @returns {void} - void
   */
  const handleRowClick = (): void => {
    onNavigate(`/report/detail/${order.id}`);
  };

  return (
    <div
      onClick={handleRowClick}
      className="bg-background-surface rounded-3xl px-5 py-4 mb-3 flex items-center shadow-[0_4px_15_rgba(0,0,0,0.02)] border border-border-default transition-transform hover:scale-[1.01] cursor-pointer"
    >
      <div className="w-10 flex items-center justify-start text-text-tertiary font-bold text-[14px]">
        {index + 1}
      </div>
      <div className="flex-1 flex flex-col pr-2 min-w-0">
        <span className="font-bold text-[14px] text-text-primary truncate">{order.name}</span>
        <span className="font-medium text-[12px] text-text-tertiary truncate">{order.location}</span>
      </div>
      <div className="flex items-center justify-end gap-3">
        <div className={`rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider ${getStatusStyles(order.status || "Completed")}`}>
          {order.status || "Completed"}
        </div>
        <button
          onClick={handleDownload}
          className="w-8 h-8 rounded-full bg-background-subtle flex items-center justify-center text-[#4a64b8] hover:bg-background-subtle transition-colors shrink-0"
        >
          <FiDownload className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/**
 * Render MobileReport Component
 * @param {MobileReportProps} props - component props
 * @returns {React.ReactElement} - rendered mobile report component
 */
export const MobileReportComponent = (props: MobileReportProps): React.ReactElement => {
  const { orders, onNavigate } = props;

  return (
    <div className="flex-1 w-full min-h-full bg-background-page font-sans pb-32 relative overflow-y-auto">
      <MobileHeader onNavigate={onNavigate} />
      
      <div className="px-6 mt-4">
        <h2 className="text-[28px] font-bold text-text-primary mb-0.5">Report List</h2>
        <p className="text-[14px] text-text-tertiary font-medium">Completed orders history.</p>
        
        <div className="flex items-center mt-8 mb-3 px-3 text-[11px] font-bold text-text-disabled tracking-widest uppercase">
          <div className="w-10">No</div>
          <div className="flex-1">Event Info</div>
          <div className="w-24 text-right pr-2">Status</div>
        </div>

        <div className="flex flex-col">
          {orders.map((order, index) => {
            return (
              <OrderRow key={order.id} order={order} index={index} onNavigate={onNavigate} />
            );
          })}
        </div>
      </div>
    </div>
  );
};
