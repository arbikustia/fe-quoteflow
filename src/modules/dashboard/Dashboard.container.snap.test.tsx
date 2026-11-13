import type * as React from "react";

import test from "@/libs/unit-test";

import DashboardContainer from "./Dashboard.container";

jest.mock("./Dashboard.hook", () => ({
  useDashboardNavigation: (): { navigateTo: jest.Mock } => ({ navigateTo: jest.fn() }),
  useDashboardAssetLoading: (): boolean => false,
  useDashboardVoucherCount: (): number => 2,
  useDashboardMenuItems: (): never[] => [],
  useDashboardOverview: (): { isLoading: boolean; counts: Record<string, number> } => ({ isLoading: false, counts: {} }),
  useDashboardCalendar: (): { isLoading: boolean; events: never[] } => ({ isLoading: false, events: [] }),
  useDashboardOrders: (): { isLoading: boolean; isError: boolean; chartData: never[] } => ({ isLoading: false, isError: false, chartData: [] }),
}));
jest.mock("./Dashboard.component", () => ({
  __esModule: true,
  default: (): React.ReactElement => <div>Dashboard rendered</div>,
}));

describe("DashboardContainer snapshot", (): void => {
  test.assertSnapshots(DashboardContainer, [{ props: {}, desc: "should render the dashboard component" }]);
});
