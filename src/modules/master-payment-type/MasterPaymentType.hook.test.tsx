import { renderHook } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { useMasterPaymentTypeNavigation, useMasterPaymentTypeContainerState } from "./MasterPaymentType.hook";

describe("MasterPaymentType Hook", () => {
  describe("useMasterPaymentTypeNavigation", () => {
    it("should return navigation functions", () => {
      const { result } = renderHook(() => useMasterPaymentTypeNavigation(), { wrapper: BrowserRouter });

      expect(result.current.goBack).toBeDefined();
      expect(result.current.goCreate).toBeDefined();
      expect(result.current.goEdit).toBeDefined();
      expect(result.current.goDetail).toBeDefined();
    });
  });

  describe("useMasterPaymentTypeContainerState", () => {
    it("should return container state", () => {
      const { result } = renderHook(() => useMasterPaymentTypeContainerState());

      expect(result.current.pagination).toBeDefined();
      expect(result.current.isMoreOpen).toBe(false);
      expect(result.current.toggleMore).toBeDefined();
      expect(result.current.goDelete).toBeDefined();
      expect(result.current.handleCloseMore).toBeDefined();
    });
  });
});
