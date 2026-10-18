import { renderHook, act } from "@testing-library/react";
import { useNavigate } from "react-router-dom";

import type { PaymentMethodData } from "./MasterPaymentMethod.type";
import { useMasterPaymentMethodContainerState, useMasterPaymentMethodNavigation } from "./MasterPaymentMethod.hook";

jest.mock("@/services/master-payment-method.service", () => ({
  useGetPaymentMethodsQuery: jest.fn(() => ({ data: undefined, error: undefined, isLoading: false })),
  mapPaymentMethod: jest.fn((paymentMethod: PaymentMethodData): PaymentMethodData => paymentMethod),
}));

const paymentMethod: PaymentMethodData = {
  id: "pm-1",
  name: "Card",
  description: null,
  status: "active",
  createAt: null,
  createBy: null,
};

const renderContainerState = () => renderHook(() => useMasterPaymentMethodContainerState());

const assertPaymentMethodNavigation = (mockNavigate: jest.Mock): void => {
  expect(mockNavigate).toHaveBeenNthCalledWith(3, "/master-payment-method/edit/pm-1", { state: { paymentMethod } });
  expect(mockNavigate).toHaveBeenNthCalledWith(4, "/master-payment-method/detail/pm-1");
};

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("MasterPaymentMethod.hook", () => {
  describe("useMasterPaymentMethodNavigation", () => {
    it("should handle navigation correctly", () => {
      const mockNavigate = jest.fn();
      jest.mocked(useNavigate).mockReturnValue(mockNavigate);

      const { result } = renderHook(() => useMasterPaymentMethodNavigation());

      act(() => {
        result.current.goBack();
      });
      expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);

      act(() => {
        result.current.goCreate();
      });
      expect(mockNavigate).toHaveBeenCalledWith("/master-payment-method/create");

      act(() => {
        result.current.goEdit(paymentMethod);
      });

      act(() => {
        result.current.goDetail(paymentMethod);
      });
      assertPaymentMethodNavigation(mockNavigate);
    });
  });

  describe("useMasterPaymentMethodContainerState", () => {
    it("should manage container state correctly", () => {
      const { result } = renderContainerState();

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
