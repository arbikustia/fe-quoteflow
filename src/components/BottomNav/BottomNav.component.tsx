import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { BottomNavItem } from "./BottomNav.type";
import { Icons } from "../Icons";

const NAV_ITEMS: BottomNavItem[] = [
  { label: "Home", path: "/home", icon: <Icons.Dashboard /> },
  { label: "Order", path: "/order", icon: <Icons.Document /> },
  { label: "Return", path: "/return", icon: <Icons.Schedule /> },
  { label: "Master", path: "/master-main", icon: <Icons.Database /> },
  { label: "Report", path: "/report/main", icon: <Icons.Reporting /> },
];

/**
 * Mobile Bottom Navigation - Redesigned (Standardized Items)
 */
export const BottomNav = (): React.ReactElement => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive = (path: string): boolean => {
    if (path === "/report/main") return pathname.startsWith("/report");
    if (path === "/master-main") return pathname === "/master-main";

    return pathname === path || pathname.startsWith(path + "/");
  };
  
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex items-center justify-around px-4 pb-[env(safe-area-inset-bottom)] h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.path);
        
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center gap-1 w-12 transition-colors ${
              active ? "text-gray-900" : "text-gray-400"
            }`}
          >
            <div className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${active ? "bg-gray-900 text-white" : ""}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
