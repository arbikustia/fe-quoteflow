export const getNextOrderStep = (step: number): number => Math.min(step + 1, 3);

export const getPreviousOrderStep = (step: number): number => Math.max(step - 1, 1);

export const calculateOrderTotals = (items: ReadonlyArray<{ price: number; qty: number }>, discount: number, serviceFee: number): { subtotal: number; grandTotal: number } => {
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);

  return { subtotal, grandTotal: subtotal + serviceFee - discount };
};
