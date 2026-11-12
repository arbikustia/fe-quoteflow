import { act, renderHook } from "@/libs/unit-test";
import { useGetActivityLogsQuery } from "@/services/activity-log.service";
import { useActivityLogNavigation, useActivityLogPagination } from "./ActivityLog.hook";
import type { ActivityLogData } from "./ActivityLog.type";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({ useNavigate: (): jest.Mock => mockNavigate }));
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

describe("useActivityLogPagination state", () => {
  it("should clamp page, reset on search and expose api error message", () => {
    mockedQuery.mockReturnValue({ data: { status: false, data: [], messages: ["Denied"], total_pages: 3, total_count: 0 }, isLoading: false, error: undefined } as never);
    const { result } = renderHook(() => useActivityLogPagination());
    act(() => result.current.goToPage(99));
    expect(result.current.currentPage).toBe(3);
    act(() => result.current.setSearchTerm("abc"));
    expect(result.current.currentPage).toBe(1);
    expect(result.current.errorMessage).toBe("Denied");
  });

  it("should fall back to default message when api gives none", () => {
    mockedQuery.mockReturnValue({ data: { status: false, data: [], messages: [] }, isLoading: false, error: undefined } as never);
    const { result } = renderHook(() => useActivityLogPagination());
    expect(result.current.errorMessage).toBe("Activity log data is unavailable.");
  });
});

describe("useActivityLogNavigation", () => {
  it("should navigate back", () => {
    const { result } = renderHook(() => useActivityLogNavigation());
    result.current.onBack();
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
