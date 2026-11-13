import type * as React from "react";

import { render, screen } from "@/libs/unit-test";

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
  default: (props: { voucherCount: number }): React.ReactElement => <div>vouchers {props.voucherCount}</div>,
}));

describe("DashboardContainer", (): void => {
  it("should map hook state to the component props", (): void => {
    render(<DashboardContainer />);

    expect(screen.getByText("vouchers 2")).not.toBeNull();
  });
});
