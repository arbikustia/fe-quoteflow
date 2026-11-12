import { createPaymentRowActionHandler } from "./Payment.util";
import type { PaymentData } from "./Payment.type";

describe("createPaymentRowActionHandler", (): void => {
  it("should call the action without bubbling to the row click", (): void => {
    const action = jest.fn();
    const stopPropagation = jest.fn();
    const payment = { id: "p1" } as PaymentData;

    createPaymentRowActionHandler(payment, action)({ stopPropagation } as unknown as React.MouseEvent);

    expect(stopPropagation).toHaveBeenCalled();
    expect(action).toHaveBeenCalledWith(payment);
  });
});
