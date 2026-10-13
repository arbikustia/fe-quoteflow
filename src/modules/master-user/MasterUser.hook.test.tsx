import { renderHook, act } from "@testing-library/react";
import { useGetUsersQuery } from "./MasterUser.api";
import {
  _deriveUserListState,
  useMasterUserContainerState,
  useMasterUserNavigation,
} from "./MasterUser.hook";

jest.mock("./MasterUser.api", () => ({
  _mapUser: (user: { readonly id: string; readonly username: string; readonly last_created: string | null }) => ({
    id: user.id,
    username: user.username,
    role: null,
    status: null,
    createAt: user.last_created,
    createBy: null,
  }),
  useGetUsersQuery: jest.fn(() => ({ data: undefined, error: undefined, isLoading: false })),
}));
import type { UserData } from "./MasterUser.type";
import * as ReactRouter from "react-router-dom";

const mockUser: UserData = { id: "1", username: "admin1", role: "Admin", status: "active", createAt: "2024-01-01", createBy: "Admin" };

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

describe("useMasterUserNavigation", () => {
  it("returns navigation handlers", () => {
    const navigateMock = jest.fn();
    jest.mocked(ReactRouter.useNavigate).mockReturnValue(navigateMock);

    const { result } = renderHook(() => useMasterUserNavigation());
    
    act(() => result.current.goBack());
    expect(navigateMock).toHaveBeenCalledWith(-1);

    act(() => result.current.goCreate());
    expect(navigateMock).toHaveBeenCalledWith("/master-user/create");

    act(() => result.current.goEdit(mockUser));
    expect(navigateMock).toHaveBeenCalledWith(`/master-user/edit/${mockUser.id}`);

    act(() => result.current.goDetail(mockUser));
    expect(navigateMock).toHaveBeenCalledWith(`/master-user/detail/${mockUser.id}`);
  });
});

describe("_deriveUserListState", () => {
  it("should derive loading state", () => {
    const result = _deriveUserListState({ data: undefined, error: undefined, isLoading: true } as ReturnType<typeof useGetUsersQuery>);

    expect(result.isLoading).toBe(true);
    expect(result.paginatedData).toEqual([]);
  });

  it("should derive transport error state", () => {
    const result = _deriveUserListState({ data: undefined, error: { status: 500, data: "Server error" }, isLoading: false } as ReturnType<typeof useGetUsersQuery>);

    expect(result.errorMessage).toBe("Unable to load users.");
    expect(result.isMissingData).toBe(false);
  });

  it("should derive failed envelope state", () => {
    const result = _deriveUserListState({ data: { status: false, messages: null, data: null }, error: undefined, isLoading: false } as ReturnType<typeof useGetUsersQuery>);

    expect(result.errorMessage).toBe("Unable to load users.");
    expect(result.isMissingData).toBe(false);
  });

  it("should derive missing response state", () => {
    const result = _deriveUserListState({ data: undefined, error: undefined, isLoading: false } as ReturnType<typeof useGetUsersQuery>);

    expect(result.errorMessage).toBe("No response received from server.");
    expect(result.isMissingData).toBe(true);
  });

  it("should derive missing payload state", () => {
    const result = _deriveUserListState({ data: { status: true, messages: null, data: null }, error: undefined, isLoading: false } as ReturnType<typeof useGetUsersQuery>);

    expect(result.errorMessage).toBe("Response is missing data payload.");
    expect(result.isMissingData).toBe(true);
  });

  it("should derive success state", () => {
    const result = _deriveUserListState({
      data: {
        status: true,
        messages: null,
        data: {
          data: [{ id: "1", username: "admin", password: "secret", email: "admin@example.com", last_created: "2026-10-13" }],
          page_number: 1,
          total_pages: 2,
          total_count: 1,
          has_next: true,
          has_previous: false,
        },
      },
      error: undefined,
      isLoading: false,
    } as ReturnType<typeof useGetUsersQuery>);

    expect(result.paginatedData[0]).toEqual({ id: "1", username: "admin", role: null, status: null, createAt: "2026-10-13", createBy: null });
    expect(result.totalPages).toBe(2);
    expect(result.totalCount).toBe(1);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrevious).toBe(false);
  });
});

describe("useMasterUserContainerState", () => {
  it("initial state and handlers", () => {
    const navigateMock = jest.fn();
    jest.mocked(ReactRouter.useNavigate).mockReturnValue(navigateMock);
    jest.mocked(useGetUsersQuery).mockReturnValue({ data: undefined, error: undefined, isLoading: false } as ReturnType<typeof useGetUsersQuery>);

    const { result } = renderHook(() => useMasterUserContainerState());
    
    expect(result.current.isMoreOpen).toBe(false);

    act(() => result.current.toggleMore());
    expect(result.current.isMoreOpen).toBe(true);

    act(() => result.current.goDelete());
    expect(result.current.isMoreOpen).toBe(false);

    act(() => result.current.toggleMore());
    act(() => result.current.handleCloseMore());
    expect(result.current.isMoreOpen).toBe(false);
  });

  it("should expose success pagination and move pages", () => {
    jest.mocked(useGetUsersQuery).mockReturnValue({
      data: {
        status: true,
        messages: null,
        data: {
          data: [{ id: "1", username: "admin", password: "secret", email: "admin@example.com", last_created: "2026-10-13" }],
          page_number: 1,
          total_pages: 2,
          total_count: 1,
          has_next: true,
          has_previous: true,
        },
      },
      error: undefined,
      isLoading: false,
    } as ReturnType<typeof useGetUsersQuery>);

    const { result } = renderHook(() => useMasterUserContainerState());

    expect(result.current.pagination.paginatedData).toHaveLength(1);
    expect(result.current.pagination.isEmpty).toBe(false);

    act(() => result.current.pagination.nextPage());
    expect(result.current.pagination.currentPage).toBe(2);

    act(() => result.current.pagination.prevPage());
    expect(result.current.pagination.currentPage).toBe(1);

    act(() => result.current.pagination.changePageSize(5));
    expect(result.current.pagination.pageSize).toBe(5);
  });
});
