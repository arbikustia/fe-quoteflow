import test from "@/libs/unit-test";

import { ActivityLogComponent } from "./ActivityLog.component";
import type { ActivityLogProps } from "./ActivityLog.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  /** Render test layout content. */
  default: ({ children }: React.PropsWithChildren): React.ReactElement => <div>{children}</div>,
}));

const props: ActivityLogProps = {
  currentPage: 1,
  totalPages: 2,
  pageSize: 10,
  totalCount: 15,
  paginatedData: [{ id: "act-1", userName: "John Doe", action: "create", page: "Quotation", description: "Created Quotation Q-001", createdAt: "2026-11-01T08:00:00" }],
  isLoading: false,
  errorMessage: null,
  isEmpty: false,
  setSearchTerm: jest.fn(),
  goToPage: jest.fn(),
  changePageSize: jest.fn(),
  onBack: jest.fn(),
};

describe("ActivityLogComponent snapshot", () => {
  test.assertSnapshots(ActivityLogComponent, [
    { props, desc: "should render with mock rows" },
    { props: { ...props, isLoading: true, paginatedData: [] }, desc: "should render responsive skeletons" },
    { props: { ...props, isEmpty: true, paginatedData: [] }, desc: "should render empty state" },
    { props: { ...props, errorMessage: "Network failure", paginatedData: [] }, desc: "should render error state" },
  ]);
});
