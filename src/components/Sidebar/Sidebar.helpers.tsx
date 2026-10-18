import * as React from "react";
import { Link } from "react-router-dom";

import LogoCollapsed from "../../assets/logo.png";
import SoniclineDarkLogo from "../../assets/Sonicline-dark.png";
import SoniclineLightLogo from "../../assets/Sonicline-light.png";
import { Icons } from "../Icons";

import { isMenuItemActive, isNavigationChildActive } from "./Sidebar.helpers";
import type { NavigationChild, SidebarItemProps, SidebarLogoProps, SidebarNavigationProps, SidebarProfileProps, SidebarRenderProps } from "./Sidebar.type";

/**
 * Render item badge.
 * @param {string | number} [badge] - Badge value
 * @param {boolean} isCollapsed - Collapsed state
 * @returns {React.ReactNode} Badge node
 */
const _renderBadge = (badge: string | number | undefined, isCollapsed: boolean): React.ReactNode => {
  if (badge === undefined) {
    return null;
  }

  if (isCollapsed) {
    return (
      <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full bg-action-primary-subtle text-action-primary text-[10px] font-semibold leading-none">{badge}</span>
    );
  }

  return (
    <span className="shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-action-primary-subtle text-action-primary text-[11px] font-semibold leading-none">{badge}</span>
  );
};

/**
 * Render navigation children.
 * @param {readonly NavigationChild[]} [children] - Child items
 * @param {string} currentPath - Current path
 * @param {boolean} isCollapsed - Collapsed state
 * @returns {React.ReactNode} Child links
 */
const _renderChildren = (children: readonly NavigationChild[] | undefined, currentPath: string, isCollapsed: boolean): React.ReactNode => children?.map((child) => {
  const isActive = isNavigationChildActive(child.path, currentPath);
  const childClassName = isCollapsed
    ? "flex h-9 items-center rounded-[6px] px-3 text-base transition-colors"
    : "flex h-9 items-center rounded-[6px] px-3 text-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30";
  const ariaCurrent = !isCollapsed && isActive ? "page" : undefined;

  return (
    <Link
      key={child.name}
      to={child.path}
      aria-current={ariaCurrent}
      className={`${childClassName} ${isActive ? "bg-background-subtle text-text-primary font-medium" : "text-text-secondary hover:bg-background-elevated hover:text-text-primary"}`}
    >
      {child.name}
    </Link>
  );
});

/**
 * Render collapsed menu item.
 * @param {SidebarItemProps} props - Item properties
 * @returns {React.ReactElement} Menu item
 */
const _renderCollapsedMenu = (props: SidebarItemProps): React.ReactElement => {
  const { item, currentPath, openMenus, onToggleMenu } = props;
  const isMenuOpen = openMenus.includes(item.name);
  const isActive = isMenuItemActive(item, currentPath, openMenus);

  /**
   * Handle toggling collapsed menu.
   * @returns {void} No return value
   */
  const handleToggleMenu = (): void => onToggleMenu(item.name);

  return (
    <div key={item.name} className="relative group">
      <button type="button" onClick={handleToggleMenu} aria-expanded={isMenuOpen} aria-label={item.name} className={`w-full h-11 flex items-center justify-center rounded-[8px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ${isActive || isMenuOpen ? "bg-background-subtle text-text-primary" : "text-text-tertiary hover:bg-background-elevated hover:text-text-primary"}`}>
        <item.icon />
        {_renderBadge(item.badge, true)}
      </button>
      <span role="tooltip" className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[6px] bg-text-primary px-2.5 py-1.5 text-[15px] font-medium text-background-surface opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shadow-lg z-20">{item.name}</span>
      {isMenuOpen && (
        <div className="absolute left-[calc(100%+10px)] top-9 z-20 w-[200px] rounded-[10px] border border-border-default bg-background-surface p-2 shadow-xl">
          <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">{item.name}</p>
          {_renderChildren(item.children, currentPath, true)}
        </div>
      )}
    </div>
  );
};

/**
 * Render collapsed link item.
 * @param {SidebarItemProps} props - Item properties
 * @returns {React.ReactElement} Link item
 */
const _renderCollapsedLink = (props: SidebarItemProps): React.ReactElement => {
  const { item, currentPath, openMenus } = props;
  const isActive = isMenuItemActive(item, currentPath, openMenus);

  return (
    <div key={item.name} className="relative group">
      <Link to={item.path ?? "#"} aria-label={item.name} aria-current={isActive ? "page" : undefined} className={`h-9 flex items-center justify-center rounded-[6px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30 ${isActive ? "bg-background-subtle text-text-primary" : "text-text-secondary hover:bg-background-elevated hover:text-text-primary"}`}>
        <item.icon />
        {_renderBadge(item.badge, true)}
      </Link>
      <span role="tooltip" className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[6px] bg-text-primary px-2.5 py-1.5 text-[15px] font-medium text-background-surface opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shadow-lg z-20">{item.name}</span>
    </div>
  );
};

/**
 * Render expanded menu item.
 * @param {SidebarItemProps} props - Item properties
 * @returns {React.ReactElement} Menu item
 */
const _renderExpandedMenu = (props: SidebarItemProps): React.ReactElement => {
  const { item, currentPath, openMenus, onToggleMenu } = props;
  const isMenuOpen = openMenus.includes(item.name);
  const isActive = isMenuItemActive(item, currentPath, openMenus);

  /**
   * Handle toggling expanded menu.
   * @returns {void} No return value
   */
  const handleToggleMenu = (): void => onToggleMenu(item.name);

  return (
    <div key={item.name}>
      <button type="button" onClick={handleToggleMenu} aria-expanded={isMenuOpen} className={`w-full min-h-14 py-3 flex items-center gap-3 rounded-[8px] px-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30 ${isActive || isMenuOpen ? "bg-background-subtle text-text-primary" : "text-text-secondary hover:bg-background-elevated hover:text-text-primary"}`}>
        <span className={`shrink-0 [&_svg]:h-5 [&_svg]:w-5 ${isActive || isMenuOpen ? "text-text-primary" : "text-text-tertiary"}`}><item.icon /></span>
        <span className={`flex-1 truncate text-xl leading-none ${isActive || isMenuOpen ? "font-medium text-text-primary" : "font-normal"}`}>{item.name}</span>
        {_renderBadge(item.badge, false)}
        <span className={`shrink-0 text-text-tertiary transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}><Icons.ChevronDown /></span>
      </button>
      {isMenuOpen && <div className="mt-1 ml-3 pl-3 border-l border-border-default/80 space-y-0.5">{_renderChildren(item.children, currentPath, false)}</div>}
    </div>
  );
};

/**
 * Render expanded link item.
 * @param {SidebarItemProps} props - Item properties
 * @returns {React.ReactElement} Link item
 */
const _renderExpandedLink = (props: SidebarItemProps): React.ReactElement => {
  const { item, currentPath, openMenus } = props;
  const isActive = isMenuItemActive(item, currentPath, openMenus);

  return (
    <Link key={item.name} to={item.path ?? "#"} aria-current={isActive ? "page" : undefined} className={`h-9 flex items-center gap-3 rounded-[6px] px-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30 ${isActive ? "bg-background-subtle text-text-primary" : "text-text-secondary hover:bg-background-elevated hover:text-text-primary"}`}>
      <span className={`shrink-0 [&_svg]:h-5 [&_svg]:w-5 ${isActive ? "text-text-primary" : "text-text-tertiary"}`}><item.icon /></span>
      <span className={`flex-1 truncate text-lg leading-none ${isActive ? "font-medium text-text-primary" : "font-normal"}`}>{item.name}</span>
      {_renderBadge(item.badge, false)}
    </Link>
  );
};

/**
 * Render one navigation item.
 * @param {SidebarItemProps} props - Item properties
 * @returns {React.ReactElement} Navigation item
 */
const _renderItem = (props: SidebarItemProps): React.ReactElement => {
  const { item, isCollapsed } = props;
  const hasChildren = Boolean(item.children?.length);

  if (isCollapsed) {
    return hasChildren ? _renderCollapsedMenu(props) : _renderCollapsedLink(props);
  }

  return hasChildren ? _renderExpandedMenu(props) : _renderExpandedLink(props);
};

/**
 * Render navigation sections.
 * @param {SidebarNavigationProps} props - Navigation properties
 * @returns {React.ReactElement} Navigation element
 */
const _renderNavigation = (props: SidebarNavigationProps): React.ReactElement => {
  const { sections, isCollapsed, currentPath, openMenus, onToggleMenu } = props;

  return (
    <div className={`flex-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? "px-2" : "px-4"} space-y-5 scrollbar-thin`}>
      {sections.map((section) => (
        <div key={section.title}>
          {!isCollapsed && <p className="px-2 mb-2 text-[15px] font-semibold tracking-widest uppercase text-text-tertiary">{section.title}</p>}
          <nav aria-label={section.title} className="space-y-1">
            {section.items.map((item) => _renderItem({ item, isCollapsed, currentPath, openMenus, onToggleMenu }))}
          </nav>
        </div>
      ))}
    </div>
  );
};

/**
 * Render sidebar logo.
 * @param {SidebarLogoProps} props - Logo properties
 * @returns {React.ReactElement} Logo element
 */
const _renderLogo = (props: SidebarLogoProps): React.ReactElement => {
  const { isCollapsed, theme } = props;
  let logo = SoniclineLightLogo;

  if (isCollapsed) {
    logo = LogoCollapsed;
  } else if (theme === "light") {
    logo = SoniclineDarkLogo;
  }

  return (
    <div className={`h-[72px] mb-16 flex items-center shrink-0 ${isCollapsed ? "justify-center px-2" : "px-4"}`}>
      <img src={logo} alt="Sonicline" className={`${isCollapsed ? "h-11 w-11 rounded-[8px] object-contain" : "h-12 w-auto object-contain"}`} />
    </div>
  );
};

/**
 * Render profile dropdown menu.
 * @param {SidebarProfileProps} props - Profile properties
 * @returns {React.ReactElement} Profile menu
 */
const _renderProfileMenu = (props: SidebarProfileProps): React.ReactElement => {
  const { isCollapsed, onToggleProfile, displayName, initials } = props;

  return (
    <>
      <button type="button" aria-label="Close menu" onClick={onToggleProfile} className="fixed inset-0 z-10 cursor-default" tabIndex={-1} />
      <div role="menu" className={`absolute z-20 w-[240px] rounded-[12px] border border-border-default bg-background-surface p-2 shadow-medium ${isCollapsed ? "left-[76px] bottom-2 ml-2" : "left-3 right-3 bottom-[calc(100%+8px)]"}`}>
        <div className={`flex items-center gap-3 px-3 py-2.5 ${isCollapsed ? "hidden" : ""}`}>
          <span className="w-9 h-9 rounded-full bg-action-primary-subtle text-action-primary flex items-center justify-center text-[12px] font-semibold shrink-0">{initials}</span>
          <span className="min-w-0"><span className="block truncate text-[13px] font-semibold text-text-primary">{displayName}</span></span>
        </div>
        <div className="my-1 h-px bg-border-default" role="separator" />
        <Link role="menuitem" to="#" className="flex h-9 items-center gap-3 rounded-[8px] px-3 text-[13px] text-text-secondary hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30"><Icons.User /> Profile</Link>
        <Link role="menuitem" to="#" className="flex h-9 items-center gap-3 rounded-[8px] px-3 text-[13px] text-text-secondary hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30"><Icons.Crown /> Upgrade to pro</Link>
        <Link role="menuitem" to="#" className="flex h-9 items-center gap-3 rounded-[8px] px-3 text-[13px] text-text-secondary hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30"><Icons.Settings /> Settings</Link>
        <div className="my-1 h-px bg-border-default" role="separator" />
        <button role="menuitem" type="button" className="w-full flex h-9 items-center gap-3 rounded-[8px] px-3 text-left text-[13px] text-text-secondary hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30"><Icons.Plus /> Add account</button>
        <button role="menuitem" type="button" className="w-full flex h-9 items-center gap-3 rounded-[8px] px-3 text-left text-[13px] text-text-secondary hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30"><Icons.LogOut /> Log out</button>
      </div>
    </>
  );
};

/**
 * Render sidebar profile controls.
 * @param {SidebarProfileProps} props - Profile properties
 * @returns {React.ReactElement} Profile controls
 */
const _renderProfile = (props: SidebarProfileProps): React.ReactElement => {
  const { displayName, initials, isCollapsed, isProfileOpen, onToggleProfile, theme, onToggleTheme, onLogout } = props;

  return (
    <div className={`shrink-0 border-t border-border-default ${isCollapsed ? "p-2" : "p-3"}`}>
      <button type="button" role="switch" aria-checked={theme === "dark"} aria-label="Toggle dark theme" onClick={onToggleTheme} className={`mb-2 flex h-9 w-full items-center rounded-[8px] bg-background-subtle text-text-secondary transition-colors hover:bg-action-primary-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${isCollapsed ? "justify-center" : "gap-3 px-3"}`}>
        <span className="shrink-0" aria-hidden>{theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}</span>
        {!isCollapsed && <span className="flex-1 text-left text-[13px] font-medium">{theme === "dark" ? "Light theme" : "Dark theme"}</span>}
      </button>
      <button type="button" onClick={onLogout} aria-label="Log out" className={`mb-2 flex h-9 w-full items-center rounded-[8px] text-danger-strong transition-colors hover:bg-danger-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${isCollapsed ? "justify-center" : "gap-3 px-3"}`}>
        <span className="shrink-0" aria-hidden><Icons.LogOut /></span>
        {!isCollapsed && <span className="flex-1 text-left text-[13px] font-medium">Log out</span>}
      </button>
      <button type="button" onClick={onToggleProfile} aria-expanded={isProfileOpen} aria-haspopup="menu" className={`w-full flex items-center rounded-[10px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30 hover:bg-background-elevated ${isCollapsed ? "justify-center p-1" : "gap-3 p-2"}`}>
        <span className="w-8 h-8 rounded-full bg-action-primary-subtle text-action-primary flex items-center justify-center text-[12px] font-semibold shrink-0" aria-hidden>{initials}</span>
        {!isCollapsed && <><span className="flex-1 min-w-0 text-left"><span className="block truncate text-[13px] font-semibold leading-4 text-text-primary">{displayName}</span></span><span className={`shrink-0 text-text-tertiary transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}><Icons.ChevronDown /></span></>}
      </button>
      {isProfileOpen && _renderProfileMenu(props)}
    </div>
  );
};

/**
 * Render complete sidebar markup.
 * @param {SidebarRenderProps} props - Sidebar render properties
 * @returns {React.ReactElement} Sidebar element
 */
export const renderSidebar = (props: SidebarRenderProps): React.ReactElement => {
  const { isCollapsed, sections, currentPath, openMenus, onToggleMenu, displayName, initials, isProfileOpen, onToggleProfile, theme, onToggleTheme, onLogout } = props;

  return (
    <aside className={`${isCollapsed ? "w-[84px]" : "w-[290px]"} h-full min-h-0 self-stretch bg-sidebar-background border border-border-default flex flex-col shrink-0 overflow-hidden transition-[width] duration-[250ms] ease-in-out`} style={{ borderRadius: 0 }} aria-label="Sidebar">
      {_renderLogo({ isCollapsed, theme })}
      {_renderNavigation({ sections, isCollapsed, currentPath, openMenus, onToggleMenu })}
      {_renderProfile({ displayName, initials, isCollapsed, isProfileOpen, onToggleProfile, theme, onToggleTheme, onLogout })}
    </aside>
  );
};
