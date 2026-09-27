import * as React from "react";

import { Icons } from "../Icons";


/**
 * Render Navbar Component
 * @param {NavbarProps} props - navbar component props
 * @returns {React.ReactElement} - NavbarComponent
 */
export const NavbarComponent = (): React.ReactElement => {
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-brand-white border-b border-brand-gray-light sticky top-0 z-10 transition-all">
      <div className="flex-1">
        {/* Search Bar */}
        <div className="relative group hidden md:block max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Search anything"
            className="w-full pl-10 pr-12 py-2.5 bg-brand-white border border-brand-gray-light rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue transition-all placeholder:text-brand-text-medium text-brand-text-dark"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[10px] font-medium text-brand-text-medium bg-brand-gray-light px-1.5 py-0.5 rounded border border-brand-gray-light">
              ⌘K
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* User Dropdown Trigger */}
        <button className="flex items-center gap-2.5 px-1.5 py-1.5 pr-3 rounded-full bg-brand-white border border-brand-gray-light hover:bg-brand-gray-light transition-all focus:outline-none">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-bold text-brand-text-dark">Admin User</span>
          <div className="text-brand-text-medium">
            <Icons.ChevronDown />
          </div>
        </button>
      </div>
    </header>
  );
};
