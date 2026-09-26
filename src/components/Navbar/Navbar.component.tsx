import * as React from "react";

import { Icons } from "../Icons";
import type { NavbarProps } from "./Navbar.type";

/**
 * Render Navbar Component
 * @param {NavbarProps} props - navbar component props
 * @returns {React.ReactElement} - NavbarComponent
 */
export const NavbarComponent = (props: NavbarProps): React.ReactElement => {
  const { pageTitle = "Dashboard" } = props;

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white/60 backdrop-blur-2xl border-b border-gray-100/50 sticky top-0 z-10 shadow-[0_4px_30px_rgba(0,0,0,0.01)] transition-all">
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-brand-text-dark">
          {pageTitle}
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Search Bar */}
        <div className="relative group hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-blue transition-colors">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Search anything..."
            className="w-72 pl-11 pr-14 py-2.5 bg-gray-50/50 hover:bg-white border border-gray-200/60 focus:bg-white rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] transition-all placeholder:text-gray-400 text-brand-text-dark"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md border border-gray-200/50">
              ⌘K
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200/60 hidden md:block mx-1"></div>

        {/* Notifications */}
        <button className="relative p-2.5 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-xl border border-transparent hover:border-brand-blue/10 transition-all focus:outline-none focus:ring-2 focus:ring-brand-blue/20">
          <Icons.Bell />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-orange rounded-full border border-white shadow-sm animate-pulse"></span>
        </button>

        {/* User Dropdown Trigger */}
        <button className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all focus:outline-none">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-brand-orange to-brand-blue flex items-center justify-center font-bold text-white shadow-md text-sm">
            A
          </div>
          <Icons.ChevronDown />
        </button>
      </div>
    </header>
  );
};
