import test from "@/libs/unit-test";

import ActivityLogContainer from "./ActivityLog.container";
import type { ActivityLogNavigation, ActivityLogPagination } from "./ActivityLog.type";

jest.mock("@/hooks/usePagePermission", () => ({
  usePagePermission: (): { canView: boolean } => ({ canView: true }),
}));
jest.mock("./ActivityLog.hook", () => ({
  useActivityLogPagination: (): ActivityLogPagination => ({ paginatedData: [], isLoading: false, errorMessage: null, currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0, isEmpty: true, setSearchTerm: jest.fn(), goToPage: jest.fn(), changePageSize: jest.fn() }),
  useActivityLogNavigation: (): ActivityLogNavigation => ({ onBack: jest.fn() }),
}));
jest.mock("./ActivityLog.component", () => ({
  /** Render activity log component test double. */
  ActivityLogComponent: (): React.ReactElement => <div>ActivityLog rendered</div>,
}));

describe("ActivityLogContainer snapshot", () => {
  test.assertSnapshots(ActivityLogContainer, [{ props: {}, desc: "should render activity log component" }]);
});
