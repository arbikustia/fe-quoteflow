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
export const getPreviousOrderStep = (step: number): number =>
  Math.max(step - 1, 1);

/**
 * Handle module operation.
 * @param {{ customer_id: string; customer_name: string; customer_phone: string; pic_id: string; service_type_id: string; order_type_id: string; handover_type: string; handover_name: string; event_name: string; start_at: string; end_at: string }} form - form value
 * @param {boolean} isHandover - Whether handover fields are required
 * @returns {boolean} - Operation result
 */
export const isOrderInformationValid = (
  form: {
    customer_id: string;
    customer_name: string;
    customer_phone: string;
    pic_id: string;
    service_type_id: string;
    order_type_id: string;
    handover_type: string;
    handover_name: string;
    event_name: string;
    start_at: string;
    end_at: string;
  },
  isHandover = false,
): boolean =>
  Boolean(
    form.customer_id.trim() &&
    form.customer_name.trim() &&
    form.customer_phone.trim() &&
    form.pic_id.trim() &&
    form.service_type_id.trim() &&
    form.order_type_id.trim() &&
    form.event_name.trim() &&
    form.start_at.trim() &&
    form.end_at.trim() &&
    form.end_at.slice(0, 10) >= form.start_at.slice(0, 10) &&
    (!isHandover || (form.handover_type.trim() && form.handover_name.trim())),
  );

/**
 * Handle module operation.
 * @param {ReadonlyArray<{ item_id: string }>} items - items value
 * @returns {boolean} - Operation result
 */
export const hasSelectedOrderItem = (
  items: ReadonlyArray<{ item_id: string }>,
): boolean => items.some((item) => Boolean(item.item_id.trim()));

/**
 * Clamp item quantity to available stock.
 * @param {number} qty - Requested quantity
 * @param {number} stock - Available stock
 * @returns {number} - Quantity capped by stock
 */
export const clampQtyToStock = (qty: number, stock: number): number =>
  Math.max(0, Math.min(Math.max(1, qty), stock));

/**
 * Check every selected item quantity is within stock.
 * @param {ReadonlyArray<{ item_id: string; qty: number }>} items - Selected order items
 * @param {ReadonlyArray<{ id: string; stock: number | null }>} options - Item options with stock
 * @returns {boolean} - True when all quantities fit stock
 */
export const hasItemQtyWithinStock = (
  items: ReadonlyArray<{ item_id: string; qty: number }>,
  options: ReadonlyArray<{ id: string; stock: number | null }>,
): boolean =>
  items.every((item) => {
    const option = options.find((entry) => entry.id === item.item_id);

    if (!option || option.stock === null) return true;

    return item.qty <= option.stock;
  });

/**
 * Calculate order subtotal, percentage discount amount, and grand total.
 * @param {string} startAt - Event start date
 * @param {string} endAt - Event end date
 * @returns {number} - Number of inclusive rental days
 */
export const calculateRentalDays = (
  startAt?: string,
  endAt?: string,
): number => {
  const startDate = startAt ? Date.parse(startAt.slice(0, 10)) : NaN;
  const endDate = endAt ? Date.parse(endAt.slice(0, 10)) : NaN;

  return !isNaN(startDate) && !isNaN(endDate)
    ? Math.max(1, Math.round((endDate - startDate) / 86_400_000) + 1)
    : 1;
};

/**
 * Calculate order totals.
 * @param {ReadonlyArray} args - Order items, discount, service fee, and optional dates.
 * @returns {{ subtotal: number; discountAmount: number; grandTotal: number }} Order totals.
 */
export const calculateOrderTotals = (
  ...args: [
    ReadonlyArray<{
      item_id?: string;
      project_id?: string | null;
      price: number;
      qty: number;
      subtotal?: number;
    }>,
    number,
    number,
    string?,
    string?,
  ]
): { subtotal: number; discountAmount: number; grandTotal: number } => {
  const [items, discountPercent, serviceFee, startAt, endAt] = args;
  const totalDays = calculateRentalDays(startAt, endAt);
  const dailySubtotal = items.reduce((total, item) => {
    const isProject = Boolean(
      item.item_id && item.project_id && item.item_id === item.project_id,
    );

    return (
      total +
      (isProject ? item.price : (item.subtotal ?? item.price * item.qty))
    );
  }, 0);
  const subtotal = dailySubtotal * totalDays;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);

  return {
    subtotal,
    discountAmount,
    grandTotal: subtotal + serviceFee - discountAmount,
  };
};
