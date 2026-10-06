import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useNavigate } from "react-router-dom";
import { useMasterPaymentMethodContainerState, useMasterPaymentMethodNavigation } from "./MasterPaymentMethod.hook";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

describe("MasterPaymentMethod.hook", () => {
  describe("useMasterPaymentMethodNavigation", () => {
    it("should handle navigation correctly", () => {
      const mockNavigate = vi.fn();
      vi.mocked(useNavigate).mockReturnValue(mockNavigate);

      const { result } = renderHook(() => useMasterPaymentMethodNavigation());

      act(() => {
        result.current.goBack();
      });
      expect(mockNavigate).toHaveBeenCalledWith(-1);

      act(() => {
        result.current.goCreate();
      });
      expect(mockNavigate).toHaveBeenCalledWith("/master-payment-method/create");

      act(() => {
        result.current.goEdit({ id: "pm-1" } as any);
      });
      expect(mockNavigate).toHaveBeenCalledWith("/master-payment-method/edit/pm-1");

      act(() => {
        result.current.goDetail({ id: "pm-1" } as any);
      });
      expect(mockNavigate).toHaveBeenCalledWith("/master-payment-method/detail/pm-1");
    });
  });

  describe("useMasterPaymentMethodContainerState", () => {
    it("should manage container state correctly", () => {
      const { result } = renderHook(() => useMasterPaymentMethodContainerState());

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
