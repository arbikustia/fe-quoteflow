export const getNextOrderStep = (step: number): number => Math.min(step + 1, 3);

export const getPreviousOrderStep = (step: number): number => Math.max(step - 1, 1);

export const isOrderInformationValid = (form: { customer_id: string; customer_name: string; customer_phone: string; pic_id: string; service_type_id: string; service_fee: number; event_name: string; start_at: string; end_at: string }): boolean => Boolean(form.customer_id.trim() && form.customer_name.trim() && form.customer_phone.trim() && form.pic_id.trim() && form.service_type_id.trim() && form.service_fee > 0 && form.event_name.trim() && form.start_at.trim() && form.end_at.trim());

export const hasSelectedOrderItem = (items: ReadonlyArray<{ item_id: string }>): boolean => items.some((item) => Boolean(item.item_id.trim()));

export const calculateOrderTotals = (items: ReadonlyArray<{ price: number; qty: number }>, discount: number, serviceFee: number): { subtotal: number; grandTotal: number } => {
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);

  return { subtotal, grandTotal: subtotal + serviceFee - discount };
};
