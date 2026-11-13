import { render, screen } from "@/libs/unit-test";

import ReportOrderContainer from "./Report.container";

const mockPermission = jest.fn();

jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: (): { canView: boolean } => mockPermission() as { canView: boolean } }));
jest.mock("./Report.hook", () => ({
  useReportOrderNavigation: (): { goBack: () => void } => ({ goBack: jest.fn() }),
  useReportOrderPagination: (): Record<string, never> => ({}),
  useReportOrderExport: (): Record<string, never> => ({}),
  useReportOrderConfirm: (): Record<string, never> => ({}),
}));
jest.mock("./Report.component", () => ({ ReportOrderComponent: (): React.ReactElement => <div>Report rendered</div> }));

describe("ReportOrderContainer", () => {
  it("should render the module component when view is allowed", () => {
    mockPermission.mockReturnValue({ canView: true });
    render(<ReportOrderContainer />);

    expect(screen.getByText("Report rendered")).toBeInTheDocument();
  });

  it("should render nothing when view is denied", () => {
    mockPermission.mockReturnValue({ canView: false });
    render(<ReportOrderContainer />);

    expect(screen.queryByText("Report rendered")).toBeNull();
  });
});
