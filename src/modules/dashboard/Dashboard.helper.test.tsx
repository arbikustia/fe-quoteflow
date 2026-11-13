import { fireEvent, render, screen } from "@/libs/unit-test";

import { DASHBOARD_MENU_ITEMS } from "./Dashboard.config";
import { formatCount, renderCalendarPreview, renderDashboardSkeleton, renderDesktopOrderChart, renderMenuIcon, renderMetricIcon, renderMobileOrderChart, renderVoucherBanner } from "./Dashboard.helper";
import type { DashboardOrderState } from "./Dashboard.type";

jest.mock("@/components/Calendar", () => ({ CalendarComponent: (): string => "calendar" }));

const chartState: DashboardOrderState = { isLoading: false, isError: false, chartData: [{ label: "12 Nov", count: 2 }, { label: "13 Nov", count: 0 }] };

describe("Dashboard.helper", (): void => {
  it("should format counts with id-ID separators", (): void => {
    expect(formatCount(1500)).toBe("1.500");
  });

  it("should render metric and menu icons", (): void => {
    expect(renderMetricIcon("quotation")).not.toBeNull();

    const { container } = render(renderMenuIcon(DASHBOARD_MENU_ITEMS[0]));

    expect(container.querySelector("img")).not.toBeNull();
  });

  it.each([
    ["desktop", renderDesktopOrderChart],
    ["mobile", renderMobileOrderChart],
  ])("should render %s chart loading, error and data states", (_name, renderChart): void => {
    const loading = render(renderChart({ ...chartState, isLoading: true }));

    expect(screen.getByRole("status")).not.toBeNull();
    loading.unmount();

    const failed = render(renderChart({ ...chartState, isError: true }));

    expect(screen.getByText("Rental order performance unavailable.")).not.toBeNull();
    failed.unmount();

    render(renderChart(chartState));

    expect(screen.getByText("2 orders")).not.toBeNull();
    expect(screen.getByText("12 Nov")).not.toBeNull();
  });

  it("should open the calendar on click and keyboard", (): void => {
    const onNavigate = jest.fn();

    render(renderCalendarPreview({ isLoading: false, events: [] }, onNavigate));

    const button = screen.getByRole("button", { name: "Open calendar" });

    fireEvent.click(button);
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.keyDown(button, { key: "a" });

    expect(onNavigate).toHaveBeenCalledTimes(2);
    expect(onNavigate).toHaveBeenCalledWith("/calendar");
  });

  it("should render voucher banner headline for known and unknown counts", (): void => {
    const onNavigate = jest.fn();
    const known = render(renderVoucherBanner(5, onNavigate));

    expect(screen.getByText("Bikin Customer Puas Maksimal dengan 5 Voucher Aktif")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Lihat voucher promo" }));
    expect(onNavigate).toHaveBeenCalledWith("/master-voucher");
    known.unmount();

    render(renderVoucherBanner(null, onNavigate));

    expect(screen.getByText("Bikin Customer Puas Maksimal dengan Voucher Pilihan")).not.toBeNull();
  });

  it("should render skeleton with one mobile tile per menu item", (): void => {
    render(renderDashboardSkeleton(DASHBOARD_MENU_ITEMS));

    expect(screen.getAllByRole("status")).toHaveLength(2);
  });
});
