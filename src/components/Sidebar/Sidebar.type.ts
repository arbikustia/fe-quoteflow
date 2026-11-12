import type { Dispatch, ElementType, SetStateAction } from "react";

export type RoleIdentity = {
  id: string;
  role: string;
  status: number;
};

export type UserRoleValue = string | string[] | null | undefined;

export type UserRoleIdentity = {
  username?: string | null;
  role?: UserRoleValue;
};

export type AccessTokenPayload = {
  role?: string | string[];
  roles?: string | string[];
  role_id?: string;
  roleId?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
};

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
  onLogout: () => void;
};

export type SidebarNavigationProps = Pick<SidebarProps, "currentPath" | "openMenus" | "onToggleMenu" | "isCollapsed"> & {
  sections: NavigationSection[];
};

export type SidebarItemProps = Omit<SidebarNavigationProps, "sections"> & {
  item: NavigationItem;
};

export type SidebarProfileProps = Pick<SidebarProps, "isCollapsed" | "onLogout"> & {
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
