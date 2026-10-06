import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useMasterUserContainerState, useMasterUserNavigation } from "./MasterUser.hook";
import type { UserData } from "./MasterUser.type";
import * as ReactRouter from "react-router-dom";
import { vi } from "vitest";

const mockUser: UserData = { id: "1", username: "admin1", role: "Admin", status: "active", createAt: "2024-01-01", createBy: "Admin" };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("useMasterUserNavigation", () => {
  it("returns navigation handlers", () => {
    const navigateMock = vi.fn();
    vi.mocked(ReactRouter.useNavigate).mockReturnValue(navigateMock);

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
    const navigateMock = vi.fn();
    vi.mocked(ReactRouter.useNavigate).mockReturnValue(navigateMock);

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
