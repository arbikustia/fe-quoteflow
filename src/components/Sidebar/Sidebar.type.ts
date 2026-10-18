import type { Dispatch, ReactNode, SetStateAction } from "react";

export type NavigationChild = {
  readonly name: string;
  readonly path: string;
};

export type MasterNavigationItem = NavigationChild & {
  readonly description: string;
  readonly icon: () => ReactNode;
};

export type NavigationItem = {
  readonly name: string;
  readonly path?: string;
  readonly icon: () => ReactNode;
  readonly badge?: string | number;
  readonly children?: readonly NavigationChild[];
};

export type NavigationSection = {
  readonly title: string;
  readonly items: readonly NavigationItem[];
};

export type SidebarState = {
  readonly currentPath: string;
  readonly openMenus: readonly string[];
  readonly onToggleMenu: (menuName: string) => void;
  readonly isCollapsed: boolean;
  readonly onToggleCollapsed: () => void;
  readonly isProfileOpen: boolean;
  readonly onToggleProfile: () => void;
  readonly onCloseProfile: () => void;
  readonly setOpenMenus: Dispatch<SetStateAction<readonly string[]>>;
};

export type SidebarContainerProps = {
  readonly isCollapsed?: boolean;
};

export type SidebarProps = {
  readonly navigation: readonly NavigationItem[] | readonly NavigationSection[];
  readonly sections?: readonly NavigationSection[];
  readonly currentPath: string;
  readonly openMenus: readonly string[];
  readonly onToggleMenu: (menuName: string) => void;
  readonly isCollapsed: boolean;
  readonly isProfileOpen: boolean;
  readonly onToggleProfile: () => void;
  readonly theme: "light" | "dark";
  readonly onToggleTheme: () => void;
  readonly onLogout: () => void;
};

export type SidebarNavigationProps = Pick<SidebarProps, "currentPath" | "openMenus" | "onToggleMenu" | "isCollapsed"> & {
  readonly sections: readonly NavigationSection[];
};

export type SidebarItemProps = Omit<SidebarNavigationProps, "sections"> & {
  readonly item: NavigationItem;
};

export type SidebarProfileProps = Pick<SidebarProps, "isCollapsed" | "isProfileOpen" | "onToggleProfile" | "theme" | "onToggleTheme" | "onLogout"> & {
  readonly displayName: string;
  readonly initials: string;
};

export type SidebarLogoProps = Pick<SidebarProps, "isCollapsed" | "theme">;

export type SidebarRenderProps = SidebarProps & {
  readonly displayName: string;
  readonly initials: string;
  readonly sections: readonly NavigationSection[];
};

export type LogoutState = {
  readonly isLogoutConfirmOpen: boolean;
  readonly handleLogout: () => void;
  readonly closeLogoutConfirm: () => void;
  readonly confirmLogout: () => void;
};
