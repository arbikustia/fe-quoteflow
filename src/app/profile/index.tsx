import type { ReactElement } from "react";

import ResponsiveLayout from "../shared/ResponsiveLayout";

/**
 * Render profile page.
 * @returns {ReactElement} Profile page
 */
export default function ProfilePage(): ReactElement {
  return (
    <ResponsiveLayout pageTitle="Profile">
      <section className="min-h-96 rounded-2xl border border-border-default bg-background-surface" aria-label="Profile content" />
    </ResponsiveLayout>
  );
}
