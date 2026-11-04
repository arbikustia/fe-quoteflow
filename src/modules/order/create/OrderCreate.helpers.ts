/**
 * Handle module operation.
 * @param {number} step - step value
 * @returns {number} - Operation result
 */
export const getNextOrderStep = (step: number): number => Math.min(step + 1, 3);

/**
 * Handle module operation.
 * @param {number} step - step value
 * @returns {number} - Operation result
 */
export const getPreviousOrderStep = (step: number): number => Math.max(step - 1, 1);

/**
 * Handle module operation.
 * @param {{ customer_id: string; customer_name: string; customer_phone: string; pic_id: string; service_type_id: string; order_type_id: string; handover_type: string; handover_name: string; event_name: string; start_at: string; end_at: string }} form - form value
 * @param {boolean} isHandover - Whether handover fields are required
 * @returns {boolean} - Operation result
 */
export const isOrderInformationValid = (form: { customer_id: string; customer_name: string; customer_phone: string; pic_id: string; service_type_id: string; order_type_id: string; handover_type: string; handover_name: string; event_name: string; start_at: string; end_at: string }, isHandover = false): boolean => Boolean(form.customer_id.trim() && form.customer_name.trim() && form.customer_phone.trim() && form.pic_id.trim() && form.service_type_id.trim() && form.order_type_id.trim() && form.event_name.trim() && form.start_at.trim() && form.end_at.trim() && form.end_at.slice(0, 10) >= form.start_at.slice(0, 10) && (!isHandover || (form.handover_type.trim() && form.handover_name.trim())));

/**
 * Handle module operation.
 * @param {ReadonlyArray<{ item_id: string }>} items - items value
 * @returns {boolean} - Operation result
 */
export const hasSelectedOrderItem = (items: ReadonlyArray<{ item_id: string }>): boolean => items.some((item) => Boolean(item.item_id.trim()));

/**
 * Calculate order subtotal, percentage discount amount, and grand total.
 * @param {ReadonlyArray<{ price: number; qty: number }>} items - Order items
 * @param {number} discountPercent - Discount percentage
 * @param {number} serviceFee - Service fee amount
 * @returns {{ subtotal: number; discountAmount: number; grandTotal: number }} Order totals
 */
export const calculateOrderTotals = (items: ReadonlyArray<{ price: number; qty: number }>, discountPercent: number, serviceFee: number): { subtotal: number; discountAmount: number; grandTotal: number } => {
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);
  const discountAmount = Math.round(subtotal * discountPercent / 100);

  return { subtotal, discountAmount, grandTotal: subtotal + serviceFee - discountAmount };
};
