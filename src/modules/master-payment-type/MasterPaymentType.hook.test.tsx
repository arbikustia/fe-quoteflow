import { act, renderHook } from "@testing-library/react";
import { useNavigate } from "react-router-dom";

import type { PaymentTypeData } from "./MasterPaymentType.type";
import { useMasterPaymentTypeNavigation, useMasterPaymentTypeContainerState } from "./MasterPaymentType.hook";

jest.mock("@/services/master-payment-type.service", () => ({
  useGetPaymentTypesQuery: jest.fn(() => ({ data: undefined, error: undefined, isLoading: false })),
  mapPaymentType: jest.fn((paymentType: PaymentTypeData): PaymentTypeData => paymentType),
}));

const paymentType: PaymentTypeData = {
  id: "pt-1",
  name: "Full Payment",
  status: "active",
  createAt: null,
  createBy: null,
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
      const { result } = renderHook(() => useMasterPaymentTypeNavigation());

      act(() => {
        result.current.goBack();
        result.current.goCreate();
        result.current.goEdit(paymentType);
      });

      expect(navigate).toHaveBeenNthCalledWith(1, -1);
      expect(navigate).toHaveBeenNthCalledWith(2, "/master-payment-type/create");
      expect(navigate).toHaveBeenNthCalledWith(3, "/master-payment-type/edit/pt-1", { state: { paymentType } });
    });
  });

  describe("useMasterPaymentTypeContainerState", () => {
    it("should return container state", () => {
      jest.mocked(useNavigate).mockReturnValue(jest.fn());
      const { result } = renderHook(() => useMasterPaymentTypeContainerState());

      expect(result.current.pagination).toBeDefined();
      expect(result.current.goBack).toBeDefined();
      expect(result.current.goCreate).toBeDefined();
      expect(result.current.goEdit).toBeDefined();
    });
  });
});
