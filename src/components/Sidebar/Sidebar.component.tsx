import * as React from "react";
import { Link } from "react-router-dom";

import type { SidebarProps } from "./Sidebar.type";
import { Icons } from "../Icons";

/**
 * Render Sidebar Component
 * @param {SidebarProps} props - sidebar component props
 * @returns {React.ReactElement} - SidebarComponent
 */
export const SidebarComponent = (props: SidebarProps): React.ReactElement => {
  const { navigation, currentPath, openMenus, onToggleMenu } = props;

  return (
    <aside className="w-[280px] bg-brand-white border-r border-brand-gray-light flex flex-col z-20">
      <div className="h-20 flex items-center px-6 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-blue flex items-center justify-center">
            <span className="text-brand-white font-bold text-xl">Q</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-brand-text-dark leading-tight">QuoteFlow</span>
            <span className="text-[12px] text-brand-text-medium font-medium">Design Agency</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 cursor-pointer">
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <p className="px-4 text-xs font-semibold text-brand-text-medium uppercase tracking-wider mb-4">
          Main Menu
        </p>
        {navigation.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isMenuOpen = openMenus.includes(item.name);
          
          const isChildActive = hasChildren ? item.children!.some(child => currentPath.includes(child.path)) : false;
          const isActive = (item.path && currentPath.includes(item.path)) || isChildActive;

          return (
            <div key={item.name} className="flex flex-col mb-1">
              {hasChildren ? (
                <button
                  onClick={() => onToggleMenu(item.name)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                    isActive || isMenuOpen
                      ? "bg-brand-blue/5 text-brand-blue font-bold shadow-sm"
                      : "text-brand-text-medium hover:bg-brand-gray-light hover:text-brand-text-dark font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${isActive || isMenuOpen ? "text-brand-blue" : "text-brand-text-medium group-hover:text-brand-orange"} transition-colors`}>
                      <item.icon />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <div className={`transition-transform duration-200 text-brand-text-medium ${isMenuOpen ? "rotate-180" : ""}`}>
                    <Icons.ChevronDown />
                  </div>
                </button>
              ) : (
                <Link
                  to={item.path || "#"}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-brand-blue/10 text-brand-blue font-bold shadow-[0_2px_10px_rgba(93,124,240,0.1)]"
                      : "text-brand-text-medium hover:bg-brand-gray-light hover:text-brand-text-dark font-medium"
                  }`}
                >
                  <div
                    className={`${isActive ? "text-brand-blue" : "text-brand-text-medium group-hover:text-brand-orange"} transition-colors`}
                  >
                    <item.icon />
                  </div>
                  <span>{item.name}</span>
                </Link>
              )}

              {/* Children Menus */}
              {hasChildren && isMenuOpen && (
                <div className="flex flex-col mt-1 space-y-1 relative before:absolute before:left-[1.35rem] before:top-0 before:bottom-2 before:w-px before:bg-brand-gray-light/60 ml-2">
                  {item.children!.map((child) => {
                    const isChildPathActive = currentPath.includes(child.path);
                    return (
                      <Link
                        key={child.name}
                        to={child.path}
                        className={`flex items-center pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 relative ${
                          isChildPathActive
                            ? "text-brand-blue font-bold bg-brand-blue/5"
                            : "text-brand-text-medium hover:text-brand-text-dark hover:bg-brand-gray-light font-medium"
                        }`}
                      >
                        {isChildPathActive && (
                          <span className="absolute left-3.25 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-blue ring-4 ring-brand-blue/20"></span>
                        )}
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Profile Snippet */}
      <div className="p-4 m-4 border border-brand-gray-light rounded-2xl bg-brand-gray-light/50 hover:bg-brand-gray-light cursor-pointer transition-colors flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold shadow-inner">
          A
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold text-brand-text-dark truncate">
            Arbi Kustia
          </p>
          <p className="text-xs text-brand-text-medium truncate">Admin</p>
        </div>
      </div>
    </aside>
  );
};
