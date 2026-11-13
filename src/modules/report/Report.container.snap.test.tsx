import test from "@/libs/unit-test";

import ReportOrderContainer from "./Report.container";

jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: (): { canView: boolean } => ({ canView: true }) }));
jest.mock("./Report.hook", () => ({
  useReportOrderNavigation: (): { goBack: () => void } => ({ goBack: jest.fn() }),
  useReportOrderPagination: (): Record<string, never> => ({}),
  useReportOrderExport: (): Record<string, never> => ({}),
  useReportOrderConfirm: (): Record<string, never> => ({}),
}));
jest.mock("./Report.component", () => ({ ReportOrderComponent: (): React.ReactElement => <div>Report rendered</div> }));

describe("ReportOrderContainer snapshot", () => {
  test.assertSnapshots(ReportOrderContainer, [{ props: {}, desc: "should render the module component" }]);
});
