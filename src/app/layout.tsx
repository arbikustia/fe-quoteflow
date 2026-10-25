import React from "react";
import { useLocation } from "react-router-dom";

import SidebarContainer from "../components/Sidebar/index";
import { useSidebarCollapse } from "../hooks/useSidebarCollapse";
import NavbarContainer from "../components/Navbar/index";
import GlobalHeader from "./shared/GlobalHeader";
import MobileNavigate from "../components/MobileNavigate";

export type LayoutProps = {
  children: React.ReactNode;
  pageTitle?: string;
  mobileWhiteBackground?: boolean;
};

/**
 * Render Layout — mobile header hidden on /master* routes.
 * @param {LayoutProps} props - props
 * @returns {React.ReactElement} node
 */
export default function Layout({ children, mobileWhiteBackground = false }: LayoutProps): React.ReactElement {
  const { pathname } = useLocation();
  const { isSidebarCollapsed, onToggleSidebarCollapsed } = useSidebarCollapse();
  const isOrderRoute = pathname.startsWith("/order");

  return (
    <div className="flex h-full min-h-0 w-full bg-background-page overflow-hidden font-sans text-text-primary relative items-stretch transition-colors duration-200">
      <div className="hidden lg:flex h-full min-h-0 shrink-0 self-stretch">
        <SidebarContainer isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative bg-background-page transition-colors duration-200${mobileWhiteBackground ? " bg-background-surface lg:bg-background-page" : ""}`}>
        {isOrderRoute ? <div className="lg:hidden shrink-0"><GlobalHeader /></div> : (
          <div className="lg:hidden flex items-center gap-3 p-4 border-b border-border-default bg-background-surface shrink-0">
            <div className="w-8 h-8 rounded-full bg-action-primary flex items-center justify-center">
              <span className="text-text-inverse font-bold">Q</span>
            </div>
            <span className="font-bold text-text-primary">QuoteFlow</span>
          </div>
        )}

        <div className="hidden lg:block shrink-0">
          <NavbarContainer isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={onToggleSidebarCollapsed} />
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-20 lg:pb-8 relative z-0">
          {children}
        </main>
        {isOrderRoute && <div className="lg:hidden"><MobileNavigate /></div>}
      </div>
    </div>
  );
}
