import { renderHook, act } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { vi } from "vitest";
import { useMasterProjectContainerState, useMasterProjectNavigation } from "./MasterProject.hook";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockNavigate = vi.fn();

describe("MasterProject Navigation Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  });

  it("should provide navigation functions", () => {
    const { result } = renderHook(() => useMasterProjectNavigation(), { wrapper: MemoryRouter });
    expect(result.current).toHaveProperty("goBack");
    expect(result.current).toHaveProperty("goCreate");
    expect(result.current).toHaveProperty("goEdit");
    expect(result.current).toHaveProperty("goDetail");
  });

  it("should trigger correct navigation paths", () => {
    const { result } = renderHook(() => useMasterProjectNavigation(), { wrapper: MemoryRouter });
    
    act(() => result.current.goBack());
    expect(mockNavigate).toHaveBeenCalledWith(-1);

    act(() => result.current.goCreate());
    expect(mockNavigate).toHaveBeenCalledWith("/master-project/create");

    act(() => result.current.goEdit({ id: "1" } as any));
    expect(mockNavigate).toHaveBeenCalledWith("/master-project/edit/1");

    act(() => result.current.goDetail({ id: "2" } as any));
    expect(mockNavigate).toHaveBeenCalledWith("/master-project/detail/2");
  });
});

describe("MasterProject Container State Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should provide container state", () => {
    const { result } = renderHook(() => useMasterProjectContainerState(), { wrapper: MemoryRouter });
    expect(result.current).toHaveProperty("pagination");
    expect(result.current.pagination).toHaveProperty("paginatedData");
    expect(result.current).toHaveProperty("isMoreOpen");
  });

  it("should toggle more menu", () => {
    const { result } = renderHook(() => useMasterProjectContainerState(), { wrapper: MemoryRouter });
    expect(result.current.isMoreOpen).toBe(false);

    act(() => result.current.toggleMore());
    expect(result.current.isMoreOpen).toBe(true);

    act(() => result.current.handleCloseMore());
    expect(result.current.isMoreOpen).toBe(false);
  });

  it("should handle delete action", () => {
    const { result } = renderHook(() => useMasterProjectContainerState(), { wrapper: MemoryRouter });
    act(() => result.current.toggleMore());
    expect(result.current.isMoreOpen).toBe(true);

    act(() => result.current.goDelete());
    expect(result.current.isMoreOpen).toBe(false);
  });
});
