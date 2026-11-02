import type { ReactElement } from "react";

import { ProfileComponent } from "./Profile.component";
import { useMobileProfileHeaderState } from "../shared/GlobalHeader.hook";
import ResponsiveLayout from "../shared/ResponsiveLayout";
import { getUsername } from "../../components/Sidebar/Sidebar.helpers";
import { useTheme } from "../../store/theme.hook";

/**
 * Render profile page.
 * @returns {ReactElement} Profile page
 */
export default function ProfilePage(): ReactElement {
  const { theme, toggleTheme } = useTheme();
  const { isLogoutConfirmOpen, onOpenLogoutConfirm, onCloseLogoutConfirm, onConfirmLogout } = useMobileProfileHeaderState();
  const username = getUsername();

  return (
    <ResponsiveLayout pageTitle="Profile">
      <ProfileComponent username={username || null} theme={theme} isLogoutConfirmOpen={isLogoutConfirmOpen} onToggleTheme={toggleTheme} onOpenLogoutConfirm={onOpenLogoutConfirm} onCloseLogoutConfirm={onCloseLogoutConfirm} onConfirmLogout={onConfirmLogout} />
    </ResponsiveLayout>
  );
}
