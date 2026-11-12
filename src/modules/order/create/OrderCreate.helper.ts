import type { NavigateFunction } from "react-router-dom";

import { getUsername } from "@/components/Sidebar/Sidebar.helpers";

import type { OrderCreatePayload, OrderItemPayload } from "../Order.type";

import { EMPTY_ITEM } from "./OrderCreate.config";
import type { ActionResult, FieldActions, FormActionOptions, FormFieldValue, FormSetter, ItemActions, OptionActions, OrderCreateFormState, OrderItemField, OrderItemFieldValue, OrderItemOption, OrderProjectOption, SubmitOrderParams, VoucherSelection } from "./OrderCreate.type";
import { buildOrderPayload, buildProjectItems, clampQtyToStock, isProjectServiceType } from "./OrderCreate.util";

/**
 * Update a row with the selected item option.
 * @param {OrderItemPayload} row - Current row.
 * @param {OrderItemOption} [selectedItem] - Selected item option.
 * @returns {OrderItemPayload} Updated row, or an empty row when no item is selected.
 */
export const updateSelectedItem = (row: OrderItemPayload, selectedItem?: OrderItemOption): OrderItemPayload => {
  if (!selectedItem) return EMPTY_ITEM;

  const price = selectedItem.price ?? 0;
  const qty = typeof selectedItem.stock === "number" ? clampQtyToStock(row.qty, selectedItem.stock) : row.qty;

  return { ...row, item_id: selectedItem.id, item_name: selectedItem.name, qty, price, subtotal: price * qty };
};

/**
 * Update an item field and recalculate its subtotal.
 * @param {OrderItemPayload} item - Current item.
 * @param {OrderItemField} field - Field name.
 * @param {OrderItemFieldValue} value - Field value.
 * @returns {OrderItemPayload} Updated item.
 */
const _updateItem = (item: OrderItemPayload, field: OrderItemField, value: OrderItemFieldValue): OrderItemPayload => {
  const updatedItem = { ...item, [field]: value };

  return { ...updatedItem, subtotal: updatedItem.price * updatedItem.qty };
};

/**
 * Apply an item field change, clamping quantity to known stock.
 * @param {OrderItemPayload} item - Current item.
 * @param {OrderItemField} field - Field name.
 * @param {OrderItemFieldValue} value - Field value.
 * @param {OrderItemOption[]} items - Item options.
 * @returns {OrderItemPayload} Updated item.
 */
const _applyItemChange = (item: OrderItemPayload, field: OrderItemField, value: OrderItemFieldValue, items: OrderItemOption[]): OrderItemPayload => {
  const stock = items.find((option) => option.id === item.item_id)?.stock;
  const nextValue = field === "qty" && typeof stock === "number" ? clampQtyToStock(Number(value), stock) : value;

  return _updateItem(item, field, nextValue);
};

/**
 * Replace an empty item row with the selected item.
 * @param {OrderCreateFormState} form - Current form.
 * @param {number} index - Row index.
 * @param {string} itemId - Item ID.
 * @param {OrderItemOption[]} items - Item options.
 * @returns {OrderCreateFormState} Updated form.
 */
const _replaceItem = (form: OrderCreateFormState, index: number, itemId: string, items: OrderItemOption[]): OrderCreateFormState => ({
  ...form,
  rental_transaction_items: form.rental_transaction_items.map((item, itemIndex) => (itemIndex === index ? updateSelectedItem(item, items.find((option) => option.id === itemId)) : item)),
});

/**
 * Toggle item selection.
 * @param {OrderCreateFormState} form - Current form.
 * @param {string} itemId - Item ID.
 * @param {OrderItemOption[]} items - Item options.
 * @returns {OrderCreateFormState} Updated form.
 */
const _toggleItem = (form: OrderCreateFormState, itemId: string, items: OrderItemOption[]): OrderCreateFormState => {
  const selectedIndex = form.rental_transaction_items.findIndex((item) => item.item_id === itemId);

  if (selectedIndex >= 0) return { ...form, rental_transaction_items: form.rental_transaction_items.filter((_item, index) => index !== selectedIndex) };

  const emptyIndex = form.rental_transaction_items.findIndex((item) => !item.item_id);

  if (emptyIndex >= 0) return _replaceItem(form, emptyIndex, itemId, items);

  const selectedItem = items.find((item) => item.id === itemId);

  return selectedItem ? { ...form, rental_transaction_items: [...form.rental_transaction_items, updateSelectedItem(EMPTY_ITEM, selectedItem)] } : form;
};

/**
 * Build form rows for a project header and its items.
 * @param {OrderProjectOption} project - Selected project.
 * @returns {OrderItemPayload[]} Project header row followed by project item rows.
 */
const _buildProjectRows = (project: OrderProjectOption): OrderItemPayload[] => {
  const projectHeader = { ...EMPTY_ITEM, item_id: project.id, project_id: project.id, item_name: project.name, qty: 1, price: project.price, subtotal: project.price };
  const projectItems = project.items.map((item) => ({ ...EMPTY_ITEM, item_id: item.item_id, project_id: project.id, item_name: item.item_name ?? "", qty: item.qty, price: 0, subtotal: 0 }));

  return [projectHeader, ...projectItems];
};

/**
 * Toggle project selection.
 * @param {OrderCreateFormState} form - Current form.
 * @param {string} projectId - Project ID.
 * @param {OrderProjectOption[]} projects - Project options.
 * @returns {OrderCreateFormState} Updated form.
 */
const _toggleProject = (form: OrderCreateFormState, projectId: string, projects: OrderProjectOption[]): OrderCreateFormState => {
  if (form.rental_transaction_items.some((item) => item.project_id === projectId)) return { ...form, rental_transaction_items: form.rental_transaction_items.filter((item) => item.project_id !== projectId) };

  const project = projects.find((option) => option.id === projectId);

  if (!project) return form;

  return { ...form, rental_transaction_items: [...form.rental_transaction_items, ..._buildProjectRows(project)] };
};

/**
 * Reset item rows when the service type changes.
 * @param {OrderItemPayload[]} items - Current item rows.
 * @param {string} serviceTypeName - Selected service type name.
 * @returns {OrderItemPayload[]} Empty rows for PROJECT, otherwise rows without project links.
 */
const _resetItemsForServiceType = (items: OrderItemPayload[], serviceTypeName: string): OrderItemPayload[] => (
  serviceTypeName.trim().toUpperCase() === "PROJECT" ? [] : items.map((item) => ({ ...item, project_id: null }))
);

/**
 * Create handlers for plain form fields and item rows.
 * @param {FormSetter} setForm - Form state setter.
 * @returns {FieldActions} Field action handlers.
 */
const _createFieldActions = (setForm: FormSetter): FieldActions => {
  /**
   * Set a form field value.
   * @param {keyof OrderCreateFormState} field - Form field name.
   * @param {FormFieldValue} value - Form field value.
   * @returns {void} Nothing.
   */
  const onChange = (field: keyof OrderCreateFormState, value: FormFieldValue): void => setForm((previous) => ({ ...previous, [field]: value }));
  /**
   * Remove an item row.
   * @param {number} index - Row index.
   * @returns {void} Nothing.
   */
  const onRemoveItem = (index: number): void => setForm((previous) => ({ ...previous, rental_transaction_items: previous.rental_transaction_items.filter((_item, itemIndex) => itemIndex !== index) }));
  /**
   * Append an empty item row.
   * @returns {void} Nothing.
   */
  const onAddItem = (): void => setForm((previous) => ({ ...previous, rental_transaction_items: [...previous.rental_transaction_items, EMPTY_ITEM] }));
  /**
   * Set selected PIC.
   * @param {string} picId - PIC ID.
   * @returns {void} Nothing.
   */
  const onPicChange = (picId: string): void => onChange("pic_id", picId);
  /**
   * Set selected order type.
   * @param {string} orderTypeId - Order type ID.
   * @returns {void} Nothing.
   */
  const onOrderTypeChange = (orderTypeId: string): void => onChange("order_type_id", orderTypeId);
  /**
   * Set rental handover identity type.
   * @param {string} handoverType - Identity document type.
   * @returns {void} Nothing.
   */
  const onHandoverTypeChange = (handoverType: string): void => onChange("handover_type", handoverType);

  return { onChange, onRemoveItem, onAddItem, onPicChange, onOrderTypeChange, onHandoverTypeChange };
};

/**
 * Create handlers for customer, voucher, and service type selection.
 * @param {FormSetter} setForm - Form state setter.
 * @param {FormActionOptions} options - Select options.
 * @returns {OptionActions} Option action handlers.
 */
const _createOptionActions = (setForm: FormSetter, options: FormActionOptions): OptionActions => {
  /**
   * Fill customer fields from the selected customer.
   * @param {string} customerId - Customer ID.
   * @returns {void} Nothing.
   */
  const onCustomerChange = (customerId: string): void => {
    const customer = options.customers.find((option) => option.id === customerId);

    if (customer) setForm((previous) => ({ ...previous, customer_id: customer.id, customer_name: customer.name, customer_phone: customer.phone_number, address: customer.address }));
  };
  /**
   * Set selected voucher and its discount.
   * @param {VoucherSelection} voucherId - Voucher ID; empty when cleared.
   * @returns {void} Nothing.
   */
  const onVoucherChange = (voucherId: VoucherSelection): void => {
    const voucher = voucherId ? options.vouchers.find((option) => option.id === voucherId) : undefined;

    setForm((previous) => ({ ...previous, voucher_id: voucherId || null, discount: voucher?.discount_percent ?? 0 }));
  };
  /**
   * Set selected service type and reset incompatible item rows.
   * @param {string} serviceTypeId - Service type ID.
   * @returns {void} Nothing.
   */
  const onServiceTypeChange = (serviceTypeId: string): void => {
    const serviceTypeName = options.serviceTypes.find((option) => option.id === serviceTypeId)?.name ?? "";

    setForm((previous) => ({ ...previous, service_type_id: serviceTypeId, service_type_name: serviceTypeName, rental_transaction_items: _resetItemsForServiceType(previous.rental_transaction_items, serviceTypeName) }));
  };

  return { onCustomerChange, onVoucherChange, onServiceTypeChange };
};

/**
 * Create handlers for item and project row selection.
 * @param {FormSetter} setForm - Form state setter.
 * @param {FormActionOptions} options - Select options.
 * @returns {ItemActions} Item action handlers.
 */
const _createItemActions = (setForm: FormSetter, options: FormActionOptions): ItemActions => {
  const { items, projects } = options;
  /**
   * Link a row to a project.
   * @param {number} index - Row index.
   * @param {string} projectId - Project ID.
   * @returns {void} Nothing.
   */
  const onProjectSelect = (index: number, projectId: string): void => setForm((previous) => ({ ...previous, rental_transaction_items: previous.rental_transaction_items.map((item, itemIndex) => (itemIndex === index ? { ...item, project_id: projectId } : item)) }));
  /**
   * Fill a row from the selected item.
   * @param {number} index - Row index.
   * @param {string} itemId - Item ID.
   * @returns {void} Nothing.
   */
  const onItemSelect = (index: number, itemId: string): void => {
    const selectedItem = items.find((item) => item.id === itemId);

    setForm((previous) => ({ ...previous, rental_transaction_items: previous.rental_transaction_items.map((row, rowIndex) => (rowIndex === index ? updateSelectedItem(row, selectedItem) : row)) }));
  };
  /**
   * Update an item row field.
   * @param {number} index - Row index.
   * @param {OrderItemField} field - Item field name.
   * @param {OrderItemFieldValue} value - Item field value.
   * @returns {void} Nothing.
   */
  const onItemChange = (index: number, field: OrderItemField, value: OrderItemFieldValue): void => setForm((previous) => ({ ...previous, rental_transaction_items: previous.rental_transaction_items.map((item, itemIndex) => (itemIndex === index ? _applyItemChange(item, field, value, items) : item)) }));
  /**
   * Toggle item selection.
   * @param {string} itemId - Item ID.
   * @returns {void} Nothing.
   */
  const onToggleItem = (itemId: string): void => setForm((previous) => _toggleItem(previous, itemId, items));
  /**
   * Toggle project selection.
   * @param {string} projectId - Project ID.
   * @returns {void} Nothing.
   */
  const onToggleProject = (projectId: string): void => setForm((previous) => _toggleProject(previous, projectId, projects));

  return { onProjectSelect, onItemSelect, onItemChange, onToggleItem, onToggleProject };
};

/**
 * Create form action handlers.
 * @param {FormSetter} setForm - Form state setter.
 * @param {FormActionOptions} options - Select options used by the handlers.
 * @returns {ActionResult} Form action handlers.
 */
export const createFormActions = (setForm: FormSetter, options: FormActionOptions): ActionResult => ({
  ..._createFieldActions(setForm),
  ..._createOptionActions(setForm, options),
  ..._createItemActions(setForm, options),
});

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

  if (!isProjectServiceType(form)) {
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
  const payloadItems = isProjectServiceType(form) ? items.filter((item) => item.item_id === item.project_id) : items;
  const payload = buildOrderPayload(form, payloadItems, orderTypes);
  const isSaved = await _persistOrder(params, payload, items);

  if (!isSaved) return;

  await _logOrderActivity(params, payload.event_name);
  resolveSubmitRoute(params.navigate, params.id, params.returnUrl);
};
