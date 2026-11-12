import test from "@/libs/unit-test";

import CalendarContainer from "./Calendar.container";
import type { CalendarPageState } from "./Calendar.type";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: (): jest.Mock => jest.fn(),
}));
jest.mock("./Calendar.hook", () => ({
  useCalendarQuotations: (): Partial<CalendarPageState> => ({ events: [] }),
}));
jest.mock("./Calendar.component", () => ({
  /** Render calendar component test double. */
  CalendarPageComponent: (): React.ReactElement => <div>Calendar rendered</div>,
}));

describe("CalendarContainer snapshot", () => {
  test.assertSnapshots(CalendarContainer, [{ props: {}, desc: "should render calendar component" }]);
});
