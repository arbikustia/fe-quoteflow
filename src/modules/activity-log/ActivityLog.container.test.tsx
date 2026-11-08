import React from "react";
import { render, screen } from "@/libs/unit-test";
import type { ActivityLogPagination } from "./ActivityLog.type";

const hookState: ActivityLogPagination = {
  paginatedData: [],
  isLoading: false,
  errorMessage: null,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  totalCount: 0,
  isEmpty: true,
  setSearchTerm: jest.fn(),
  goToPage: jest.fn(),
  changePageSize: jest.fn(),
};

jest.mock("./ActivityLog.hook", () => ({
  useActivityLogPagination: (): ActivityLogPagination => hookState,
  useActivityLogNavigation: (): { onBack: () => void } => ({ onBack: jest.fn() }),
}));
jest.mock("./ActivityLog.component", () => ({
  /** Render activity log component test double. */
  ActivityLogComponent: (): React.ReactElement => <div>Activity log content</div>,
}));

import ActivityLog from "./ActivityLog.container";

describe("ActivityLog container", () => {
  it("should render activity log component", () => {
    render(<ActivityLog />);
    expect(screen.getByText("Activity log content")).toBeInTheDocument();
  });
});
