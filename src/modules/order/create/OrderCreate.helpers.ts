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
export const isOrderInformationValid = (form: { customer_id: string; customer_name: string; customer_phone: string; pic_id: string; service_type_id: string; order_type_id: string; handover_type: string; handover_name: string; event_name: string; start_at: string; end_at: string }, isHandover = false): boolean => Boolean(form.customer_id.trim() && form.customer_name.trim() && form.customer_phone.trim() && form.pic_id.trim() && form.service_type_id.trim() && form.order_type_id.trim() && form.event_name.trim() && form.start_at.trim() && form.end_at.trim() && (!isHandover || (form.handover_type.trim() && form.handover_name.trim())));

/**
 * Handle module operation.
 * @param {ReadonlyArray<{ item_id: string }>} items - items value
 * @returns {boolean} - Operation result
 */
export const hasSelectedOrderItem = (items: ReadonlyArray<{ item_id: string }>): boolean => items.some((item) => Boolean(item.item_id.trim()));

/**
 * Handle module operation.
 * @param {ReadonlyArray<{ price: number; qty: number }>} items - items value
 * @param {number} discount - discount value
 * @param {number} serviceFee - serviceFee value
 * @returns {{ subtotal: number; grandTotal: number }} - Operation result
 */
export const calculateOrderTotals = (items: ReadonlyArray<{ price: number; qty: number }>, discount: number, serviceFee: number): { subtotal: number; grandTotal: number } => {
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);

  return { subtotal, grandTotal: subtotal + serviceFee - discount };
};
