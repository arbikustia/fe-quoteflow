import { renderHook, act } from "@/libs/unit-test";
import { useMasterUserContainerState, useMasterUserNavigation } from "./MasterUser.hook";
import type { UserData } from "./MasterUser.type";
import { useGetUsersQuery } from "@/services/master-user.service";
import * as ReactRouter from "react-router-dom";

jest.mock("@/services/master-user.service", () => ({
  useGetUsersQuery: jest.fn(() => ({ data: { data: [], total_count: 0, total_pages: 1 }, isLoading: false, isError: false })),
  mapUser: jest.fn(),
}));

const mockUseGetUsersQuery = jest.mocked(useGetUsersQuery);

const mockUser: UserData = { id: "1", username: "admin1", email: null, role: "Admin", status: "active", createAt: "2024-01-01", createBy: "Admin" };

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

describe("useMasterUserNavigation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetUsersQuery.mockReturnValue({
      data: { status: true, messages: null, data: [], page_number: 1, page_size: 10, total_pages: 1, total_count: 0, has_previous: false, has_next: false },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });
  });

  it("returns navigation handlers", () => {
    const navigateMock = jest.fn();
    jest.mocked(ReactRouter.useNavigate).mockReturnValue(navigateMock);

    const { result } = renderHook(() => useMasterUserNavigation());
    
    act(() => result.current.goBack());
    expect(navigateMock).toHaveBeenNthCalledWith(1, -1);

    act(() => result.current.goCreate());
    expect(navigateMock).toHaveBeenNthCalledWith(2, "/master-user/create");

    act(() => result.current.goEdit(mockUser));
    expect(navigateMock).toHaveBeenNthCalledWith(3, `/master-user/edit/${mockUser.id}`, { state: { user: mockUser } });
  });
});

describe("useMasterUserContainerState", () => {
  it("initial state and handlers", () => {
    const navigateMock = jest.fn();
    jest.mocked(ReactRouter.useNavigate).mockReturnValue(navigateMock);

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
});
