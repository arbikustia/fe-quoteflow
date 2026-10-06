import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useNavigate } from "react-router-dom";
import { useMasterServiceTypeContainerState, useMasterServiceTypeNavigation } from "./MasterServiceType.hook";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

describe("MasterServiceType.hook", () => {
  describe("useMasterServiceTypeNavigation", () => {
    it("should handle navigation correctly", () => {
      const mockNavigate = vi.fn();
      vi.mocked(useNavigate).mockReturnValue(mockNavigate);

      const { result } = renderHook(() => useMasterServiceTypeNavigation());

      act(() => {
        result.current.goBack();
      });
      expect(mockNavigate).toHaveBeenCalledWith(-1);

      act(() => {
        result.current.goCreate();
      });
      expect(mockNavigate).toHaveBeenCalledWith("/master-service-type/create");

      act(() => {
        result.current.goEdit({ id: "st-1" } as any);
      });
      expect(mockNavigate).toHaveBeenCalledWith("/master-service-type/edit/st-1");

      act(() => {
        result.current.goDetail({ id: "st-1" } as any);
      });
      expect(mockNavigate).toHaveBeenCalledWith("/master-service-type/detail/st-1");
    });
  });

  describe("useMasterServiceTypeContainerState", () => {
    it("should manage container state correctly", () => {
      const { result } = renderHook(() => useMasterServiceTypeContainerState());

      expect(result.current.isMoreOpen).toBe(false);

      act(() => {
        result.current.toggleMore();
      });
      expect(result.current.isMoreOpen).toBe(true);

      act(() => {
        result.current.handleCloseMore();
      });
      expect(result.current.isMoreOpen).toBe(false);

      act(() => {
        result.current.toggleMore();
      });
      expect(result.current.isMoreOpen).toBe(true);

      act(() => {
        result.current.goDelete();
      });
      expect(result.current.isMoreOpen).toBe(false);
    });
  });
});
