import type * as React from "react";

import { fireEvent, render, screen } from "@/libs/unit-test";

import DashboardComponent, { _renderDesktop, _renderMenuItem, _renderMobile } from "./Dashboard.component";
import { DASHBOARD_MENU_ITEMS } from "./Dashboard.config";
import type { DashboardProps } from "./Dashboard.type";

jest.mock("@/app/shared/ResponsiveLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>,
}));
jest.mock("@/components/Calendar", () => ({ CalendarComponent: (): string => "calendar" }));

const props: DashboardProps = {
  isLoading: false,
  voucherCount: 3,
  menuItems: DASHBOARD_MENU_ITEMS,
  overview: { isLoading: false, counts: { quotation: 1500, invoice: 2, payment: 3, voucher: 4 } },
  calendar: { isLoading: false, events: [] },
  orderState: { isLoading: false, isError: false, chartData: [{ label: "12 Nov", count: 1 }, { label: "13 Nov", count: 2 }] },
  onNavigate: jest.fn(),
};

describe("DashboardComponent", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("should render the skeleton while loading", (): void => {
    render(<DashboardComponent {...props} isLoading />);

    expect(screen.getAllByRole("status", { name: "Loading dashboard" })).toHaveLength(2);
  });

  it("should render desktop metrics and chart range", (): void => {
    render(_renderDesktop(props));

    expect(screen.getByText("1.500")).not.toBeNull();
    expect(screen.getByText("12 Nov - 13 Nov")).not.toBeNull();
  });

  it("should render dashes while overview loads and hide the range without data", (): void => {
    render(_renderDesktop({ ...props, overview: { ...props.overview, isLoading: true }, orderState: { isLoading: true, isError: false, chartData: [] } }));

    expect(screen.getAllByText("-")).toHaveLength(4);
    expect(screen.queryByText(/12 Nov/)).toBeNull();
  });

  it("should call onSelect with the item when a menu tile is pressed", (): void => {
    const onSelect = jest.fn();

    render(_renderMenuItem(DASHBOARD_MENU_ITEMS[0], onSelect));
    fireEvent.click(screen.getByRole("button", { name: "Open Create Order" }));

    expect(onSelect).toHaveBeenCalledWith(DASHBOARD_MENU_ITEMS[0]);
  });

  it("should navigate to the item route from the mobile menu", (): void => {
    render(_renderMobile(props));
    fireEvent.click(screen.getByRole("button", { name: "Open Mail" }));

    expect(props.onNavigate).toHaveBeenCalledWith("/mail");
  });

  it("should render desktop and mobile blocks when loaded", (): void => {
    render(<DashboardComponent {...props} />);

    expect(screen.getByText("Dashboard")).not.toBeNull();
    expect(screen.getByText("Bikin Customer Puas Maksimal dengan 3 Voucher Aktif")).not.toBeNull();
  });
});
