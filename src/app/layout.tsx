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
  whiteBackground?: boolean;
  showMobileGlobalHeader?: boolean;
};

/**
 * Render Layout.
 * @param {LayoutProps} props - props
 * @returns {React.ReactElement} node
 */
export default function Layout({ children, mobileWhiteBackground = false, whiteBackground = false, showMobileGlobalHeader = false }: LayoutProps): React.ReactElement {
  const { pathname } = useLocation();
  const { isSidebarCollapsed, onToggleSidebarCollapsed } = useSidebarCollapse();
  const isOrderRoute = pathname.startsWith("/order");
  const isMasterListRoute = /^\/master-[^/]+$/.test(pathname);
  const hasGlobalMobileHeader = isOrderRoute || isMasterListRoute || showMobileGlobalHeader;

  return (
    <div className={`flex h-full min-h-0 w-full overflow-hidden font-sans text-text-primary relative items-stretch transition-colors duration-200 ${whiteBackground ? "bg-background-surface" : "bg-background-page"}`}>
      <div className="hidden lg:flex h-full min-h-0 shrink-0 self-stretch">
        <SidebarContainer isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative transition-colors duration-200 ${whiteBackground ? "bg-background-surface" : "bg-background-page"}${mobileWhiteBackground ? " bg-background-surface lg:bg-background-page" : ""}`}>
        <div className="lg:hidden shrink-0"><GlobalHeader /></div>

        <div className="hidden lg:block shrink-0">
          <NavbarContainer isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={onToggleSidebarCollapsed} />
        </div>

        <main className="flex-1 overflow-y-auto px-4 mb-32  lg:p-8 pb-20 lg:pb-8 relative z-0">
          {children}
        </main>
        {isOrderRoute && <div className="lg:hidden"><MobileNavigate /></div>}
      </div>
    </div>
  );
}
