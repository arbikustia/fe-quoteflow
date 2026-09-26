import * as React from "react";

import { Icons } from "../Icons";


/**
 * Render Navbar Component
 * @param {NavbarProps} props - navbar component props
 * @returns {React.ReactElement} - NavbarComponent
 */
export const NavbarComponent = (): React.ReactElement => {
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-gray-200 sticky top-0 z-10 transition-all">
      <div className="flex-1">
        {/* Search Bar */}
        <div className="relative group hidden md:block max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Search anything"
            className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue transition-all placeholder:text-gray-400 text-gray-900"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
              ⌘K
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* User Dropdown Trigger */}
        <button className="flex items-center gap-2.5 px-1.5 py-1.5 pr-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-all focus:outline-none">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-bold text-gray-700">Admin User</span>
          <div className="text-gray-400">
            <Icons.ChevronDown />
          </div>
        </button>
      </div>
    </header>
  );
};
