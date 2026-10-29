import type { Dispatch, ElementType, SetStateAction } from "react";

export type NavigationChild = {
  name: string;
  path: string;
  icon: ElementType;
};

export type MasterNavigationItem = NavigationChild & {
  description: string;
};

export type NavigationItem = {
  name: string;
  path?: string;
  icon: ElementType;
  badge?: string | number;
  children?: NavigationChild[];
};

export type NavigationSection = {
  title: string;
  items: NavigationItem[];
};

export type SidebarState = {
  currentPath: string;
  openMenus: string[];
  onToggleMenu: (menuName: string) => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  isProfileOpen: boolean;
  onToggleProfile: () => void;
  onCloseProfile: () => void;
  setOpenMenus: Dispatch<SetStateAction<string[]>>;
};

export type SidebarContainerProps = {
  isCollapsed?: boolean;
};

export type SidebarProps = {
  navigation: NavigationItem[] | NavigationSection[];
  sections?: NavigationSection[];
  currentPath: string;
  openMenus: string[];
  onToggleMenu: (menuName: string) => void;
  isCollapsed: boolean;
  isProfileOpen: boolean;
  onToggleProfile: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onLogout: () => void;
};

export type SidebarNavigationProps = Pick<SidebarProps, "currentPath" | "openMenus" | "onToggleMenu" | "isCollapsed"> & {
  sections: NavigationSection[];
};

export type SidebarItemProps = Omit<SidebarNavigationProps, "sections"> & {
  item: NavigationItem;
};

export type SidebarProfileProps = Pick<SidebarProps, "isCollapsed" | "isProfileOpen" | "onToggleProfile" | "theme" | "onToggleTheme" | "onLogout"> & {
  displayName: string;
  initials: string;
};

export type SidebarLogoProps = Pick<SidebarProps, "isCollapsed" | "theme">;

export type SidebarRenderProps = SidebarProps & {
  displayName: string;
  initials: string;
  sections: NavigationSection[];
};

export type LogoutState = {
  isLogoutConfirmOpen: boolean;
  handleLogout: () => void;
  closeLogoutConfirm: () => void;
  confirmLogout: () => void;
};
