import test from "@/libs/unit-test";
import { useCreatePaymentMethodMutation, useUpdatePaymentMethodMutation } from "@/services/master-payment-method.service";

import MasterPaymentMethodCreateContainer from "./MasterPaymentMethodCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-payment-method.service", () => ({
  useCreatePaymentMethodMutation: jest.fn(),
  useUpdatePaymentMethodMutation: jest.fn(),
}));

describe("MasterPaymentMethodCreateContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useCreatePaymentMethodMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdatePaymentMethodMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
  });

  test.assertSnapshots(MasterPaymentMethodCreateContainer, [{ desc: "should render the empty create form", props: {} }]);
});
