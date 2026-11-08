import { act, renderHook } from "@/libs/unit-test";
import { useGetActivityLogsQuery } from "@/services/activity-log.service";
import { useActivityLogPagination } from "./ActivityLog.hook";
import type { ActivityLogData } from "./ActivityLog.type";

jest.mock("@/services/activity-log.service", () => ({
  useGetActivityLogsQuery: jest.fn(),
  mapActivityLog: (activityLog: ActivityLogData): ActivityLogData => activityLog,
}));

const mockedQuery = jest.mocked(useGetActivityLogsQuery);
const activities: ActivityLogData[] = [{ id: "1", userName: "Arbi", action: "view", page: "Order", description: "Viewed order", createdAt: "2026-11-01" }];

describe("useActivityLogPagination", () => {
  beforeEach(() => {
    mockedQuery.mockReturnValue({ data: { status: true, data: [], messages: [], page_number: 1, total_pages: 1, page_size: 10, total_count: 1, has_previous: false, has_next: false }, isLoading: false, error: undefined, isFetching: false, isSuccess: true, isError: false } as never);
  });

  it("should expose activity data and update pagination", () => {
    mockedQuery.mockReturnValue({ data: { status: true, data: activities, messages: [], page_number: 1, total_pages: 1, page_size: 10, total_count: 1, has_previous: false, has_next: false }, isLoading: false, error: undefined, isFetching: false, isSuccess: true, isError: false } as never);
    const { result } = renderHook(() => useActivityLogPagination());
    expect(result.current.paginatedData).toEqual(activities);
    act(() => result.current.changePageSize(20));
    expect(result.current.pageSize).toBe(20);
    expect(result.current.currentPage).toBe(1);
  });

  it("should expose query error", () => {
    mockedQuery.mockReturnValue({ data: undefined, isLoading: false, error: { status: 500 }, isFetching: false, isSuccess: false, isError: true } as never);
    const { result } = renderHook(() => useActivityLogPagination());
    expect(result.current.errorMessage).toBe("Unable to load activity logs.");
  });
});
