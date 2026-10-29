import type { ReactElement } from "react";

import ResponsiveLayout from "../shared/ResponsiveLayout";

/**
 * Render calendar page.
 * @returns {ReactElement} Calendar page
 */
export default function CalendarPage(): ReactElement {
  return (
    <ResponsiveLayout pageTitle="Calendar">
      <section className="min-h-96 rounded-2xl border border-border-default bg-background-surface" aria-label="Calendar content" />
    </ResponsiveLayout>
  );
}
