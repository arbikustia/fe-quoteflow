import { renderHook, act } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { useMasterRoleContainerState, useMasterRoleNavigation } from "./MasterRole.hook";

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

const mockNavigate = jest.fn();

describe("MasterRole Navigation Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as ReturnType<typeof jest.fn>).mockReturnValue(mockNavigate);
  });

  it("should provide navigation functions", () => {
    const { result } = renderHook(() => useMasterRoleNavigation(), { wrapper: MemoryRouter });
    expect(result.current).toHaveProperty("goBack");
    expect(result.current).toHaveProperty("goCreate");
    expect(result.current).toHaveProperty("goEdit");
    expect(result.current).toHaveProperty("goDetail");
  });

  it("should trigger correct navigation paths", () => {
    const { result } = renderHook(() => useMasterRoleNavigation(), { wrapper: MemoryRouter });
    
    act(() => result.current.goBack());
    expect(mockNavigate).toHaveBeenCalledWith(-1);

    act(() => result.current.goCreate());
    expect(mockNavigate).toHaveBeenCalledWith("/master-role/create");

    act(() => result.current.goEdit({ id: "1" } as any));
    expect(mockNavigate).toHaveBeenCalledWith("/master-role/edit/1");

    act(() => result.current.goDetail({ id: "2" } as any));
    expect(mockNavigate).toHaveBeenCalledWith("/master-role/detail/2");
  });
});

describe("MasterRole Container State Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should provide container state", () => {
    const { result } = renderHook(() => useMasterRoleContainerState(), { wrapper: MemoryRouter });
    expect(result.current).toHaveProperty("pagination");
    expect(result.current.pagination).toHaveProperty("paginatedData");
    expect(result.current).toHaveProperty("isMoreOpen");
  });

  it("should toggle more menu", () => {
    const { result } = renderHook(() => useMasterRoleContainerState(), { wrapper: MemoryRouter });
    expect(result.current.isMoreOpen).toBe(false);

    act(() => result.current.toggleMore());
    expect(result.current.isMoreOpen).toBe(true);

    act(() => result.current.handleCloseMore());
    expect(result.current.isMoreOpen).toBe(false);
  });

  it("should handle delete action", () => {
    const { result } = renderHook(() => useMasterRoleContainerState(), { wrapper: MemoryRouter });
    act(() => result.current.toggleMore());
    expect(result.current.isMoreOpen).toBe(true);

    act(() => result.current.goDelete());
    expect(result.current.isMoreOpen).toBe(false);
  });
});
