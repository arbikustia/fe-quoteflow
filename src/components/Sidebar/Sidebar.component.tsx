import * as React from "react";
import { Link } from "react-router-dom";

import type { NavigationItem, SidebarProps } from "./Sidebar.type";
import { Icons } from "../Icons";
import LogoCollapsed from "../../assets/logo.png";
import SoniclineLogo from "../../assets/Sonicline.png";

/**
 * Reusable sidebar — supports expanded/collapsed, badges, children, tooltips, profile dropdown.
 * Sections derived from flat navigation when no sections passed.
 * @param {SidebarProps} props - props
 * @returns {React.ReactElement} node
 */
export const SidebarComponent = (props: SidebarProps): React.ReactElement => {
  const {
    navigation,
    currentPath,
    openMenus,
    onToggleMenu,
    isCollapsed,
    onToggleCollapsed,
    isProfileOpen,
    onToggleProfile,
  } = props;

  // Normalize: if navigation items look like sections (has .title/.items), unwrap — otherwise wrap as single Menu section
  const isSectionArray =
    navigation.length > 0 && (navigation[0] as unknown as Record<string, unknown>).title !== undefined;
  const sections: readonly { title: string; items: readonly NavigationItem[] }[] = isSectionArray
    ? (navigation as unknown as readonly { title: string; items: readonly NavigationItem[] }[])
    : [{ title: "Menu", items: navigation as readonly NavigationItem[] }];

  return (
    <aside
      className={`${isCollapsed ? "w-[76px]" : "w-[260px]"} h-full min-h-0 self-stretch bg-white border border-[#E5E5E5] flex flex-col shrink-0 overflow-hidden transition-[width] duration-[250ms] ease-in-out`}
      style={{ borderRadius: 12, backgroundColor: "white" }}
      aria-label="Sidebar"
    >
      {/* Header — logo only (image contains brand) */}
      <div className={`h-[56px] flex items-center shrink-0 ${isCollapsed ? "justify-center px-2" : "px-4"}`}>
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
          className="flex items-center justify-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/30 rounded-[8px]"
        >
          <img
            src={isCollapsed ? LogoCollapsed : SoniclineLogo}
            alt="Sonicline"
            className={`${isCollapsed ? "w-8 h-8 rounded-[8px] object-contain" : "h-8 w-auto object-contain"}`}
          />
        </button>
      </div>

      {/* Search */}
      <div className={`shrink-0 ${isCollapsed ? "px-2" : "px-4"} pb-4`}>
        <div
          role="search"
          className={`h-10 bg-[#F3F3F5] flex items-center text-[#6B7280] ${isCollapsed ? "justify-center px-0 rounded-[8px]" : "gap-2 px-3 rounded-[8px]"}`}
        >
          <span className="shrink-0 flex items-center justify-center" aria-hidden>
            <Icons.Search />
          </span>
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left text-[13px] text-[#9CA3AF] truncate">Search</span>
              <span className="shrink-0 text-[11px] leading-none bg-white px-1.5 py-1 rounded-[6px] border border-[#E5E5E5] text-[#6B7280] font-medium">
                ⌘ K
              </span>
            </>
          )}
        </div>
      </div>

      {/* Navigation — scrollable */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? "px-2" : "px-4"} space-y-5 scrollbar-thin`}>
        {sections.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <p className="px-2 mb-2 text-[12px] font-semibold tracking-widest uppercase text-[#9CA3AF]">
                {section.title}
              </p>
            )}
            <nav aria-label={section.title} className="space-y-1">
              {section.items.map((item) => {
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isMenuOpen = openMenus.includes(item.name);
                const isChildActive = hasChildren
                  ? item.children!.some((c) => currentPath === c.path || currentPath.startsWith(c.path + "/"))
                  : false;
                const isActive = hasChildren
                  ? isChildActive || isMenuOpen
                  : Boolean(item.path && (currentPath === item.path || currentPath.startsWith(item.path + "/") || currentPath === item.path));

                // Collapsed: icon-only with tooltip
                if (isCollapsed) {
                  if (hasChildren) {
                    return (
                      <div key={item.name} className="relative group">
                        <button
                          type="button"
                          onClick={() => onToggleMenu(item.name)}
                          aria-expanded={isMenuOpen}
                          aria-label={item.name}
                          className={`w-full h-9 flex items-center justify-center rounded-[6px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/30 ${isActive || isMenuOpen ? "bg-[#F3F3F5] text-[#111827]" : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]"}`}
                        >
                          <item.icon />
                          {item.badge !== undefined && (
                            <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full bg-[#EDE9FE] text-[#7C3AED] text-[10px] font-semibold leading-none">
                              {item.badge}
                            </span>
                          )}
                        </button>
                        {/* tooltip */}
                        <span
                          role="tooltip"
                          className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[6px] bg-[#1F2937] px-2.5 py-1.5 text-[12px] font-medium text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shadow-lg z-20"
                        >
                          {item.name}
                        </span>
                        {/* children popover when open in collapsed */}
                        {isMenuOpen && (
                          <div className="absolute left-[calc(100%+10px)] top-9 z-20 w-[200px] rounded-[10px] border border-[#E5E5E5] bg-white p-2 shadow-xl">
                            <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF]">{item.name}</p>
                            {item.children!.map((child) => {
                              const childActive = currentPath === child.path || currentPath.startsWith(child.path + "/");
                              return (
                                <Link
                                  key={child.name}
                                  to={child.path}
                                  className={`flex h-8 items-center rounded-[6px] px-3 text-[14px] transition-colors ${childActive ? "bg-[#F3F3F5] text-[#111827] font-medium" : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]"}`}
                                >
                                  {child.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div key={item.name} className="relative group">
                      <Link
                        to={item.path ?? "#"}
                        aria-label={item.name}
                        aria-current={isActive ? "page" : undefined}
                        className={`h-9 flex items-center justify-center rounded-[6px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/30 ${isActive ? "bg-[#F3F3F5] text-[#111827]" : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]"}`}
                      >
                        <item.icon />
                        {item.badge !== undefined && (
                          <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full bg-[#EDE9FE] text-[#7C3AED] text-[10px] font-semibold leading-none">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                      <span
                        role="tooltip"
                        className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[6px] bg-[#1F2937] px-2.5 py-1.5 text-[12px] font-medium text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shadow-lg z-20"
                      >
                        {item.name}
                      </span>
                    </div>
                  );
                }

                // Expanded
                if (hasChildren) {
                  return (
                    <div key={item.name}>
                      <button
                        type="button"
                        onClick={() => onToggleMenu(item.name)}
                        aria-expanded={isMenuOpen}
                        className={`w-full h-9 flex items-center gap-3 rounded-[6px] px-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/30 ${isActive || isMenuOpen ? "bg-[#F3F3F5] text-[#111827]" : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]"}`}
                      >
                        <span className={`shrink-0 [&_svg]:h-5 [&_svg]:w-5 ${isActive || isMenuOpen ? "text-[#111827]" : "text-[#9CA3AF]"}`}>
                          <item.icon />
                        </span>
                        <span className={`flex-1 truncate text-[14px] leading-none ${isActive || isMenuOpen ? "font-medium text-[#111827]" : "font-normal"}`}>{item.name}</span>
                        {item.badge !== undefined && (
                          <span className="shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-[#EDE9FE] text-[#7C3AED] text-[11px] font-semibold leading-none">
                            {item.badge}
                          </span>
                        )}
                        <span className={`shrink-0 text-[#9CA3AF] transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}>
                          <Icons.ChevronDown />
                        </span>
                      </button>
                      {isMenuOpen && (
                        <div className="mt-1 ml-3 pl-3 border-l border-[#E5E5E5]/80 space-y-0.5">
                          {item.children!.map((child) => {
                            const childActive = currentPath === child.path || currentPath.startsWith(child.path + "/");
                            return (
                              <Link
                                key={child.name}
                                to={child.path}
                                aria-current={childActive ? "page" : undefined}
                                className={`flex h-8 items-center rounded-[6px] px-3 text-[13px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/30 ${childActive ? "bg-[#F3F3F5] text-[#111827] font-medium" : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]"}`}
                              >
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.path ?? "#"}
                    aria-current={isActive ? "page" : undefined}
                    className={`h-9 flex items-center gap-3 rounded-[6px] px-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/30 ${isActive ? "bg-[#F3F3F5] text-[#111827]" : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]"}`}
                  >
                    <span className={`shrink-0 [&_svg]:h-5 [&_svg]:w-5 ${isActive ? "text-[#111827]" : "text-[#9CA3AF]"}`}>
                      <item.icon />
                    </span>
                    <span className={`flex-1 truncate text-[14px] leading-none ${isActive ? "font-medium text-[#111827]" : "font-normal"}`}>{item.name}</span>
                    {item.badge !== undefined && (
                      <span className="shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-[#EDE9FE] text-[#7C3AED] text-[11px] font-semibold leading-none">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Profile — pinned bottom */}
      <div className={`shrink-0 border-t border-[#E5E5E5] relative ${isCollapsed ? "p-2" : "p-3"}`}>
        <button
          type="button"
          onClick={onToggleProfile}
          aria-expanded={isProfileOpen}
          aria-haspopup="menu"
          className={`w-full flex items-center rounded-[10px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/30 hover:bg-[#F9FAFB] ${isCollapsed ? "justify-center p-1" : "gap-3 p-2"}`}
        >
          <span className="w-8 h-8 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-[12px] font-semibold shrink-0" aria-hidden>
            DR
          </span>
          {!isCollapsed && (
            <>
              <span className="flex-1 min-w-0 text-left">
                <span className="block truncate text-[13px] font-semibold leading-4 text-[#111827]">Dianne Russell</span>
                <span className="block truncate text-[11px] leading-4 text-[#9CA3AF]">dianne.russell@gmail.com</span>
              </span>
              <span className={`shrink-0 text-[#9CA3AF] transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}>
                <Icons.ChevronDown />
              </span>
            </>
          )}
        </button>

        {/* Dropdown */}
        {isProfileOpen && (
          <>
            <button type="button" aria-label="Close menu" onClick={onToggleProfile} className="fixed inset-0 z-10 cursor-default" tabIndex={-1} />
            <div
              role="menu"
              className={`absolute z-20 w-[240px] rounded-[12px] border border-[#E5E5E5] bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)] ${isCollapsed ? "left-[76px] bottom-2 ml-2" : "left-3 right-3 bottom-[calc(100%+8px)]"}`}
            >
              <div className={`flex items-center gap-3 px-3 py-2.5 ${isCollapsed ? "hidden" : ""}`}>
                <span className="w-9 h-9 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-[12px] font-semibold shrink-0">DR</span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold text-[#111827]">Dianne Russell</span>
                  <span className="block truncate text-[11px] text-[#9CA3AF]">dianne.russell@gmail.com</span>
                </span>
              </div>
              <div className="my-1 h-px bg-[#E5E5E5]" role="separator" />
              <Link role="menuitem" to="#" className="flex h-9 items-center gap-3 rounded-[8px] px-3 text-[13px] text-[#374151] hover:bg-[#F3F3F5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/30">
                <Icons.User /> Profile
              </Link>
              <Link role="menuitem" to="#" className="flex h-9 items-center gap-3 rounded-[8px] px-3 text-[13px] text-[#374151] hover:bg-[#F3F3F5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/30">
                <Icons.Crown /> Upgrade to pro
              </Link>
              <Link role="menuitem" to="#" className="flex h-9 items-center gap-3 rounded-[8px] px-3 text-[13px] text-[#374151] hover:bg-[#F3F3F5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/30">
                <Icons.Settings /> Settings
              </Link>
              <div className="my-1 h-px bg-[#E5E5E5]" role="separator" />
              <button role="menuitem" type="button" className="w-full flex h-9 items-center gap-3 rounded-[8px] px-3 text-left text-[13px] text-[#374151] hover:bg-[#F3F3F5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/30">
                <Icons.Plus /> Add account
              </button>
              <button role="menuitem" type="button" className="w-full flex h-9 items-center gap-3 rounded-[8px] px-3 text-left text-[13px] text-[#374151] hover:bg-[#F3F3F5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/30">
                <Icons.LogOut /> Log out
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
