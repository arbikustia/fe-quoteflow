import { MOCK_REPORT_PROPS } from "@/fixture/report";
import test from "@/libs/unit-test";

import { ReportOrderComponent } from "./Report.component";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="mock-layout">{children}</div>);

describe("ReportOrderComponent snapshot", () => {
  test.assertSnapshots(ReportOrderComponent, [
    { props: MOCK_REPORT_PROPS, desc: "should render order report list" },
    { props: { ...MOCK_REPORT_PROPS, isLoading: true }, desc: "should render order report list while loading" },
  ]);
});
