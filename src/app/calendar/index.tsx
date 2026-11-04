import type { ReactElement } from "react";

import Layout from "../layout";
import CalendarContainer from "../../modules/calendar";

/**
 * Render calendar page.
 * @returns {ReactElement} Calendar page
 */
export default function CalendarPage(): ReactElement {
  return (
    <Layout pageTitle="Calendar">
      <CalendarContainer />
    </Layout>
  );
}
