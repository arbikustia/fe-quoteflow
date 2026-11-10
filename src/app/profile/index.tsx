import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";
import { useGetAllRolesQuery } from "@/services/master-role.service";
import { useGetUsersQuery } from "@/services/master-user.service";

import { ProfileComponent } from "./Profile.component";
import { useMobileProfileHeaderState } from "../shared/GlobalHeader.hook";
import { findUserRole, getAccessTokenRoles, getUsername, isSuperadminRole, normalizeUserRoles } from "../../components/Sidebar/Sidebar.helpers";
import { useTheme } from "../../store/theme.hook";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;

window.addEventListener("beforeinstallprompt", (event: Event): void => {
  event.preventDefault();
  deferredInstallPrompt = event as BeforeInstallPromptEvent;
  window.dispatchEvent(new Event("quoteflow-install-available"));
});

window.addEventListener("appinstalled", (): void => {
  deferredInstallPrompt = null;
  window.dispatchEvent(new Event("quoteflow-app-installed"));
});

/**
 * Render profile page.
 * @returns {ReactElement} Profile page
 */
export default function ProfilePage(): ReactElement {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isLogoutConfirmOpen, onOpenLogoutConfirm, onCloseLogoutConfirm, onConfirmLogout } = useMobileProfileHeaderState();
  const username = getUsername();
  const { data: usersResponse } = useGetUsersQuery({
    PageNumber: 1,
    PageSize: 10,
    SearchTerm: username,
  }, { skip: !username });
  const { data: rolesResponse } = useGetAllRolesQuery();
  const role = findUserRole(usersResponse?.data ?? [], username);
  const userRoles = normalizeUserRoles(role);
  const canManagePermissions = isSuperadminRole([...getAccessTokenRoles(), ...userRoles], rolesResponse?.data ?? []);
  const [canInstall, setCanInstall] = useState(Boolean(deferredInstallPrompt));

  useEffect(() => {
    const onInstallAvailable = (): void => setCanInstall(true);
    const onAppInstalled = (): void => setCanInstall(false);

    window.addEventListener("quoteflow-install-available", onInstallAvailable);
    window.addEventListener("quoteflow-app-installed", onAppInstalled);

    return () => {
      window.removeEventListener("quoteflow-install-available", onInstallAvailable);
      window.removeEventListener("quoteflow-app-installed", onAppInstalled);
    };
  }, []);

  /** Navigate to permission management. */
  const handleOpenPermission = (): void => navigate("/permission");

  const handleInstall = async (): Promise<void> => {
    if (!deferredInstallPrompt) {
      window.alert("Untuk menginstall aplikasi, gunakan menu 'Install' atau 'Add to Home Screen' di browser Anda.");
      return;
    }
    await deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setCanInstall(false);
    }
  };

  return (
    <Layout pageTitle="Profile">
      <PageLayout
        title="Profile"
        subtitle="Manage your personal account settings and preferences."
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        showBackButton={false}
      >
        <div className="mb-8 lg:mb-10">
          <ProfileComponent
            username={username || null}
            theme={theme}
            isLogoutConfirmOpen={isLogoutConfirmOpen}
            canInstall={canInstall}
            canManagePermissions={canManagePermissions}
            onInstall={handleInstall}
            onOpenPermission={handleOpenPermission}
            onToggleTheme={toggleTheme}
            onOpenLogoutConfirm={onOpenLogoutConfirm}
            onCloseLogoutConfirm={onCloseLogoutConfirm}
            onConfirmLogout={onConfirmLogout}
          />
        </div>
      </PageLayout>
    </Layout>
  );
}
