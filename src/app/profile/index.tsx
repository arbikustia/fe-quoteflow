import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import { ProfileComponent } from "./Profile.component";
import { useMobileProfileHeaderState } from "../shared/GlobalHeader.hook";
import { getUsername } from "../../components/Sidebar/Sidebar.helpers";
import { useTheme } from "../../store/theme.hook";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

/**
 * Render profile page.
 * @returns {ReactElement} Profile page
 */
export default function ProfilePage(): ReactElement {
  const { theme, toggleTheme } = useTheme();
  const { isLogoutConfirmOpen, onOpenLogoutConfirm, onCloseLogoutConfirm, onConfirmLogout } = useMobileProfileHeaderState();
  const username = getUsername();
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event): void => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async (): Promise<void> => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstallPrompt(null);
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
            canInstall={Boolean(installPrompt)}
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
