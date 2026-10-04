import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import BottomNav from "../components/BottomNav/index";
import Navbar from "../components/Navbar/index";
import Sidebar from "../components/Sidebar/index";

export type LayoutProps = {
  readonly children: React.ReactNode;
  readonly pageTitle?: string;
};

/**
 * Render Layout
 * @param {LayoutProps} props - props
 * @returns {React.ReactElement} node
 */
export default function Layout({ children }: LayoutProps): React.ReactElement {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-full w-full bg-brand-white overflow-hidden font-sans text-brand-text-dark relative">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform bg-brand-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
        {/* Close Button on Mobile Sidebar */}
        <button 
          className="absolute top-4 right-4 lg:hidden p-2 text-brand-text-medium hover:text-brand-orange bg-brand-gray-light rounded-full z-[60]"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <BottomNav />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-brand-white">
        
        {/* Mobile Header (Visible only on small screens) */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-brand-gray-light bg-brand-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center">
              <span className="text-brand-white font-bold">Q</span>
            </div>
            <span className="font-bold text-brand-text-dark">QuoteFlow</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-brand-text-dark bg-brand-gray-light rounded-lg hover:bg-brand-gray-light/80 transition-colors"
          >
            <FiMenu className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop Navbar (Hidden on mobile) */}
        <div className="hidden lg:block shrink-0">
          <Navbar />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
}
