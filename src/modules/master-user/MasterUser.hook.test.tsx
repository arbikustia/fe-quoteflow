import { renderHook, act } from "@testing-library/react";
import { useMasterUserContainerState, useMasterUserNavigation } from "./MasterUser.hook";
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
