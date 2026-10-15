import * as React from "react";
import { useLocation } from "react-router-dom";

import GlobalHeader from "./GlobalHeader";
import MobileNavigate from "../../components/MobileNavigate";
import NavbarContainer from "../../components/Navbar/index";
import SidebarContainer from "../../components/Sidebar/index";
import { useSidebarCollapse } from "../../hooks/useSidebarCollapse";

export type ResponsiveLayoutProps = {
  readonly children: React.ReactNode;
  readonly pageTitle?: string;
  readonly showCreateButton?: boolean;
  readonly createEndpoint?: string;
};

/**
 * ResponsiveLayout - unified layout wrapper using CSS-only breakpoints (lg:).
 * Mobile (lg:hidden): GlobalHeader + content + MobileNavigate (fixed bottom).
 * Desktop (hidden lg:flex/block): Sidebar + Navbar + content area.
 * @param {ResponsiveLayoutProps} props - layout props
 * @returns {React.ReactElement} layout element
 */
export const ResponsiveLayout = ({
  children,
  pageTitle,
  showCreateButton = false,
  createEndpoint = "",
}: ResponsiveLayoutProps): React.ReactElement => {
  const location = useLocation();
  const path = location.pathname;
  const { isSidebarCollapsed, onToggleSidebarCollapsed } = useSidebarCollapse();

  const isMasterSubRoute = path.startsWith("/master-") && path !== "/master-main";

  return (
    <div className="flex h-screen min-h-screen lg:h-svh lg:min-h-svh w-full bg-brand-white overflow-hidden font-sans text-brand-text-dark relative items-stretch">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full min-h-0 shrink-0 self-stretch">
        <SidebarContainer isCollapsed={isSidebarCollapsed} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative bg-brand-white">
        {/* Mobile GlobalHeader - lg:hidden */}
        <div className="lg:hidden border-b border-brand-gray-light">
          <GlobalHeader showCreateButton={showCreateButton} createEndpoint={createEndpoint} />
        </div>

        {/* Desktop Navbar - hidden lg:block */}
        <div className="hidden lg:block shrink-0">
          <NavbarContainer isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={onToggleSidebarCollapsed} />
        </div>

        {/* Content Area - responsive padding */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-20 lg:pb-8 relative z-0">
          {pageTitle && (
            <div className="mb-6 lg:mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-brand-text-dark tracking-tight">
                {pageTitle}
              </h1>
            </div>
          )}
          {children}
        </main>

        {/* MobileNavigate - lg:hidden */}
        {!isMasterSubRoute && <MobileNavigate />}
      </div>
    </div>
  );
};

export default ResponsiveLayout;