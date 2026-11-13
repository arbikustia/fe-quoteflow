import { MOCK_REPORT_ORDER, MOCK_REPORT_PROPS } from "@/fixture/report";
import { fireEvent, render, screen } from "@/libs/unit-test";

import { ReportOrderComponent } from "./Report.component";
import type { ReportOrderProps } from "./Report.type";

jest.mock("@/components/Pagination", () => ({
  Pagination: (): React.ReactElement => <div data-testid="pagination" />,
}));
jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="mock-layout">{children}</div>);

/**
 * Render the report component with optional prop overrides.
 * @param {Partial<ReportOrderProps>} [overrides] - Prop overrides
 * @returns {ReportOrderProps} - Props used for the render
 */
const renderComponent = (overrides: Partial<ReportOrderProps> = {}): ReportOrderProps => {
  const props = { ...MOCK_REPORT_PROPS, ...overrides };

  render(<ReportOrderComponent {...props} />);

  return props;
};

describe("ReportOrderComponent", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should export the order report from the button above the table", () => {
    const props = renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Export report" }));
    expect(props.onExport).toHaveBeenCalledTimes(1);
  });

  it("should show exporting label and disable the button while exporting", () => {
    renderComponent({ isExporting: true });

    expect(screen.getByRole("button", { name: "Export report" })).toBeDisabled();
    expect(screen.getByText("Exporting…")).toBeInTheDocument();
  });

  it("should render order rows with formatted dates", () => {
    renderComponent();

    expect(screen.getAllByText("ORDER-001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Arbi").length).toBeGreaterThan(0);
    expect(screen.getAllByText("31 Oktober 2026 06:00").length).toBeGreaterThan(0);
    expect(screen.queryByText("2026-10-31 06:00:00")).not.toBeInTheDocument();
  });

  it("should open the confirmation from the desktop action and the mobile card", () => {
    const props = renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Confirm order ORDER-001" }));
    expect(props.onEditStatus).toHaveBeenCalledWith(MOCK_REPORT_ORDER);

    const mobileCard = screen.getAllByRole("button").find((button) => button.textContent?.includes("Resepsi12"));

    fireEvent.click(mobileCard as HTMLElement);
    expect(props.onEditStatus).toHaveBeenCalledTimes(2);
  });

  it("should disable the action for orders that are already done", () => {
    renderComponent({ paginatedData: [{ ...MOCK_REPORT_ORDER, status: 2 }] });

    expect(screen.getByRole("button", { name: "Confirm order ORDER-001" })).toBeDisabled();
    expect(screen.getAllByText("Done").length).toBeGreaterThan(0);
  });

  it("should render the confirm modal and forward confirm and cancel", () => {
    const props = renderComponent({ confirmOrder: MOCK_REPORT_ORDER, confirmMessage: "Mark ORDER-001?" });

    expect(screen.getByText("Mark ORDER-001?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
    expect(props.onCancelConfirm).toHaveBeenCalled();
  });

  it("should forward search input to setSearchTerm", () => {
    const props = renderComponent();

    fireEvent.change(screen.getAllByPlaceholderText("Search order")[0], { target: { value: "abc" } });
    fireEvent.change(screen.getAllByPlaceholderText("Search order")[1], { target: { value: "def" } });
    expect(props.setSearchTerm).toHaveBeenCalledWith("abc");
    expect(props.setSearchTerm).toHaveBeenCalledWith("def");
  });

  it("should render loading skeletons", () => {
    renderComponent({ isLoading: true });

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    expect(screen.getAllByRole("status", { name: "Loading order report card" })).toHaveLength(5);
  });

  it("should render the empty state", () => {
    renderComponent({ isEmpty: true, paginatedData: [] });

    expect(screen.getAllByText("No orders found.").length).toBeGreaterThan(0);
  });

  it("should render the error and missing data states", () => {
    renderComponent({ errorMessage: "Unable to load orders.", paginatedData: [] });
    expect(screen.getAllByText("Unable to load orders.").length).toBeGreaterThan(0);
  });

  it("should render the missing data state", () => {
    renderComponent({ isMissingData: true, paginatedData: [] });
    expect(screen.getAllByText("Order data is unavailable. Please try again.").length).toBeGreaterThan(0);
  });
});
