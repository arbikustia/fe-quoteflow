import { act, renderHook } from "@testing-library/react";
import { BrowserRouter, useNavigate } from "react-router-dom";

import type { PaymentTypeData } from "./MasterPaymentType.type";
import { useMasterPaymentTypeNavigation, useMasterPaymentTypeContainerState } from "./MasterPaymentType.hook";

jest.mock("@/services/master-payment-type.service", () => ({
  useGetPaymentTypesQuery: jest.fn(() => ({ data: undefined, error: undefined, isLoading: false })),
  mapPaymentType: jest.fn((paymentType: PaymentTypeData): PaymentTypeData => paymentType),
}));

const renderContainerState = () => renderHook(() => useMasterPaymentTypeContainerState());

const paymentType: PaymentTypeData = {
  id: "pt-1",
  name: "Full Payment",
  status: "active",
  createAt: null,
  createBy: null,
};

const assertNavigationHandlers = (navigate: jest.Mock): void => {
  expect(navigate).toHaveBeenNthCalledWith(1, -1);
  expect(navigate).toHaveBeenNthCalledWith(2, "/master-payment-type/create");
  expect(navigate).toHaveBeenNthCalledWith(3, "/master-payment-type/edit/pt-1", { state: { paymentType } });
  expect(navigate).toHaveBeenNthCalledWith(4, "/master-payment-type/detail/pt-1");
};

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
}));

describe("MasterPaymentType Hook", () => {
  describe("useMasterPaymentTypeNavigation", () => {
    it("should navigate to payment type pages", () => {
      const navigate = jest.fn();
      jest.mocked(useNavigate).mockReturnValue(navigate);
      const { result } = renderHook(() => useMasterPaymentTypeNavigation(), { wrapper: BrowserRouter });

      act(() => {
        result.current.goBack();
        result.current.goCreate();
        result.current.goEdit(paymentType);
        result.current.goDetail(paymentType);
      });

      assertNavigationHandlers(navigate);
    });
  });

  describe("useMasterPaymentTypeContainerState", () => {
    it("should return container state", () => {
      jest.mocked(useNavigate).mockReturnValue(jest.fn());
      const { result } = renderContainerState();

      expect(result.current.pagination).toBeDefined();
      expect(result.current.isMoreOpen).toBe(false);
      expect(result.current.toggleMore).toBeDefined();
      expect(result.current.goDelete).toBeDefined();
      expect(result.current.handleCloseMore).toBeDefined();
    });
  });
});
