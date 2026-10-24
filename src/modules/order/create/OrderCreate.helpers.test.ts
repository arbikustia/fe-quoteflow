import { calculateOrderTotals, getNextOrderStep, getPreviousOrderStep } from "./OrderCreate.helpers";

describe("OrderCreate step helpers", () => {
  it("should advance until pricing step", (): void => {
    expect(getNextOrderStep(1)).toBe(2);
    expect(getNextOrderStep(2)).toBe(3);
    expect(getNextOrderStep(3)).toBe(3);
  });

  it("should calculate subtotal and grand total", (): void => {
    expect(calculateOrderTotals([{ price: 10000, qty: 2 }, { price: 5000, qty: 1 }], 3000, 2000)).toEqual({ subtotal: 25000, grandTotal: 24000 });
  });

  it("should return until order information step", (): void => {
    expect(getPreviousOrderStep(3)).toBe(2);
    expect(getPreviousOrderStep(2)).toBe(1);
    expect(getPreviousOrderStep(1)).toBe(1);
  });
});
