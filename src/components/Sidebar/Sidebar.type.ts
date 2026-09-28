import type { ReactNode } from "react";

export type NavigationChild = {
  name: string;
  path: string;
};

export type NavigationItem = {
  name: string;
  path?: string;
  icon: () => ReactNode;
  children?: NavigationChild[];
};

export type SidebarProps = {
  navigation: NavigationItem[];
  currentPath: string;
  openMenus: string[];
  onToggleMenu: (menuName: string) => void;
};
