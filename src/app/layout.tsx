import React from "react";
import { useLocation } from "react-router-dom";

import BottomNav from "../components/BottomNav/index";
import Navbar from "../components/Navbar/index";
import Sidebar from "../components/Sidebar/index";

export type LayoutProps = {
  readonly children: React.ReactNode;
  readonly pageTitle?: string;
};

/**
 * Render Layout — mobile header hidden on /master* routes.
 * @param {LayoutProps} props - props
 * @returns {React.ReactElement} node
 */
export default function Layout({ children }: LayoutProps): React.ReactElement {
  const { pathname } = useLocation();
  const isMasterRoute = pathname.startsWith("/master");

  return (
    <div className="flex h-full w-full bg-brand-white overflow-hidden font-sans text-brand-text-dark relative">
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-brand-white">
        {!isMasterRoute && (
          <div className="lg:hidden flex items-center gap-3 p-4 border-b border-brand-gray-light bg-brand-white shrink-0">
            <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center">
              <span className="text-brand-white font-bold">Q</span>
            </div>
            <span className="font-bold text-brand-text-dark">QuoteFlow</span>
          </div>
        )}

        <div className="hidden lg:block shrink-0">
          <Navbar />
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-20 lg:pb-8 relative z-0">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
