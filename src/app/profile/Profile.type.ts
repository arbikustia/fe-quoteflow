import type { Theme } from "../../store/theme.type";

export type ProfileProps = {
  username: string | null;
  theme: Theme;
  isLogoutConfirmOpen: boolean;
  onToggleTheme: () => void;
  onOpenLogoutConfirm: () => void;
  onCloseLogoutConfirm: () => void;
  onConfirmLogout: () => void;
};
