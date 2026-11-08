import type { NavigateFunction } from "react-router-dom";

import { getUsername } from "../../../../components/Sidebar/Sidebar.helpers";
import type { OrderCreatePayload, OrderItemPayload, ProjectOrderItemPayload, RentalHandoverPayload } from "../../Order.type";
import { calculateOrderTotals, calculateRentalDays } from "../OrderCreate.helpers";
import type { OrderCreateFormState, OrderTypeOption } from "../OrderCreate.type";

import type { OrderDateRange, ProjectData, SubmitOrderParams } from "./OrderCreateForm.type";

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
const _isProjectServiceType = (form: OrderCreateFormState): boolean => form.service_type_name.trim().toUpperCase() === "PROJECT";

/**
 * Build selected project payload items.
 * @param {OrderItemPayload[]} items - Selected items.
 * @param {ProjectData[]} projects - Project options.
 * @param {string} startAt - Rental start date.
 * @param {string} endAt - Rental end date.
 * @returns {ProjectOrderItemPayload[]} Project payload items.
 */
export const buildProjectItems = (items: OrderItemPayload[], projects: ProjectData[], startAt: string, endAt: string): ProjectOrderItemPayload[] => {
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
  const totals = calculateOrderTotals(items, form.discount, form.service_fee, form.start_at, form.end_at);
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
 * Route after successful order submission.
 * @param {NavigateFunction} navigate - Route navigation.
 * @param {string} [id] - Transaction ID when editing.
 * @param {string} [returnUrl] - Return route.
 * @returns {void} Nothing.
 */
export const resolveSubmitRoute = (navigate: NavigateFunction, id?: string, returnUrl?: string): void => {
  if (returnUrl) {
    navigate(returnUrl);

    return;
  }

  if (id) {
    navigate(-1);

    return;
  }

  navigate("/document/quotation");
};

/**
 * Persist the order through the matching mutation.
 * @param {SubmitOrderParams} params - Submission params.
 * @param {OrderCreatePayload} payload - Order payload.
 * @param {OrderItemPayload[]} items - Selected form items.
 * @returns {Promise<boolean>} True when the order was saved.
 */
const _persistOrder = async (params: SubmitOrderParams, payload: OrderCreatePayload, items: OrderItemPayload[]): Promise<boolean> => {
  const { form, id, projects } = params;

  if (id) {
    await params.updateOrder({ id, payload: { ...payload, status: form.status } }).unwrap();

    return true;
  }

  if (!_isProjectServiceType(form)) {
    await params.createOrder(payload).unwrap();

    return true;
  }

  const projectItems = buildProjectItems(items, projects, form.start_at, form.end_at);

  if (!projectItems.length) {
    params.setErrorMessage("Please select at least one project with items.");

    return false;
  }

  await params.createProjectOrder({ ...payload, rental_transaction_items: projectItems }).unwrap();

  return true;
};

/**
 * Record order activity without blocking the user workflow.
 * @param {SubmitOrderParams} params - Submission params.
 * @param {string} eventName - Order event name.
 * @returns {Promise<void>} Completion promise.
 */
const _logOrderActivity = async (params: SubmitOrderParams, eventName: string): Promise<void> => {
  const { id } = params;
  const userName = getUsername();

  if (!userName) return;

  try {
    await params.createActivityLog({
      user_name: userName,
      action: id ? "edit" : "create",
      page: "Order",
      description: `Order ${id || eventName} has been ${id ? "updated" : "created"}.`,
    }).unwrap();
  } catch {
    // Activity log failure should not block user workflow
  }
};

/**
 * Submit order payload, log activity, and route away on success.
 * @param {SubmitOrderParams} params - Submission params.
 * @returns {Promise<void>} Completion promise.
 */
export const submitOrder = async (params: SubmitOrderParams): Promise<void> => {
  const { form, orderTypes } = params;
  const items = form.rental_transaction_items.filter((item) => item.item_id);
  const payloadItems = _isProjectServiceType(form) ? items.filter((item) => item.item_id === item.project_id) : items;
  const payload = buildOrderPayload(form, payloadItems, orderTypes);
  const isSaved = await _persistOrder(params, payload, items);

  if (!isSaved) return;

  await _logOrderActivity(params, payload.event_name);
  resolveSubmitRoute(params.navigate, params.id, params.returnUrl);
};
