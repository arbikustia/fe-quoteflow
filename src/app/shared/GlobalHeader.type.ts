export type GlobalHeaderProps = {
  showCreateButton?: boolean;
  createEndpoint?: string;
};

export type MobileProfileHeaderState = {
  isDrawerOpen: boolean;
  isLogoutConfirmOpen: boolean;
  onOpenDrawer: () => void;
  onCloseDrawer: () => void;
  onOpenLogoutConfirm: () => void;
  onCloseLogoutConfirm: () => void;
  onConfirmLogout: () => void;
};
