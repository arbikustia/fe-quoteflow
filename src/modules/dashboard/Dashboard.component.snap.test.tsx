import type * as React from "react";

import test from "@/libs/unit-test";

import DashboardComponent from "./Dashboard.component";
import { DASHBOARD_MENU_ITEMS } from "./Dashboard.config";
import type { DashboardProps } from "./Dashboard.type";

jest.mock("@/app/shared/ResponsiveLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>,
}));
jest.mock("@/components/Calendar", () => ({ CalendarComponent: (): string => "calendar" }));

const baseProps: DashboardProps = {
  isLoading: false,
  voucherCount: 3,
  menuItems: DASHBOARD_MENU_ITEMS,
  overview: { isLoading: false, counts: { quotation: 10, invoice: 5, payment: 2, voucher: 1 } },
  calendar: { isLoading: false, events: [] },
  orderState: { isLoading: false, isError: false, chartData: [{ label: "12 Nov", count: 1 }, { label: "13 Nov", count: 2 }] },
  onNavigate: jest.fn(),
};

describe("DashboardComponent snapshot", (): void => {
  test.assertSnapshots(DashboardComponent, [
    { props: baseProps, desc: "should render the loaded dashboard" },
    { props: { ...baseProps, isLoading: true }, desc: "should render the loading skeleton" },
    { props: { ...baseProps, voucherCount: null, orderState: { isLoading: false, isError: true, chartData: [] } }, desc: "should render the chart error state" },
  ]);
});
