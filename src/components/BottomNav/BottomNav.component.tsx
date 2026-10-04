import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icons } from "../Icons";

type NavItem = { label: string; path: string; icon: React.ReactElement };

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/home", icon: <Icons.Dashboard /> },
  { label: "Order", path: "/order", icon: <Icons.Quotes /> },
  { label: "Master", path: "/master-main", icon: <Icons.Database /> },
  { label: "Report", path: "/report", icon: <Icons.Report /> },
];

/**
 * Bottom navigation reflecting main app modules.
 * @returns {React.ReactElement}
 */
export const BottomNav = (): React.ReactElement => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive = (path: string): boolean => pathname === path || pathname.startsWith(path + "/");
  
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-white border-t border-brand-gray-light flex justify-around items-stretch pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.path);
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-1 flex-col items-center gap-1 py-1.5 text-[10px] font-bold transition-colors ${active ? "text-brand-blue" : "text-brand-text-medium"}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
