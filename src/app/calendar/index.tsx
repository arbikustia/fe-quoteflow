import type { ReactElement } from "react";

import ResponsiveLayout from "../shared/ResponsiveLayout";
import CalendarContainer from "../../modules/calendar";

/**
 * Render calendar page.
 * @returns {ReactElement} Calendar page
 */
export default function CalendarPage(): ReactElement {
  return (
    <ResponsiveLayout>
      <CalendarContainer />
    </ResponsiveLayout>
  );
}
