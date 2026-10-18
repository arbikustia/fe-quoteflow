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
