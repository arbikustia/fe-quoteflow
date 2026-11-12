import type { ApiQuotation } from "../../quotation/Quotation.type";
import type { ApiRentalTransactionDetail, OrderCreatePayload, OrderItemPayload, ProjectOrderItemPayload, RentalHandoverPayload } from "../Order.type";

import { EMPTY_ITEM } from "./OrderCreate.config";
import type { OrderCreateFormState, OrderDateRange, OrderInformationFields, OrderItemOption, OrderOptionsState, OrderPricing, OrderProjectOption,OrderQtyItem, OrderStepValidation, OrderTotals, OrderTotalsItem,OrderTypeOption } from "./OrderCreate.type";

/**
 * Get the step after the given one, capped at the last step.
 * @param {number} step - Current step
 * @returns {number} - Next step
 */
export const getNextOrderStep = (step: number): number => Math.min(step + 1, 3);

/**
 * Get the step before the given one, floored at the first step.
 * @param {number} step - Current step
 * @returns {number} - Previous step
 */
export const getPreviousOrderStep = (step: number): number =>
  Math.max(step - 1, 1);

/**
 * Check whether the order information step is complete and valid.
 * @param {OrderInformationFields} form - Order information fields
 * @param {boolean} isHandover - Whether handover fields are required
 * @returns {boolean} - Whether the information is valid
 */
export const isOrderInformationValid = (
  form: OrderInformationFields,
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
 * Check whether at least one item row has an item selected.
 * @param {ReadonlyArray<Pick<OrderItemPayload, "item_id">>} items - Item rows
 * @returns {boolean} - Whether an item is selected
 */
export const hasSelectedOrderItem = (
  items: ReadonlyArray<Pick<OrderItemPayload, "item_id">>,
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
 * @param {ReadonlyArray<OrderQtyItem>} items - Selected order items
 * @param {ReadonlyArray<Pick<OrderItemOption, "id" | "stock">>} options - Item options with stock
 * @returns {boolean} - True when all quantities fit stock
 */
export const hasItemQtyWithinStock = (
  items: ReadonlyArray<OrderQtyItem>,
  options: ReadonlyArray<Pick<OrderItemOption, "id" | "stock">>,
): boolean =>
  items.every((item) => {
    const option = options.find((entry) => entry.id === item.item_id);

    if (!option || option.stock === null) return true;

    return item.qty <= option.stock;
  });

/**
 * Count the inclusive rental days between two dates.
 * @param {string} [startAt] - Event start date
 * @param {string} [endAt] - Event end date
 * @returns {number} - Number of inclusive rental days
 */
export const calculateRentalDays = (startAt?: string, endAt?: string): number => {
  const startDate = startAt ? Date.parse(startAt.slice(0, 10)) : NaN;
  const endDate = endAt ? Date.parse(endAt.slice(0, 10)) : NaN;

  return !isNaN(startDate) && !isNaN(endDate)
    ? Math.max(1, Math.round((endDate - startDate) / 86_400_000) + 1)
    : 1;
};

/**
 * Calculate order subtotal, percentage discount amount, and grand total.
 * @param {ReadonlyArray<OrderTotalsItem>} items - Order item rows
 * @param {OrderPricing} pricing - Discount percentage, service fee and event dates
 * @returns {OrderTotals} - Order totals
 */
export const calculateOrderTotals = (
  items: ReadonlyArray<OrderTotalsItem>,
  pricing: OrderPricing,
): OrderTotals => {
  const { discount: discountPercent, service_fee: serviceFee, start_at: startAt, end_at: endAt } = pricing;
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

/**
 * Pad a date part to two digits.
 * @param {number} value - Date part value.
 * @returns {string} Two-digit date part.
 */
const _padDatePart = (value: number): string => String(value).padStart(2, "0");

/**
 * Format date for date picker state.
 * @param {Date} date - Date to format.
 * @returns {string} Date formatted for date picker.
 */
const _formatDatePickerValue = (date: Date): string => `${date.getFullYear()}-${_padDatePart(date.getMonth() + 1)}-${_padDatePart(date.getDate())}T${_padDatePart(date.getHours())}:${_padDatePart(date.getMinutes())}`;

/**
 * Build default order date range.
 * @returns {OrderDateRange} Today at 06:00 through tomorrow at 06:00.
 */
export const getDefaultDateRange = (): OrderDateRange => {
  const start = new Date();

  start.setHours(6, 0, 0, 0);
  const end = new Date(start);

  end.setDate(end.getDate() + 1);

  return { start_at: _formatDatePickerValue(start), end_at: _formatDatePickerValue(end) };
};

/**
 * Format date value for order API payload.
 * @param {string} value - Date value.
 * @returns {string} Date formatted as `YYYY-MM-DD HH:mm:ss`.
 */
export const formatOrderDate = (value: string): string => {
  const date = new Date(value);

  return `${date.getFullYear()}-${_padDatePart(date.getMonth() + 1)}-${_padDatePart(date.getDate())} ${_padDatePart(date.getHours())}:${_padDatePart(date.getMinutes())}:${_padDatePart(date.getSeconds())}`;
};

/**
 * Check whether the form uses the project service type.
 * @param {OrderCreateFormState} form - Current form.
 * @returns {boolean} True when the service type is PROJECT.
 */
export const isProjectServiceType = (form: OrderCreateFormState): boolean => form.service_type_name.trim().toUpperCase() === "PROJECT";

/**
 * Build selected project payload items.
 * @param {OrderItemPayload[]} items - Selected items.
 * @param {OrderProjectOption[]} projects - Project options.
 * @param {string} startAt - Rental start date.
 * @param {string} endAt - Rental end date.
 * @returns {ProjectOrderItemPayload[]} Project payload items.
 */
export const buildProjectItems = (items: OrderItemPayload[], projects: OrderProjectOption[], startAt: string, endAt: string): ProjectOrderItemPayload[] => {
  const projectIds = Array.from(new Set(items.map((item) => item.project_id).filter((projectId): projectId is string => Boolean(projectId))));
  const totalDays = calculateRentalDays(startAt, endAt);

  return projectIds.map((projectId) => {
    const projectHeader = items.find((item) => item.project_id === projectId && item.item_id === projectId);
    const price = projects.find((project) => project.id === projectId)?.price ?? 0;

    return { project_id: projectId, qty: 1, price, subtotal: price * totalDays, remark: projectHeader?.remark ?? "" };
  });
};

/**
 * Build rental handover payload for handover order types.
 * @param {OrderCreateFormState} form - Current form.
 * @param {OrderTypeOption} orderType - Selected handover order type.
 * @returns {RentalHandoverPayload} Rental handover payload.
 */
const _buildRentalHandover = (form: OrderCreateFormState, orderType: OrderTypeOption): RentalHandoverPayload => ({
  order_type_id: orderType.id,
  type: form.handover_type,
  name: form.handover_name,
  status: 1,
});

/**
 * Build order payload.
 * @param {OrderCreateFormState} form - Current form.
 * @param {OrderItemPayload[]} items - Selected items.
 * @param {OrderTypeOption[]} orderTypes - Order type options.
 * @returns {OrderCreatePayload} Order payload.
 */
export const buildOrderPayload = (form: OrderCreateFormState, items: OrderItemPayload[], orderTypes: OrderTypeOption[]): OrderCreatePayload => {
  const totals = calculateOrderTotals(items, form);
  const selectedOrderType = orderTypes.find((orderType) => orderType.id === form.order_type_id);

  return {
    customer_id: form.customer_id,
    pic_id: form.pic_id,
    voucher_id: form.voucher_id || null,
    service_type_id: form.service_type_id,
    order_type_id: form.order_type_id,
    customer_name: form.customer_name,
    customer_phone: form.customer_phone,
    address: form.address,
    event_name: form.event_name,
    start_at: formatOrderDate(form.start_at),
    end_at: formatOrderDate(form.end_at),
    subtotal: totals.subtotal,
    discount: form.discount,
    service_fee: form.service_fee,
    remarks: form.remarks,
    grand_total: totals.grandTotal,
    status: 1,
    rental_transaction_items: items,
    ...(selectedOrderType?.is_handover ? { rental_handover: _buildRentalHandover(form, selectedOrderType) } : {}),
  };
};

/**
 * Build edit form rows for a project order.
 * @param {ApiRentalTransactionDetail} order - Order detail.
 * @returns {OrderItemPayload[]} Project header rows followed by their item rows.
 */
const _buildProjectEditItems = (order: ApiRentalTransactionDetail): OrderItemPayload[] => (order.rental_transaction_project ?? []).flatMap((project) => [
  {
    item_id: project.id,
    project_id: project.id,
    item_name: project.name,
    qty: 1,
    price: project.price,
    subtotal: project.price,
    remark: project.remark ?? "",
  },
  ...project.items.map((projectItem) => ({
    item_id: projectItem.item_id,
    project_id: project.id,
    item_name: projectItem.item_name,
    qty: projectItem.qty,
    price: 0,
    subtotal: 0,
    remark: "",
  })),
]);

/**
 * Build edit form rows for a regular order.
 * @param {ApiRentalTransactionDetail} order - Order detail.
 * @returns {OrderItemPayload[]} Regular item rows.
 */
const _buildRegularEditItems = (order: ApiRentalTransactionDetail): OrderItemPayload[] => (order.rental_transaction_items ?? []).map((item) => ({
  item_id: item.item_id,
  project_id: item.project_id ?? null,
  item_name: item.item_name,
  qty: item.qty,
  price: item.price,
  subtotal: item.subtotal,
  remark: item.remark ?? "",
}));

/**
 * Build edit form item list from order detail.
 * @param {ApiRentalTransactionDetail} order - Order detail.
 * @returns {OrderItemPayload[]} Form item rows.
 */
const _buildEditFormItems = (order: ApiRentalTransactionDetail): OrderItemPayload[] => {
  const serviceTypeName = (order.service_type_name ?? order.service_type?.name ?? "").trim().toUpperCase();
  const items = serviceTypeName === "PROJECT" ? _buildProjectEditItems(order) : _buildRegularEditItems(order);

  return items.length > 0 ? items : [EMPTY_ITEM];
};

/**
 * Map quotation detail (/api/quotation/:id) to order detail shape, using transaction remarks as global remarks.
 * @param {ApiQuotation} quotation - Quotation detail.
 * @returns {ApiRentalTransactionDetail} Order detail used to build the edit form.
 */
export const mapQuotationToOrderDetail = (quotation: ApiQuotation): ApiRentalTransactionDetail => {
  const { transaction } = quotation;

  return {
    ...transaction,
    remarks: transaction.remarks ?? "",
    rental_transaction_items: (transaction.rental_transaction_items ?? []).map((item) => ({
      item_id: item.item_id ?? "",
      project_id: item.project_id ?? null,
      item_name: item.item_name ?? "",
      qty: item.qty,
      price: item.price,
      subtotal: item.subtotal,
      remark: item.remark ?? "",
    })),
    rental_transaction_project: (transaction.rental_transaction_project ?? []).map((project) => ({
      ...project,
      remark: project.remark ?? "",
      items: project.items.map((projectItem) => ({ ...projectItem, remark: projectItem.remark ?? "" })),
    })),
  };
};

/**
 * Build edit form defaults from order detail.
 * @param {ApiRentalTransactionDetail} order - Order detail.
 * @returns {OrderCreateFormState} - Populated edit form.
 */
export const buildEditForm = (order: ApiRentalTransactionDetail): OrderCreateFormState => ({
  customer_id: order.customer_id ?? order.customer?.id ?? "",
  pic_id: order.pic_id ?? order.pic?.id ?? "",
  voucher_id: order.voucher_id ?? order.voucher?.id ?? null,
  service_type_id: order.service_type_id ?? order.service_type?.id ?? "",
  order_type_id: order.order_type_id ?? order.order_type?.id ?? "",
  handover_type: order.rental_handovers?.[0]?.type ?? "",
  handover_name: order.rental_handovers?.[0]?.name ?? "",
  service_type_name: order.service_type_name ?? order.service_type?.name ?? "",
  customer_name: order.customer_name ?? order.customer?.name ?? "",
  customer_phone: order.customer_phone ?? order.customer?.phone_number ?? order.customer?.phone ?? "",
  address: order.address ?? order.customer?.address ?? "",
  event_name: order.event_name ?? "",
  start_at: order.start_at ?? "",
  end_at: order.end_at ?? "",
  subtotal: order.subtotal ?? 0,
  discount: order.discount ?? 0,
  service_fee: order.service_fee ?? 0,
  remarks: order.remarks || order.remark || "",
  grand_total: order.grand_total ?? 0,
  status: order.status ?? 1,
  rental_transaction_items: _buildEditFormItems(order),
});

/**
 * Validate the current order step.
 * @param {number} step - Current step.
 * @param {OrderCreateFormState} form - Current form.
 * @param {OrderOptionsState} options - Select options.
 * @returns {OrderStepValidation} Validation result for the step.
 */
export const validateOrderStep = (step: number, form: OrderCreateFormState, options: OrderOptionsState): OrderStepValidation => {
  const isHandover = Boolean(options.orderTypes.find((orderType) => orderType.id === form.order_type_id)?.is_handover);

  if (step === 1 && !isOrderInformationValid(form, isHandover)) return { isValid: false, section: "information", message: "Please complete all required Order Information fields." };

  if (step === 2 && !hasSelectedOrderItem(form.rental_transaction_items)) return { isValid: false, section: "items", message: "Please select at least one item." };

  if (step === 2 && !hasItemQtyWithinStock(form.rental_transaction_items, options.items)) return { isValid: false, section: "items", message: "Item quantity cannot exceed available stock." };

  return { isValid: true };
};

