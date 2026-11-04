import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import { ProfileComponent } from "./Profile.component";
import { useMobileProfileHeaderState } from "../shared/GlobalHeader.hook";
import { getUsername } from "../../components/Sidebar/Sidebar.helpers";
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
  const { theme, toggleTheme } = useTheme();
  const { isLogoutConfirmOpen, onOpenLogoutConfirm, onCloseLogoutConfirm, onConfirmLogout } = useMobileProfileHeaderState();
  const username = getUsername();
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
        <div className="relative mb-8 flex flex-col rounded-3xl border border-border-default bg-background-surface p-5 shadow-medium sm:p-6 lg:mb-10 lg:p-8">
          <ProfileComponent
            username={username || null}
            theme={theme}
            isLogoutConfirmOpen={isLogoutConfirmOpen}
            canInstall={canInstall}
            onInstall={handleInstall}
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
