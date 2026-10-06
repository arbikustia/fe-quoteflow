import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMasterPicNavigation, useMasterPicContainerState } from "./MasterPic.hook";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("MasterPic hook", () => {
  describe("useMasterPicNavigation", () => {
    it("should handle navigation correctly", () => {
      const { result } = renderHook(() => useMasterPicNavigation());

      act(() => { result.current.goBack(); });
      expect(mockNavigate).toHaveBeenCalledWith(-1);

      act(() => { result.current.goCreate(); });
      expect(mockNavigate).toHaveBeenCalledWith("/master-pic/create");

      act(() => { result.current.goEdit({ id: "1" } as any); });
      expect(mockNavigate).toHaveBeenCalledWith("/master-pic/edit/1");

      act(() => { result.current.goDetail({ id: "1" } as any); });
      expect(mockNavigate).toHaveBeenCalledWith("/master-pic/detail/1");
    });
  });

  describe("useMasterPicContainerState", () => {
    it("should manage dropdown state correctly", () => {
      const { result } = renderHook(() => useMasterPicContainerState());

      expect(result.current.isMoreOpen).toBe(false);

      act(() => { result.current.toggleMore(); });
      expect(result.current.isMoreOpen).toBe(true);

      act(() => { result.current.handleCloseMore(); });
      expect(result.current.isMoreOpen).toBe(false);

      act(() => { result.current.toggleMore(); });
      expect(result.current.isMoreOpen).toBe(true);

      act(() => { result.current.goDelete(); });
      expect(result.current.isMoreOpen).toBe(false);
    });
  });
});
