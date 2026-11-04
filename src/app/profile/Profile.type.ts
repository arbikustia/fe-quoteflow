import type { Theme } from "../../store/theme.type";

export type ProfileProps = {
  username: string | null;
  theme: Theme;
  isLogoutConfirmOpen: boolean;
  canInstall?: boolean;
  onInstall?: () => void;
  onToggleTheme: () => void;
  onOpenLogoutConfirm: () => void;
  onCloseLogoutConfirm: () => void;
  onConfirmLogout: () => void;
};
