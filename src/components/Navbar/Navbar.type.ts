export type NavbarProps = {
  readonly pageTitle?: string;
  readonly isSidebarCollapsed: boolean;
  readonly onToggleSidebar: () => void;
  readonly currentTime?: string;
};
