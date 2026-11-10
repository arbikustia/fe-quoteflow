import type { Theme } from "../../store/theme.type";

export type ProfileProps = {
  username: string | null;
  theme: Theme;
  isLogoutConfirmOpen: boolean;
  canInstall?: boolean;
  canManagePermissions?: boolean;
  onInstall?: () => void;
  onOpenPermission?: () => void;
  onToggleTheme: () => void;
  onOpenLogoutConfirm: () => void;
  onCloseLogoutConfirm: () => void;
  onConfirmLogout: () => void;
};
