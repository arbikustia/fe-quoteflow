import * as React from "react";
import { Link } from "react-router-dom";
import { Icons } from "../Icons";

import type { SidebarProps } from "./Sidebar.type";

/**
 * Render Sidebar Component
 * @param {SidebarProps} props - sidebar component props
 * @returns {React.ReactElement} - SidebarComponent
 */
export const SidebarComponent = (props: SidebarProps): React.ReactElement => {
  const { navigation, currentPath, openMenus, onToggleMenu } = props;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
      <div className="h-20 flex items-center px-8 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-orange to-brand-blue flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">Q</span>
          </div>
          <span className="text-xl font-extrabold text-brand-text-dark tracking-tight">
            QuoteFlow
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
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
                      : "text-brand-text-medium hover:bg-gray-50 hover:text-brand-text-dark font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${isActive || isMenuOpen ? "text-brand-blue" : "text-gray-400 group-hover:text-brand-orange"} transition-colors`}>
                      <item.icon />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <div className={`transition-transform duration-200 text-gray-400 ${isMenuOpen ? "rotate-180" : ""}`}>
                    <Icons.ChevronDown />
                  </div>
                </button>
              ) : (
                <Link
                  to={item.path || "#"}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-brand-blue/10 text-brand-blue font-bold shadow-[0_2px_10px_rgba(93,124,240,0.1)]"
                      : "text-brand-text-medium hover:bg-gray-50 hover:text-brand-text-dark font-medium"
                  }`}
                >
                  <div
                    className={`${isActive ? "text-brand-blue" : "text-gray-400 group-hover:text-brand-orange"} transition-colors`}
                  >
                    <item.icon />
                  </div>
                  <span>{item.name}</span>
                </Link>
              )}

              {/* Children Menus */}
              {hasChildren && isMenuOpen && (
                <div className="flex flex-col mt-1 space-y-1 relative before:absolute before:left-[1.35rem] before:top-0 before:bottom-2 before:w-px before:bg-gray-200/60 ml-2">
                  {item.children!.map((child) => {
                    const isChildPathActive = currentPath.includes(child.path);
                    return (
                      <Link
                        key={child.name}
                        to={child.path}
                        className={`flex items-center pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 relative ${
                          isChildPathActive
                            ? "text-brand-blue font-bold bg-brand-blue/5"
                            : "text-brand-text-medium hover:text-brand-text-dark hover:bg-gray-50 font-medium"
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
      <div className="p-4 m-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3">
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
